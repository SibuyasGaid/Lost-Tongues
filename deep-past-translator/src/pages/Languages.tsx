import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { LANGUAGES } from '../lib/constants';

function DifficultyStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < rating ? 'fill-amber text-amber' : 'text-near-black/20 dark:text-warm-white/20'}
        />
      ))}
    </div>
  );
}

export default function Languages() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">
            Language <span className="text-amber">Explorer</span>
          </h1>
          <p className="text-near-black/60 dark:text-warm-white/50 text-lg">
            Discover the six languages in our AI translation system — from ancient cuneiform to modern scripts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {LANGUAGES.map((lang, i) => (
            <motion.div
              key={lang.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-2xl border border-amber/10 hover:border-amber/30 bg-white dark:bg-near-black/30 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Header */}
              <div className={`relative h-36 bg-gradient-to-br ${lang.color} overflow-hidden`}>
                {/* Large decorative flag — faded background element */}
                <span className="absolute -right-3 -bottom-3 text-9xl opacity-15 select-none pointer-events-none leading-none">
                  {lang.flag}
                </span>
                {/* Subtle top-left grain dot pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                {/* Text content — pinned to bottom-left */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest mb-1">
                    {lang.family}
                  </p>
                  <div className="flex items-end gap-3">
                    <div>
                      <h2 className="font-cinzel text-white text-2xl font-bold leading-tight drop-shadow">
                        {lang.name}
                      </h2>
                      <p className="text-white/65 text-sm font-mono mt-0.5">{lang.subtitle}</p>
                    </div>
                    <span className="text-3xl mb-0.5 drop-shadow">{lang.flag}</span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-2 mb-4 text-sm text-near-black/60 dark:text-warm-white/50">
                  <div className="flex gap-2">
                    <span className="font-semibold text-near-black dark:text-warm-white w-24">Speakers:</span>
                    {lang.speakers}
                  </div>
                  <div className="flex gap-2">
                    <span className="font-semibold text-near-black dark:text-warm-white w-24">Script:</span>
                    {lang.script}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-near-black dark:text-warm-white w-24">AI difficulty:</span>
                    <DifficultyStars rating={lang.difficulty} />
                  </div>
                </div>

                <div className="text-xs text-near-black/50 dark:text-warm-white/40 bg-amber/5 rounded-lg p-3 mb-2 leading-relaxed">
                  <span className="font-semibold text-amber">Difficulty: </span>
                  {lang.difficultyReason}
                </div>

                <div className="text-xs text-near-black/50 dark:text-warm-white/40 bg-teal/5 rounded-lg p-3 mb-4 leading-relaxed">
                  <span className="font-semibold text-teal">Fun fact: </span>
                  {lang.funFact}
                </div>

                <Link
                  to={`/translate?lang=${lang.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber/10 hover:bg-amber text-amber hover:text-charcoal font-semibold text-sm transition-all"
                >
                  Try {lang.name} <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
