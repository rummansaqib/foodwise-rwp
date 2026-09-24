import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICONS = { success: CheckCircle2, info: Info, error: XCircle };
const COLORS = { success: 'text-emerald-600', info: 'text-charcoal/70', error: 'text-red-500' };

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-xs w-full">
      {toasts.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className="bg-white shadow-lift border border-charcoal/10 rounded-xl px-4 py-3 flex items-start gap-2.5 animate-fadeIn cursor-pointer"
            onClick={() => dismissToast(t.id)}
            role="status"
          >
            <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${COLORS[t.type]}`} />
            <p className="text-sm text-charcoal">{t.message}</p>
          </div>
        );
      })}
    </div>
  );
}
