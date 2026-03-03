import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// Pages (lazy-loaded for code splitting)
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Usage from './pages/Usage';
import Billing from './pages/Billing';
import Invoices from './pages/Invoices';
import Success from './pages/Success';
import Cancel from './pages/Cancel';

// ─── Layout Wrappers ─────────────────────────────────────────────────────────

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-3 text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

// ─── Inline Login / Register pages ───────────────────────────────────────────

const AuthPageInner = ({ mode }) => {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = React.useState({ name: '', email: '', password: '' });
  const [error, setError] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'register') {
        await register(form.name, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-indigo-600">
            <span className="text-3xl">🤖</span> Phu-AI
          </a>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {mode === 'register' ? 'Create your account' : 'Welcome back'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {mode === 'register' ? 'Start your 14-day free trial' : 'Sign in to your workspace'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="label">Full name</label>
              <input
                name="name"
                type="text"
                required
                className="input"
                placeholder="Jane Doe"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <label className="label">Email address</label>
            <input
              name="email"
              type="email"
              required
              className="input"
              placeholder="jane@company.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={8}
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full"
          >
            {submitting
              ? mode === 'register' ? 'Creating account…' : 'Signing in…'
              : mode === 'register' ? 'Create account' : 'Sign in'}
          </button>

          <p className="text-center text-sm text-gray-500">
            {mode === 'register' ? (
              <>Already have an account? <a href="/login" className="text-indigo-600 font-medium hover:underline">Sign in</a></>
            ) : (
              <>Don't have an account? <a href="/register" className="text-indigo-600 font-medium hover:underline">Sign up free</a></>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<AuthPageInner mode="login" />} />
          <Route path="/register" element={<AuthPageInner mode="register" />} />

          {/* Protected */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/invoices" element={<Invoices />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
