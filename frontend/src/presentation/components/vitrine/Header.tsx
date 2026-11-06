'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  MapPin,
  ShoppingBag,
  Search,
  MessageCircle,
  ShieldCheck,
  FileText,
  Package,
  Globe,
  Users,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Droplets,
  Sparkle,
  Leaf
} from 'lucide-react';
import { useVitrine } from '../../context/VitrineContext';
import { ThemeToggle } from '../common/ThemeToggle';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isRegiaoConfirmada,
    cidadeConfirmada,
    abrirModalTrava,
    regiaoPadrao,
    sacola,
    tirarDuvidaGeral
  } = useVitrine();

  const [busca, setBusca] = useState('');
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busca.trim()) {
      router.push('/produtos');
      return;
    }
    router.push(`/produtos?busca=${encodeURIComponent(busca.trim())}`);
    setMenuMobileAberto(false);
  };

  const handleNavegarSecao = (e: React.MouseEvent, idOuRota: string) => {
    e.preventDefault();
    setMenuMobileAberto(false);

    if (idOuRota.startsWith('#')) {
      const secaoId = idOuRota.replace('#', '');
      if (pathname === '/') {
        const el = document.getElementById(secaoId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      router.push(`/${idOuRota}`);
    } else {
      router.push(idOuRota);
    }
  };

  const handleAbrirSacola = () => {
    setMenuMobileAberto(false);
    if (sacola.temItens) {
      const el = document.getElementById('barra-sacola-flutuante');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    // Se a sacola estiver vazia, leva para a seção de pronta-entrega para escolher
    if (pathname === '/') {
      const el = document.getElementById('secao-pronta-entrega');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    router.push('/#secao-pronta-entrega');
  };

  const cidadeExibida = isRegiaoConfirmada && cidadeConfirmada ? cidadeConfirmada : regiaoPadrao;

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#0c1810] shadow-xs border-b border-gray-100 dark:border-gray-800 transition-colors">
      {/* 1. Barra Superior Institucional e Acessos de Apoio (Recua/some ao rolar a página) */}
      <div
        data-testid="top-bar-institucional"
        className={`bg-brand-950 text-brand-100 text-[11px] sm:text-xs px-4 sm:px-6 lg:px-8 border-b border-brand-900/60 transition-all duration-300 ease-in-out overflow-hidden ${
          scrolled
            ? 'max-h-0 opacity-0 -translate-y-full py-0 border-b-0 pointer-events-none'
            : 'max-h-14 opacity-100 translate-y-0 py-1.5'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <span className="inline-flex items-center gap-1.5 font-medium truncate">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <span className="truncate">Valesca Braga dos Reis - Revendedora Autorizada Atlântica Natural</span>
            </span>
            <span className="hidden lg:inline-block text-brand-400">•</span>
            <span className="hidden lg:inline-block text-brand-200">
              Estoque local com pronta-entrega imediata
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Oportunidade de Revenda B2B */}
            <button
              onClick={(e) => handleNavegarSecao(e, '#secao-seja-revendedor')}
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-brand-200"
            >
              <Users className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline font-medium">Seja um(a) Revendedor(a)</span>
              <span className="sm:hidden font-medium">Revenda</span>
            </button>

            <span className="text-brand-700 hidden sm:inline">•</span>

            {/* Acesso Administrativo do Revendedor */}
            <Link
              href="/admin/login"
              className="hover:text-white transition-colors flex items-center gap-1.5 text-brand-200"
              title="Acessar o Painel Administrativo do Revendedor"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-medium">Área do Revendedor</span>
              <span className="sm:hidden font-medium">Entrar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Barra Principal: Logo, Campo de Busca e Ações Principais do Usuário */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo Oficial da Atlântica Natural */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center p-1 rounded-2xl bg-white dark:bg-white/95 border border-gray-100 dark:border-gray-800 shadow-xs group-hover:scale-105 transition-all">
              <Image
                src="/logo-atlantica.png"
                alt="Logo Atlântica Natural"
                width={52}
                height={52}
                className="w-auto h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-outfit font-black text-base sm:text-xl text-brand-950 dark:text-white tracking-tight leading-none">
                Atlântica Natural
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Vitrine & Pronta-Entrega
              </span>
            </div>
          </Link>

          {/* Campo de Busca Central ("Digite o que você procura...") */}
          <form
            onSubmit={handleBuscar}
            className="hidden md:flex flex-1 max-w-xl relative items-center"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Digite o que você procura... (Ex: Melaleuca, Perfume, Própolis)"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full h-11 pl-4 pr-11 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50/80 dark:bg-[#15251b] text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:bg-white dark:focus:bg-[#101c14] transition-all shadow-inner"
              />
              <button
                type="submit"
                aria-label="Buscar produtos"
                className="absolute right-1.5 top-1.5 bottom-1.5 w-8 rounded-full bg-brand-900 text-white flex items-center justify-center hover:bg-brand-800 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Ações do Usuário: Atendimento, Minha Sacola e Alternador de Tema */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Atendimento WhatsApp */}
            <button
              onClick={tirarDuvidaGeral}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors cursor-pointer group"
              title="Falar no WhatsApp da Revendedora Valesca"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider leading-none">
                  Fale Conosco
                </span>
                <span className="text-xs font-bold text-foreground leading-tight mt-0.5">
                  Atendimento
                </span>
              </div>
            </button>

            {/* Minha Sacola com Contador */}
            <button
              onClick={handleAbrirSacola}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-left hover:bg-emerald-50 dark:hover:bg-brand-950/50 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800/60 transition-colors cursor-pointer group"
              title="Visualizar Sacola de Pronta-Entrega"
            >
              <div className="relative w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 flex items-center justify-center text-brand-900 dark:text-brand-300 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
                {sacola.quantidadeTotal > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-brand-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {sacola.quantidadeTotal}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider leading-none">
                  {sacola.temItens ? `${sacola.quantidadeTotal} item(ns)` : 'Pronta-Entrega'}
                </span>
                <span className="text-xs font-bold text-brand-900 dark:text-brand-300 leading-tight mt-0.5">
                  Minha Sacola
                </span>
              </div>
            </button>

            {/* Alternador de Tema Claro/Escuro (Apenas Ícone) */}
            <div className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 transition-colors">
              <ThemeToggle />
            </div>

            {/* Botão Hambúrguer Mobile */}
            <button
              onClick={() => setMenuMobileAberto(!menuMobileAberto)}
              className="md:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              {menuMobileAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Campo de Busca no Mobile */}
        <form onSubmit={handleBuscar} className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="O que você procura? (Ex: Melaleuca...)"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full h-10 pl-3.5 pr-10 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#15251b] text-xs text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
            <button
              type="submit"
              aria-label="Buscar produtos"
              className="absolute right-1 top-1 bottom-1 w-8 rounded-full bg-brand-900 text-white flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* 3. Barra Verde de Navegação (Trava Geográfica + Categorias Reais de Produtos) */}
      <nav className="bg-brand-900 text-white dark:bg-[#0e2c1a] border-t border-brand-800 dark:border-brand-900/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 py-2 sm:py-2.5 overflow-x-auto scrollbar-none">
            {/* Trava Geográfica ("Entregando em: Varginha") inspirada no "Insira seu CEP" do Mundo Verde */}
            <button
              onClick={abrirModalTrava}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isRegiaoConfirmada
                  ? 'bg-brand-950/80 hover:bg-brand-950 text-white border border-brand-700/80'
                  : 'bg-amber-400 text-brand-950 font-bold hover:bg-amber-300 shadow-xs animate-pulse'
              }`}
              title="Clique para alterar a cidade de entrega"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
              <span>
                Entregando em: <strong className="underline underline-offset-2">{cidadeExibida}</strong>{' '}
                <span className="text-[11px] opacity-90">(Alterar)</span>
              </span>
            </button>

            {/* Menu Focado em Compras: Pronta-Entrega, Categorias Reais e Matriz */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={(e) => handleNavegarSecao(e, '#secao-pronta-entrega')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-100 hover:text-white hover:bg-brand-800 dark:hover:bg-brand-900/80 transition-colors cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pronta-Entrega</span>
              </button>

              {/* Categorias Principais de Produtos */}
              <Link
                href="/produtos?busca=óleo"
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-200 hover:text-white hover:bg-brand-800 dark:hover:bg-brand-900/80 transition-colors"
              >
                <Droplets className="w-3.5 h-3.5 text-emerald-300" />
                <span>Óleos Essenciais</span>
              </Link>

              <Link
                href="/produtos?busca=cosmético"
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-200 hover:text-white hover:bg-brand-800 dark:hover:bg-brand-900/80 transition-colors"
              >
                <Sparkle className="w-3.5 h-3.5 text-gold-300" />
                <span>Cosméticos</span>
              </Link>

              <Link
                href="/produtos?busca=suplemento"
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-brand-200 hover:text-white hover:bg-brand-800 dark:hover:bg-brand-900/80 transition-colors"
              >
                <Leaf className="w-3.5 h-3.5 text-emerald-300" />
                <span>Suplementos</span>
              </Link>

              {/* Catálogo Completo com Filtros */}
              <Link
                href="/produtos"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-100 hover:text-white hover:bg-brand-800 dark:hover:bg-brand-900/80 transition-colors"
              >
                <Search className="w-3.5 h-3.5 text-gold-400" />
                <span>Catálogo Completo</span>
              </Link>

              {/* Matriz Oficial (Envio Nacional) */}
              <button
                onClick={(e) => handleNavegarSecao(e, '#secao-matriz')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-100 hover:text-white hover:bg-brand-800 dark:hover:bg-brand-900/80 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>Matriz Oficial (Brasil)</span>
              </button>

              {/* Revista Digital (Link único para PDF) */}
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-100 hover:text-white hover:bg-brand-800 dark:hover:bg-brand-900/80 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-emerald-300" />
                <span>Revista PDF</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 4. Menu Drawer Mobile Expansível */}
      {menuMobileAberto && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0c1810] px-4 py-4 space-y-4 animate-in slide-in-from-top-3 duration-200 shadow-xl">
          {/* Cidade Mobile */}
          <div className="p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-900 dark:text-brand-300 shrink-0" />
              <div className="text-xs">
                <span className="text-muted-foreground block text-[10px]">Região de entrega:</span>
                <strong className="text-foreground">{cidadeExibida}</strong>
              </div>
            </div>
            <button
              onClick={() => {
                setMenuMobileAberto(false);
                abrirModalTrava();
              }}
              className="text-xs font-bold text-brand-900 dark:text-brand-300 px-2.5 py-1 rounded-lg bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 shadow-xs cursor-pointer"
            >
              Alterar
            </button>
          </div>

          {/* Links de Categorias e Seções no Mobile */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block px-2 mb-1">
              Comprar por Categoria
            </span>

            <button
              onClick={(e) => handleNavegarSecao(e, '#secao-pronta-entrega')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-left text-sm font-semibold text-foreground transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Estoque de Pronta-Entrega</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <Link
              href="/produtos?busca=óleo"
              onClick={() => setMenuMobileAberto(false)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-left text-sm font-semibold text-foreground transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Droplets className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Óleos Essenciais</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            <Link
              href="/produtos?busca=cosmético"
              onClick={() => setMenuMobileAberto(false)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-left text-sm font-semibold text-foreground transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkle className="w-4 h-4 text-gold-500" />
                <span>Cosméticos & Beleza</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            <Link
              href="/produtos"
              onClick={() => setMenuMobileAberto(false)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-left text-sm font-semibold text-foreground transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-brand-700 dark:text-brand-400" />
                <span>Catálogo Completo com Filtros</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            <button
              onClick={(e) => handleNavegarSecao(e, '#secao-matriz')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-left text-sm font-semibold text-foreground transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-500" />
                <span>Destaques da Matriz (Brasil)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            <Link
              href="/catalogo"
              onClick={() => setMenuMobileAberto(false)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-left text-sm font-semibold text-foreground transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Revista Digital Oficial (PDF)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            <button
              onClick={(e) => handleNavegarSecao(e, '#secao-seja-revendedor')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 text-left text-sm font-semibold text-foreground transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-gold-500" />
                <span>Seja um(a) Revendedor(a)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Ações de Apoio no Mobile com Texto */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMenuMobileAberto(false);
                tirarDuvidaGeral();
              }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Atendimento</span>
            </button>

            <Link
              href="/admin/login"
              onClick={() => setMenuMobileAberto(false)}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-foreground text-xs font-bold transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span>Área Revendedor</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
