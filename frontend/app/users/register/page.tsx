'use client';

import { useState } from 'react';

export default function UsersRegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('usuario');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('http://localhost:9000/backend/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao registrar usuário');
      }

      setSuccess('Usuário registrado com sucesso!');
      setName('');
      setEmail('');
      setPassword('');
      setRole('usuario');

      // Opcional: redirecionar
      // setTimeout(() => window.location.href = '/users', 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-slate-800 w-full max-w-lg p-8 rounded-xl shadow-xl border border-slate-700">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Registrar Usuário
        </h1>

        {error && (
          <div className="bg-red-900/30 text-red-300 border border-red-500 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-900/30 text-green-300 border border-green-500 p-4 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          
          <div>
            <label className="text-slate-300 text-sm">Nome</label>
            <input
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Digite o nome"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm">Email</label>
            <input
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm">Senha</label>
            <input
              type="password"
              value={password}
              required
              minLength={4}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="********"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm">Função (role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full p-3 bg-slate-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="usuario">Usuário</option>
              <option value="vendedor">Vendedor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-semibold transition-colors"
            >
            Registrar
          </button>
        </form>
      </div>
    </div>
  );
}
