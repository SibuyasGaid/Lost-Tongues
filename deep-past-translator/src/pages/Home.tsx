import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Languages, Brain, Cpu, ArrowRight } from 'lucide-react';
import AnimatedCounter from '../components/shared/AnimatedCounter';
import CuneiformDecoration from '../components/shared/CuneiformDecoration';

const CUNEIFORM_STEPS = [
  { cuneiform: '𒀭𒌋𒁹𒀸', roman: 'um-ma A-šùr-ma' },
  { cuneiform: '𒄿𒈾𒄠𒊺', roman: 'a-na i-mì-tì-ma' },
  { cuneiform: '𒅆𒁍𒈠', roman: 'qí-bi-ma' },
  { cuneiform: '→ English', roman: 'Thus says Ashur: speak' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-charcoal via-teal/40 to-charcoal">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber/10 via-transparent to-transparent" />
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 py-32">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <CuneiformDecoration className="text-3xl mb-8 justify-center flex gap-6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-6 space-y-2"
          >
            {CUNEIFORM_STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.3, duration: 0.5 }}
                className="flex items-center justify-center gap-4"
              >
                <span className="font-mono text-amber text-lg md:text-2xl">{step.cuneiform}</span>
                <ArrowRight size={16} className="text-amber/50" />
                <span className="text-warm-white/70 text-sm md:text-base font-mono">{step.roman}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.7 }}
            className="font-cinzel font-black text-4xl md:text-6xl lg:text-7xl text-warm-white mb-6 leading-tight"
          >
            4,000 Years of Silence.
            <br />
            <span className="text-amber">One AI to Break It.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-warm-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Learn how artificial intelligence translates ancient Akkadian cuneiform tablets — and try it yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/translate"
              className="px-8 py-4 bg-amber hover:bg-amber/90 text-charcoal font-bold rounded-xl transition-all hover:scale-105 active:scale-95 text-lg"
            >
              Try Live Translation
            </Link>
            <Link
              to="/how-it-works"
              className="px-8 py-4 border-2 border-warm-white/30 hover:border-amber text-warm-white hover:text-amber rounded-xl transition-all text-lg"
            >
              How Does AI Translate?
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-warm-white/40 text-2xl"
        >
          ↓
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="bg-amber/10 dark:bg-amber/5 border-y border-amber/20 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: 8000, suffix: '+', label: 'Tablets discovered' },
            { value: 4000, suffix: '+', label: 'Still unread' },
            { value: 1, suffix: '', label: 'AI changing that' },
          ].map(({ value, suffix, label }) => (
            <div key={label}>
              <div className="font-cinzel text-4xl font-bold text-amber">
                <AnimatedCounter target={value} suffix={suffix} />
              </div>
              <div className="text-near-black/70 dark:text-warm-white/60 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-cinzel text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Explore the Ancient World with AI
        </motion.h2>
        <p className="text-center text-near-black/60 dark:text-warm-white/50 mb-16 max-w-2xl mx-auto">
          Built on the 1st-place winning solution of the Kaggle Deep Past Challenge — ByT5-XL models trained on
          Akkadian cuneiform tablets.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Languages,
              title: 'Translate',
              desc: 'Try real AI translation across 6 languages — including 4,000-year-old Akkadian cuneiform.',
              to: '/translate',
              color: 'from-amber/20 to-amber/5',
            },
            {
              icon: Brain,
              title: 'Explore',
              desc: "See inside the AI's brain as it translates — visualize tokenization, attention, and the encoder-decoder architecture.",
              to: '/how-it-works',
              color: 'from-teal/20 to-teal/5',
            },
            {
              icon: Cpu,
              title: 'Build',
              desc: 'Train your own mini translation model and see how data size, model size, and epochs affect accuracy.',
              to: '/train',
              color: 'from-coral/20 to-coral/5',
            },
          ].map(({ icon: Icon, title, desc, to, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`group rounded-2xl p-8 bg-gradient-to-br ${color} border border-amber/10 hover:border-amber/30 transition-all hover:shadow-xl hover:-translate-y-1`}
            >
              <Icon size={40} className="text-amber mb-4" />
              <h3 className="font-cinzel text-xl font-bold mb-3">{title}</h3>
              <p className="text-near-black/70 dark:text-warm-white/60 text-sm leading-relaxed mb-6">{desc}</p>
              <Link
                to={to}
                className="inline-flex items-center gap-2 text-amber font-semibold text-sm hover:gap-3 transition-all"
              >
                Get Started <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About section */}
      <section className="bg-near-black dark:bg-black py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-6xl mb-6">𒀭</div>
            <h2 className="font-cinzel text-3xl text-warm-white mb-6">What is Akkadian?</h2>
            <p className="text-warm-white/60 text-lg leading-relaxed mb-8">
              Akkadian was the dominant language of ancient Mesopotamia — written in cuneiform script on clay tablets.
              These tablets record 4,000 years of human history: trade deals, love letters, legal disputes, and royal
              decrees. Most remain untranslated. AI is changing that.
            </p>
            <Link
              to="/languages"
              className="inline-flex items-center gap-2 px-6 py-3 border border-amber text-amber hover:bg-amber hover:text-charcoal rounded-xl transition-all"
            >
              Explore All Languages <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
