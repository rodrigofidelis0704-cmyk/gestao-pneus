'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/');
    });
  }, [router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace('/');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) router.replace('/');
        else setMessage('Cadastro realizado. Verifique seu e-mail para confirmar o acesso.');
      }
    } catch (err: any) {
      setMessage(err?.message ?? 'Não foi possível concluir o acesso.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="loginPage">
      <section className="loginCard">
        <div className="loginBrand">GESTÃO DE PNEUS <span>BETMIX</span></div>
        <h1>{mode === 'login' ? 'Acessar o sistema' : 'Criar acesso'}</h1>
        <p>Estoque, pneus em uso, serviços e sucata em um único ambiente.</p>
        <form onSubmit={submit} className="loginForm">
          <label>E-mail<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" /></label>
          <label>Senha<input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></label>
          <button className="loginPrimary" disabled={loading}>{loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}</button>
        </form>
        {message && <div className="loginMessage">{message}</div>}
        <button className="loginLink" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }}>
          {mode === 'login' ? 'Primeiro acesso? Criar conta' : 'Já tenho conta'}
        </button>
      </section>
    </main>
  );
}
