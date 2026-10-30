'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Lock, User, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { loginAction } from '@/infrastructure/actions/authActions';
import { Button } from '@/presentation/components/ui/Button';
import { Input } from '@/presentation/components/ui/Input';

const loginSchema = z.object({
  username: z.string().min(1, 'Digite o nome de usuário'),
  password: z.string().min(1, 'Digite a senha'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin/dashboard';

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginAction(data);
      if (!result.success) {
        setErrorMessage(result.error || 'Credenciais inválidas. Tente novamente.');
        setIsLoading(false);
        return;
      }

      router.push(redirectUrl);
      router.refresh();
    } catch {
      setErrorMessage('Erro de conexão ao autenticar. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl text-white">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-white">
          Painel Administrativo
        </h1>
        <p className="text-sm text-emerald-100/70 mt-1">
          Curadoria & Gestão Atlântica Natural
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-3.5 bg-red-500/20 border border-red-500/40 rounded-xl flex items-start gap-3 text-red-200 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-100/80 mb-1.5">
            Usuário / E-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-300/60">
              <User className="w-4 h-4" />
            </div>
            <Input
              type="text"
              placeholder="admin"
              autoComplete="username"
              className="pl-10 bg-black/20 border-white/15 text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:ring-emerald-400/20"
              {...register('username')}
            />
          </div>
          {errors.username && (
            <p className="text-xs text-red-300 mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-100/80 mb-1.5">
            Senha
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-300/60">
              <Lock className="w-4 h-4" />
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="pl-10 bg-black/20 border-white/15 text-white placeholder:text-emerald-100/40 focus:border-emerald-400 focus:ring-emerald-400/20"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-300 mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/25 mt-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Autenticando...
            </span>
          ) : (
            'Entrar no Painel'
          )}
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 text-center text-xs text-emerald-100/50">
        Acesso restrito à revendedora autorizada.
        <br />
        Sessão criptografada com Cookies HTTP-Only.
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-zinc-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-emerald-200/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a Vitrine
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-white text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-400 mb-2" />
              <p className="text-sm text-emerald-200">Carregando painel...</p>
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
