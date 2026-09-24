import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-charcoal/10 py-8 mt-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-display font-semibold text-charcoal">FoodWise RWP</p>
        <p className="text-xs text-charcoal/50 max-w-md">
          AI-Powered Personalized Food Discovery · Rawalpindi, Pakistan · Prototype — Final Year Project
        </p>
        <div className="flex gap-4 text-xs text-charcoal/50">
          <Link to="/about" className="hover:text-charcoal">About</Link>
          <Link to="/health" className="hover:text-charcoal">Health Disclaimer</Link>
          <a href="https://github.com/" target="_blank" rel="noreferrer" className="hover:text-charcoal">GitHub</a>
        </div>
        <p className="text-xs text-charcoal/30">© 2026 FoodWise RWP</p>
      </div>
    </footer>
  );
}
