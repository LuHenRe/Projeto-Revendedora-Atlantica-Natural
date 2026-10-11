import httpx
from bs4 import BeautifulSoup
import re
from typing import Dict, Any

class AtlanticaScraper:
    """
    Serviço de infraestrutura para extrair dados (scraping) do site da Atlântica Natural.
    """
    
    def __init__(self):
        # Usamos um User-Agent comum para evitar bloqueios simples por proteção anti-bot
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
        }

    async def fetch_product_data(self, url: str) -> Dict[str, Any]:
        """
        Visita a URL do produto e extrai nome, preço, imagem e descrição.
        """
        async with httpx.AsyncClient(headers=self.headers, follow_redirects=True) as client:
            try:
                response = await client.get(url, timeout=15.0)
                response.raise_for_status()
            except httpx.HTTPError as e:
                raise Exception(f"Erro ao acessar a URL da matriz: {str(e)}")

        soup = BeautifulSoup(response.text, "lxml")
        
        # 1. Extrair Título
        # Tenta pegar da tag h1, ou meta tag og:title
        title = ""
        h1_tag = soup.find("h1")
        if h1_tag:
            title = h1_tag.get_text(strip=True)
        else:
            meta_title = soup.find("meta", property="og:title")
            if meta_title:
                title = meta_title.get("content", "")

        # 2. Extrair Imagem
        # A melhor fonte de imagem costuma ser a meta tag og:image
        image_url = ""
        meta_image = soup.find("meta", property="og:image")
        if meta_image:
            image_url = meta_image.get("content", "")

        # 3. Extrair Descrição
        description = ""
        meta_desc = soup.find("meta", property="og:description")
        if meta_desc:
            description = meta_desc.get("content", "")
            
        # 4. Extrair Preço
        # Muitas lojas possuem um seletor específico para o preço ou usam metadata (JSON-LD ou meta tags)
        price = 0.0
        
        # Tentativa 1: Meta tags de produto (OpenGraph)
        meta_price = soup.find("meta", property="product:price:amount")
        if meta_price:
            try:
                price = float(meta_price.get("content", "0"))
            except ValueError:
                pass
                
        # Tentativa 2: Buscar padrões comuns de classes CSS (ex: .price, .valor, etc)
        # Como não temos os seletores exatos agora, deixamos um fallback buscando R$ no texto
        if price == 0.0:
            price_element = soup.find(string=re.compile(r"R\$\s*\d+,\d{2}"))
            if price_element:
                # Limpar o texto para extrair apenas o número
                match = re.search(r"R\$\s*(\d+(?:\.\d+)?(?:,\d{2})?)", price_element)
                if match:
                    price_str = match.group(1).replace(".", "").replace(",", ".")
                    try:
                        price = float(price_str)
                    except ValueError:
                        pass
        
        # Retorna o dicionário
        return {
            "nome": title,
            "imagem_url": image_url,
            "descricao": description,
            "preco": price,
            "url_origem": url
        }
