import { useState, FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Leaf, Menu as MenuIcon, Search, UserCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/find-food', label: 'Find Food' },
  { to: '/restaurants', label: 'Restaurants' },
  { to: '/history', label: 'History' },
  { to: '/favorites', label: 'Favorites' },
  { to: '/health', label: 'Health & Diet' },
];

export default function Navbar() {
  const { role, setRole, isConnected, authUser, profile } = useApp();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/restaurants?q=${encodeURIComponent(search.trim())}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-charcoal/10">
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Leaf className="w-5 h-5 text-emerald-700" />
          <span className="font-display font-semibold text-charcoal">FoodWise <span className="text-emerald-700">RWP</span></span>
        </Link>

        {role === 'user' && (
          <>
            <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) => `transition-colors ${isActive ? 'text-emerald-700' : 'text-charcoal/60 hover:text-charcoal'}`}
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
            <form onSubmit={submitSearch} className="hidden md:flex items-center bg-white border border-charcoal/10 rounded-full px-3 py-1.5 flex-1 max-w-xs">
              <Search className="w-3.5 h-3.5 text-charcoal/40 mr-2 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants or food..."
                aria-label="Search restaurants or food"
                className="bg-transparent text-sm outline-none w-full"
              />
            </form>
          </>
        )}

        <div className="flex items-center gap-3 shrink-0">
          {role === 'user' && (
            <Link to="/account" className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-charcoal/70 hover:text-charcoal">
              <UserCircle className="w-4 h-4" />
              {isConnected ? authUser?.name.split(' ')[0] : profile.name.split(' ')[0]}
            </Link>
          )}
          <div className="hidden sm:flex items-center gap-1 bg-charcoal/5 rounded-full p-1 text-xs font-medium">
            <span className="px-2 text-charcoal/40">Prototype Demo Mode</span>
            <button onClick={() => setRole('user')} className={`px-3 py-1.5 rounded-full transition-colors ${role === 'user' ? 'bg-emerald-700 text-white' : 'text-charcoal/60'}`}>User</button>
            <button onClick={() => setRole('admin')} className={`px-3 py-1.5 rounded-full transition-colors ${role === 'admin' ? 'bg-charcoal text-white' : 'text-charcoal/60'}`}>Admin</button>
          </div>
          <button onClick={() => setOpen((o) => !o)} className="lg:hidden text-charcoal" aria-label="Toggle menu">
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {open && role === 'user' && (
        <div className="lg:hidden flex flex-col border-t border-charcoal/10 bg-white">
          <form onSubmit={submitSearch} className="flex items-center bg-cream rounded-full px-3 py-2 m-4">
            <Search className="w-3.5 h-3.5 text-charcoal/40 mr-2" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search restaurants or food..." className="bg-transparent text-sm outline-none w-full" />
          </form>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)} className="text-left px-5 py-3 text-sm border-b border-charcoal/5">
              {n.label}
            </NavLink>
          ))}
          <div className="flex gap-2 p-4">
            <button onClick={() => { setRole('user'); setOpen(false); }} className="flex-1 py-2 rounded-lg bg-emerald-700 text-white text-sm">User</button>
            <button onClick={() => { setRole('admin'); setOpen(false); }} className="flex-1 py-2 rounded-lg bg-charcoal text-white text-sm">Admin</button>
          </div>
        </div>
      )}
    </header>
  );
}
