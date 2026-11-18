import re
import time
from typing import Dict, Any, Optional, List, Tuple
from urllib.parse import urlparse, urljoin

import httpx
from bs4 import BeautifulSoup

from src.core.config import settings


class AtlanticaScraper:
    """
    Serviço de infraestrutura para extrair dados (scraping) do site da Atlântica Natural.
    """

    _CATEGORIES_CACHE_TTL_SECONDS = 600
    _categories_cache: Dict[str, Tuple[float, List[Dict[str, str]]]] = {}

    def __init__(
        self,
        revendedora_url: Optional[str] = None,
        username: Optional[str] = None,
        password: Optional[str] = None,
    ):
        # Usamos um User-Agent comum para evitar bloqueios simples por proteção anti-bot
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        }
        self.revendedora_url = (
            settings.ATLANTICA_REVENDEDORA_URL if revendedora_url is None else revendedora_url
        )
        self.username = settings.ATLANTICA_USERNAME if username is None else username
        self.password = settings.ATLANTICA_PASSWORD if password is None else password

    def _should_authenticate(self, url: str) -> bool:
        if not (self.revendedora_url and self.username and self.password):
            return False
        target_host = urlparse(url).netloc.lower()
        store_host = urlparse(self.revendedora_url).netloc.lower()
        return bool(target_host and store_host and target_host == store_host)

    @staticmethod
    def _base_origin(url: str) -> str:
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"

    @staticmethod
    def normalize_category_url(url: str) -> str:
        parsed = urlparse(url.strip())
        path = parsed.path.rstrip("/")
        return f"{parsed.scheme}://{parsed.netloc}{path}"

    async def _authenticate(self, client: httpx.AsyncClient) -> None:
        # 1. Acessa a URL da revendedora para obter o cookie CartCode da sessão
        store_response = await client.get(self.revendedora_url, timeout=15.0)
        store_response.raise_for_status()

        login_url = f"{self._base_origin(self.revendedora_url)}/clientes/login"

        # 2. Submete o formulário de login da loja na mesma sessão com cookies
        login_payload = {
            "ReturnUrl": "",
            "Username": self.username,
            "Password": self.password,
            "Remember": "true",
            "Remember_Hidden": "false",
        }
        login_response = await client.post(login_url, data=login_payload, timeout=15.0)
        login_response.raise_for_status()

        final_url = str(getattr(login_response, "url", "")).lower()
        if "/clientes/login" in final_url:
            raise Exception(
                "Falha ao autenticar no portal da Atlântica Natural. Verifique as credenciais."
            )

    @staticmethod
    def _parse_price(text: str) -> float:
        match = re.search(r"R\$\s*(\d+(?:\.\d{3})*(?:,\d{2})?|\d+(?:,\d{2})?)", text)
        if not match:
            return 0.0
        price_str = match.group(1).replace(".", "").replace(",", ".")
        try:
            return float(price_str)
        except ValueError:
            return 0.0

    @staticmethod
    def _extract_title(soup: BeautifulSoup) -> str:
        h1_tag = soup.find("h1")
        if h1_tag:
            return h1_tag.get_text(strip=True)

        product_title = soup.select_one("h4.product_title, h6.product_title")
        if product_title:
            return product_title.get_text(strip=True)

        meta_title = soup.find("meta", property="og:title")
        if meta_title:
            return meta_title.get("content", "")

        return ""

    @staticmethod
    def _extract_image(soup: BeautifulSoup, base_origin: str) -> str:
        meta_image = soup.find("meta", property="og:image")
        if meta_image:
            content = (meta_image.get("content") or "").strip()
            if content:
                return content

        # Fallback para modal /visualizar/{id} ou cards sem OpenGraph
        for selector in ("img#product_img", ".product_img img", ".product_img_box img"):
            img = soup.select_one(selector)
            if img and img.get("src"):
                return urljoin(base_origin, img["src"].strip())

        return ""

    @staticmethod
    def _extract_description(soup: BeautifulSoup) -> str:
        meta_desc = soup.find("meta", property="og:description")
        if meta_desc:
            content = (meta_desc.get("content") or "").strip()
            if content:
                return content

        for selector in (".pr_desc", ".tab-content"):
            element = soup.select_one(selector)
            if element:
                text = element.get_text(" ", strip=True)
                if text:
                    return text

        return ""

    @classmethod
    def _extract_price(cls, soup: BeautifulSoup) -> float:
        # Tentativa 1: Meta tag OpenGraph de preço
        meta_price = soup.find("meta", property="product:price:amount")
        if meta_price:
            try:
                return float(meta_price.get("content", "0"))
            except ValueError:
                pass

        # Tentativa 2: Seletores específicos da página de produto da loja
        for selector in (".product_price .price", ".pr_detail .price", ".product_description .price"):
            price_el = soup.select_one(selector)
            if price_el:
                parsed = cls._parse_price(price_el.get_text(strip=True))
                if parsed > 0.0:
                    return parsed

        # Tentativa 3: Fallback genérico ignorando o total do carrinho no cabeçalho
        for text_node in soup.find_all(string=re.compile(r"R\$\s*\d+")):
            parent = text_node.parent
            if parent and any(
                "cart_total" in (el.get("class") or []) or "cart_box" in (el.get("class") or [])
                for el in [parent, *parent.parents]
            ):
                continue
            parsed = cls._parse_price(str(text_node))
            if parsed > 0.0:
                return parsed

        return 0.0

    async def fetch_product_data(self, url: str) -> Dict[str, Any]:
        """
        Visita a URL do produto (autenticando quando necessário) e extrai nome, preço, imagem e descrição.
        """
        async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
            try:
                if self._should_authenticate(url):
                    await self._authenticate(client)
                response = await client.get(url, timeout=15.0)
                response.raise_for_status()
            except httpx.HTTPError as e:
                raise Exception(f"Erro ao acessar a URL da matriz: {str(e)}")

        soup = BeautifulSoup(response.text, "lxml")
        base_origin = self._base_origin(url)

        # Caso o usuário cole uma URL /visualizar/{id}, extrai a URL canônica do produto se disponível
        canonical_url = url
        if "/visualizar/" in urlparse(url).path:
            title_link = soup.select_one("h4.product_title a[href*='/produtos/']")
            if title_link and title_link.get("href"):
                canonical_url = urljoin(base_origin, title_link["href"].strip())

        title = self._extract_title(soup)
        image_url = self._extract_image(soup, base_origin)
        description = self._extract_description(soup)
        price = self._extract_price(soup)

        return {
            "nome": title,
            "imagem_url": image_url,
            "descricao": description,
            "preco": price,
            "url_origem": canonical_url,
        }

    async def fetch_categories(self, force_refresh: bool = False) -> List[Dict[str, str]]:
        """
        Lista as categorias disponíveis no menu da loja oficial (com cache em memória por TTL).
        """
        if not self.revendedora_url:
            return []

        now = time.monotonic()
        cached = self._categories_cache.get(self.revendedora_url)
        if not force_refresh and cached and (now - cached[0]) < self._CATEGORIES_CACHE_TTL_SECONDS:
            return list(cached[1])

        async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
            try:
                if self._should_authenticate(self.revendedora_url):
                    await self._authenticate(client)
                response = await client.get(self._base_origin(self.revendedora_url), timeout=15.0)
                response.raise_for_status()
            except httpx.HTTPError as e:
                raise Exception(f"Erro ao listar categorias da matriz: {str(e)}")

        soup = BeautifulSoup(response.text, "lxml")
        base_origin = self._base_origin(self.revendedora_url)

        categorias: List[Dict[str, str]] = []
        seen_urls = set()
        for link in soup.find_all("a", href=True):
            href = link["href"].strip()
            if "/produtos/categoria/" not in href:
                continue
            nome = link.get_text(" ", strip=True)
            if not nome:
                continue
            canonical_url = self.normalize_category_url(urljoin(base_origin, href))
            if canonical_url in seen_urls:
                continue
            seen_urls.add(canonical_url)
            categorias.append({"nome": nome, "url": canonical_url})

        self._categories_cache[self.revendedora_url] = (now, categorias)
        return list(categorias)

    async def fetch_category_products(self, category_url: str, page_size: int = 100) -> List[Dict[str, Any]]:
        """
        Extrai todos os produtos de uma categoria (paginando automaticamente) em sessão autenticada.
        """
        canonical_category_url = self.normalize_category_url(category_url)
        base_origin = self._base_origin(canonical_category_url)

        produtos: List[Dict[str, Any]] = []
        seen_product_urls = set()
        max_pages = 20

        async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
            try:
                if self._should_authenticate(canonical_category_url):
                    await self._authenticate(client)

                for pagina in range(1, max_pages + 1):
                    paginated_url = (
                        f"{canonical_category_url}?pagina={pagina}&quantidade={page_size}&ordenacao=Latest"
                    )
                    response = await client.get(paginated_url, timeout=20.0)
                    response.raise_for_status()

                    soup = BeautifulSoup(response.text, "lxml")
                    if pagina == 1 and not soup.select_one(".shop_container"):
                        raise ValueError("A URL informada não corresponde a uma página de categoria válida.")

                    cards = soup.select(".shop_container .product")
                    if not cards:
                        break

                    for card in cards:
                        link_el = card.select_one(".product_img a[href*='/produtos/']") or card.select_one(
                            "a[href*='/produtos/']"
                        )
                        if not link_el or not link_el.get("href"):
                            continue

                        prod_url = urljoin(base_origin, link_el["href"].strip()).split("?")[0]
                        if prod_url in seen_product_urls:
                            continue
                        seen_product_urls.add(prod_url)

                        nome = self._extract_title(card)
                        if not nome:
                            img_el = card.select_one(".product_img img[alt]")
                            nome = (img_el.get("alt") or "").strip() if img_el else ""
                        if not nome:
                            continue

                        produtos.append(
                            {
                                "nome": nome,
                                "imagem_url": self._extract_image(card, base_origin),
                                "descricao": self._extract_description(card),
                                "preco": self._extract_price(card),
                                "url_origem": prod_url,
                                "categoria_origem": canonical_category_url,
                            }
                        )

                    if len(cards) < page_size:
                        break
            except httpx.HTTPError as e:
                raise Exception(f"Erro ao acessar a categoria da matriz: {str(e)}")

        return produtos
