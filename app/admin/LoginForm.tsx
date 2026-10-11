'use client';

import { useState } from 'react';
import { adminLogin } from './actions';

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(formData: FormData) {
    setBusy(true);
    setError(null);
    const res = await adminLogin(formData);
    setBusy(false);
    if (!res.ok) setError(res.error ?? 'Login failed.');
    // on success the cookie is set — reload to show the dashboard
    if (res.ok) window.location.reload();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-sm items-center px-4">
      <form
        action={onSubmit}
        className="glass w-full rounded-2xl p-6"
      >
        <h1 className="text-xl font-extrabold">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-400">Enter the admin password to manage products.</p>
        <label className="mt-5 block text-sm font-semibold text-slate-300">
          Password
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="mt-2 w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-base text-white outline-none focus:border-cyan-400/60"
          />
        </label>
        {error && <p className="mt-3 text-sm font-semibold text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="btn-primary mt-5 w-full py-3 text-base disabled:opacity-50"
        >
          {busy ? 'Checking…' : 'Log In'}
        </button>
      </form>
    </div>
  );
}
