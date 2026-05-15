import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../hooks/useDarkMode';
import { cn } from '../../lib/utils';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/translate', label: 'Translate' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/languages', label: 'Languages' },
  { to: '/train', label: 'Train' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const { isDark, toggle } = useDarkMode();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 dark:bg-charcoal/90 backdrop-blur-md border-b border-amber/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <Link to="/" className="font-cinzel font-bold text-xl text-amber hover:opacity-80 transition-opacity">
          DeepPast
        </Link>
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className={cn('text-sm font-semibold transition-colors hover:text-amber',
                pathname === to ? 'text-amber' : 'text-near-black dark:text-warm-white'
              )}>
              {label}
            </Link>
          ))}
          <button onClick={toggle} className="p-2 rounded-full hover:bg-amber/10 transition-colors" aria-label="Toggle theme">
            {isDark ? <Sun size={18} className="text-amber" /> : <Moon size={18} className="text-near-black" />}
          </button>
        </div>
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-cream dark:bg-charcoal border-b border-amber/20">
            <div className="px-4 py-3 flex flex-col gap-3">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} onClick={() => setOpen(false)}
                  className={cn('font-semibold py-1', pathname === to ? 'text-amber' : '')}>
                  {label}
                </Link>
              ))}
              <button onClick={toggle} className="flex items-center gap-2 py-1">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
