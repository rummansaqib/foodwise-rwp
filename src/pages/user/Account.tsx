import { useState, FormEvent } from 'react';
import { LogOut, ShieldCheck, ShieldAlert, UserCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function Account() {
  const {
    backendAvailable, authUser, isConnected, signup, login, logout, profile,
  } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    const result = mode === 'login' ? await login(email, password) : await signup(name, email, password);
    setBusy(false);
    if (!result.ok) setError(result.error || 'Something went wrong.');
  };

  return (
    <div className="max-w-md mx-auto px-4 md:px-6 py-10 pb-16">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-1">Account</h1>

      <div className={`mt-4 mb-6 rounded-xl p-3 flex items-center gap-2 text-xs font-medium ${backendAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-charcoal/5 text-charcoal/60'}`}>
        {backendAvailable ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
        {backendAvailable
          ? 'Connected to FoodWise backend — real accounts and saved history are active.'
          : 'No backend detected — using local Prototype Demo Mode. Start the FastAPI backend to enable real accounts.'}
      </div>

      {isConnected ? (
        <div className="bg-white rounded-xl2 shadow-soft border border-charcoal/5 p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <UserCircle className="w-7 h-7 text-emerald-700" />
            </div>
            <div>
              <p className="font-medium text-charcoal">{authUser!.name}</p>
              <p className="text-sm text-charcoal/50">{authUser!.email}</p>
            </div>
          </div>
          <Link to="/health" className="block mt-4 text-sm font-medium text-emerald-700 border border-emerald-200 rounded-lg py-2 text-center hover:bg-emerald-50 transition-colors">
            Edit Health & Diet Profile
          </Link>
          <button onClick={logout} className="mt-2 w-full text-sm font-medium text-red-600 border border-red-200 rounded-lg py-2 flex items-center justify-center gap-1.5 hover:bg-red-50 transition-colors">
            <LogOut className="w-3.5 h-3.5" /> Log Out
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl2 shadow-soft border border-charcoal/5 p-5">
            <div className="flex gap-2 mb-4">
              <button onClick={() => setMode('login')} className={`flex-1 text-sm font-medium py-2 rounded-lg ${mode === 'login' ? 'bg-emerald-700 text-white' : 'bg-charcoal/5 text-charcoal/60'}`}>Log In</button>
              <button onClick={() => setMode('signup')} className={`flex-1 text-sm font-medium py-2 rounded-lg ${mode === 'signup' ? 'bg-emerald-700 text-white' : 'bg-charcoal/5 text-charcoal/60'}`}>Sign Up</button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-medium text-charcoal/60 block mb-1">Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm" />
                </div>
              )}
              <div>
                <label className="text-xs font-medium text-charcoal/60 block mb-1">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-medium text-charcoal/60 block mb-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full border border-charcoal/15 rounded-lg px-3 py-2 text-sm" />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button disabled={busy} className="w-full bg-emerald-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-800 transition-colors">
                {busy ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>
            {backendAvailable && (
              <p className="text-xs text-charcoal/40 mt-3">Demo login: demo@foodwise.pk / password123</p>
            )}
          </div>

          <div className="mt-6 bg-cream border border-charcoal/10 rounded-xl p-4">
            <p className="text-sm font-medium text-charcoal">Continuing in Demo Mode</p>
            <p className="text-xs text-charcoal/60 mt-1">
              You're currently browsing as <strong>{profile.name}</strong> — favorites, history and reviews are saved locally on this device.
              This works fully offline and needs no account.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
