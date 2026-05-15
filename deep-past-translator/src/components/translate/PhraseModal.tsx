import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AkkadianPhrase {
  id: string;
  akkadian: string;
  english: string;
  category: string;
}

const CATEGORIES = ['All', 'Commercial', 'Letters', 'Legal', 'Trade & Goods', 'Fragments'];

const CATEGORY_COLORS: Record<string, string> = {
  Commercial: 'bg-amber/20 text-amber border-amber/30',
  Letters:    'bg-teal/20 text-teal border-teal/30',
  Legal:      'bg-coral/20 text-coral border-coral/30',
  'Trade & Goods': 'bg-green-800/20 text-green-400 border-green-700/30',
  Fragments:  'bg-warm-white/10 text-warm-white/50 border-warm-white/20',
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (phrase: AkkadianPhrase) => void;
}

export default function PhraseModal({ open, onClose, onSelect }: Props) {
  const [phrases, setPhrases] = useState<AkkadianPhrase[]>([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || phrases.length > 0) return;
    setLoading(true);
    fetch('/akkadian-phrases.json')
      .then(r => r.json())
      .then(data => { setPhrases(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 100);
    else { setSearch(''); setActiveCategory('All'); }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return phrases.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = !q ||
        p.akkadian.toLowerCase().includes(q) ||
        p.english.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [phrases, search, activeCategory]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-50 max-w-3xl mx-auto flex flex-col rounded-2xl bg-charcoal border border-amber/20 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber/10">
              <div className="flex items-center gap-3">
                <BookOpen size={18} className="text-amber" />
                <h2 className="font-cinzel font-bold text-lg text-warm-white">Akkadian Phrase Browser</h2>
                <span className="text-xs text-warm-white/40 bg-warm-white/5 px-2 py-0.5 rounded-full">
                  {filtered.length} of {phrases.length}
                </span>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-warm-white/10 transition-colors text-warm-white/50 hover:text-warm-white">
                <X size={18} />
              </button>
            </div>

            {/* Search */}
            <div className="px-5 py-3 border-b border-amber/10">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-white/30" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search Akkadian or English..."
                  className="w-full pl-9 pr-4 py-2.5 bg-warm-white/5 border border-warm-white/10 rounded-xl text-sm text-warm-white placeholder-warm-white/30 focus:outline-none focus:border-amber/40 font-mono"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-white/30 hover:text-warm-white/60">
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 px-5 py-2.5 border-b border-amber/10 overflow-x-auto scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border transition-all',
                    activeCategory === cat
                      ? 'bg-amber text-charcoal border-amber'
                      : 'border-warm-white/10 text-warm-white/50 hover:border-amber/30 hover:text-warm-white/80'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Phrase list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32 text-warm-white/40 text-sm">
                  Loading phrases...
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-warm-white/40 text-sm gap-2">
                  <Search size={24} className="opacity-40" />
                  No phrases match your search
                </div>
              ) : (
                <div className="divide-y divide-warm-white/5">
                  {filtered.map(phrase => (
                    <button
                      key={phrase.id}
                      onClick={() => { onSelect(phrase); onClose(); }}
                      className="w-full text-left px-5 py-3.5 hover:bg-amber/5 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <p className="font-mono text-xs text-amber/90 leading-relaxed line-clamp-2 flex-1">
                          {phrase.akkadian}
                        </p>
                        <span className={cn(
                          'text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5',
                          CATEGORY_COLORS[phrase.category] ?? CATEGORY_COLORS.Fragments
                        )}>
                          {phrase.category}
                        </span>
                      </div>
                      <p className="text-xs text-warm-white/50 group-hover:text-warm-white/70 transition-colors line-clamp-1">
                        {phrase.english.slice(0, 120)}{phrase.english.length > 120 ? '…' : ''}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
