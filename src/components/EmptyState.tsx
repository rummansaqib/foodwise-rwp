import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon, title, message, actionLabel, actionTo,
}: { icon: ReactNode; title: string; message: string; actionLabel?: string; actionTo?: string }) {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 text-emerald-600">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-charcoal text-lg">{title}</h3>
      <p className="text-charcoal/60 text-sm mt-1 max-w-sm mx-auto">{message}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="inline-block mt-4 text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg px-4 py-2 transition-colors">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
