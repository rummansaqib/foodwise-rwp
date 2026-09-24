import { X } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

export default function Modal({
  open, onClose, title, subtitle, children,
}: { open: boolean; onClose: () => void; title: string; subtitle?: string; children: ReactNode }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl2 max-w-md w-full p-6 shadow-lift max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-lg text-charcoal">{title}</h3>
            {subtitle && <p className="text-sm text-charcoal/60">{subtitle}</p>}
          </div>
          <button onClick={onClose} aria-label="Close dialog" className="text-charcoal/40 hover:text-charcoal">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
