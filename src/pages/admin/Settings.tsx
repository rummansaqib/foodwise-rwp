import { BASE_URL } from '../../services/apiClient';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function Settings() {
  const { backendAvailable } = useApp();
  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto pb-20 md:pb-8">
      <h1 className="font-display text-2xl font-bold text-charcoal mb-6">Settings</h1>

      <div className="bg-white rounded-xl border border-charcoal/5 shadow-soft p-5 space-y-4">
        <div>
          <p className="text-sm font-medium text-charcoal">Backend Connection</p>
          <div className={`mt-2 flex items-center gap-2 text-sm rounded-lg p-3 ${backendAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-charcoal/5 text-charcoal/60'}`}>
            {backendAvailable ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {backendAvailable ? `Connected to ${BASE_URL}` : `Not connected (expected at ${BASE_URL}) — running in local demo mode.`}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal">Prototype Mode</p>
          <p className="text-sm text-charcoal/60 mt-1">
            This is a Final Year Project prototype. Admin access uses simplified Demo Mode role-switching rather
            than a separate login, as specified in the project scope.
          </p>
        </div>
      </div>
    </div>
  );
}
