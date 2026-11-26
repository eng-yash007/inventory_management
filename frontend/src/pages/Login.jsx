import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', { email, password });
      login(response.data.token);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-950">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/30">
            SP
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight">StockPulse</div>
            <div className="text-xs text-indigo-300">Enterprise Inventory OS</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Smarter stock control across every warehouse.
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Monitor live inventory levels, streamline purchase orders, scan barcodes, and coordinate multi-warehouse transfers from a single unified workspace.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {[
              ['Real-time Alerts', 'Instant low-stock thresholds'],
              ['Multi-Warehouse', 'Seamless stock transfers'],
              ['Role-Based Access', 'Admin, Manager & Staff'],
              ['Barcode Ready', 'Built-in camera scanning'],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          StockPulse Inventory Management System
        </div>
      </div>

      {/* Right Sign-in Panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">SP</div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">StockPulse</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Sign in to your account to manage inventory and orders.
          </p>

          <div className="mt-8 bg-white dark:bg-slate-900 py-8 px-6 sm:px-8 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="mt-1.5 block w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="mt-1.5 relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="block w-full px-3.5 py-2.5 pr-16 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div role="alert" className="rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-3.5 py-2.5 text-sm text-rose-700 dark:text-rose-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
