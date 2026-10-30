import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Suporte para Offline-First: permite ler dados do cache mesmo sem conexão
        networkMode: 'offlineFirst',
        // Dados permanecem frescos por 5 minutos
        staleTime: 1000 * 60 * 5,
        // Mantém dados em cache por 24 horas
        gcTime: 1000 * 60 * 60 * 24,
        // Tenta 2 vezes em caso de falha de rede
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // No servidor: sempre cria um novo cliente
    return makeQueryClient();
  } else {
    // No navegador: reutiliza a mesma instância
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
