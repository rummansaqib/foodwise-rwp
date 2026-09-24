export default function ScoreRing({ value }: { value: number }) {
  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg viewBox="0 0 60 60" className="w-16 h-16 -rotate-90">
        <circle cx="30" cy="30" r="26" stroke="#E7E2D6" strokeWidth="6" fill="none" />
        <circle
          cx="30" cy="30" r="26" stroke="#157a56" strokeWidth="6" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-emerald-800">
        {Math.round(value)}%
      </div>
    </div>
  );
}
