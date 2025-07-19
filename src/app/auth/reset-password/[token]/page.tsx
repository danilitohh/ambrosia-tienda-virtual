'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setSuccess('¡Contraseña actualizada! Ahora puedes iniciar sesión.');
      setTimeout(() => router.push('/auth/signin'), 2000);
    } else {
      setError(data.error || 'Error al actualizar la contraseña.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#181818] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-[#C6FF00] text-center">Restablecer contraseña</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]"
            minLength={6}
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[#23272a] border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6FF00] focus:border-[#C6FF00]"
            minLength={6}
            required
          />
          {error && <div className="bg-red-900 text-red-200 px-4 py-2 rounded text-sm">{error}</div>}
          {success && <div className="bg-green-900 text-green-200 px-4 py-2 rounded text-sm">{success}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C6FF00] hover:bg-[#b2e600] text-black font-semibold py-3 px-8 rounded-lg transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? 'Actualizando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
} 