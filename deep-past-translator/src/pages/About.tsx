import { motion } from 'framer-motion';
import { ExternalLink, Mail } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="text-6xl mb-6">𒀭</div>
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">
            About <span className="text-amber">Deep Past</span>
          </h1>
          <p className="text-near-black/60 dark:text-warm-white/50 text-lg">
            Making AI translation of ancient languages accessible and educational for everyone.
          </p>
        </motion.div>

        <div className="space-y-10">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-amber/20 p-8"
          >
            <h2 className="font-cinzel text-2xl font-bold mb-4 text-amber">The Project</h2>
            <p className="text-near-black/70 dark:text-warm-white/60 leading-relaxed mb-4">
              Deep Past Translator is an educational platform inspired by the 1st-place winning solution of the
              <strong> Kaggle Deep Past Challenge</strong> — a competition focused on AI translation of ancient
              Akkadian cuneiform tablets into English.
            </p>
            <p className="text-near-black/70 dark:text-warm-white/60 leading-relaxed">
              The winning approach used <strong>ByT5-XL</strong>, a byte-level sequence-to-sequence model from
              Google, achieving a ChrF++ score of 54.7 — far surpassing baseline approaches. This platform makes
              those techniques accessible to students through interactive visualization and live demos.
            </p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-teal/20 p-8"
          >
            <h2 className="font-cinzel text-2xl font-bold mb-4 text-teal">Built By</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-amber/20 flex items-center justify-center text-2xl font-cinzel font-bold text-amber">
                CG
              </div>
              <div>
                <div className="font-bold text-lg">Charles Luis Gaid</div>
                <div className="text-near-black/50 dark:text-warm-white/40 text-sm">ML Engineer · Digital Humanities</div>
              </div>
            </div>
            <p className="text-near-black/70 dark:text-warm-white/60 leading-relaxed text-sm">
              This project showcases full-stack ML engineering: from cuneiform preprocessing pipelines and ByT5
              fine-tuning to React educational interfaces. The goal is to bridge AI research with accessible,
              engaging education.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="mailto:charlesgaidwork@gmail.com"
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber/20 text-sm hover:border-amber transition-colors"
              >
                <Mail size={15} /> Contact
              </a>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-amber/10 p-8"
          >
            <h2 className="font-cinzel text-2xl font-bold mb-4">Learn More</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  label: 'CDLI — Cuneiform Digital Library',
                  url: 'https://cdli.mpiwg-berlin.mpg.de/',
                  desc: "The world's largest cuneiform text database",
                },
                {
                  label: 'ORACC Project',
                  url: 'https://oracc.museum.upenn.edu/',
                  desc: 'Open Richly Annotated Cuneiform Corpus',
                },
                {
                  label: 'eBL Dictionary',
                  url: 'https://www.ebl.lmu.de/',
                  desc: 'Electronic Babylonian Literature',
                },
                {
                  label: 'Helsinki-NLP Models',
                  url: 'https://huggingface.co/Helsinki-NLP',
                  desc: 'Open multilingual translation models',
                },
              ].map(item => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-xl border border-amber/10 hover:border-amber/30 transition-all hover:bg-amber/5"
                >
                  <ExternalLink size={15} className="text-amber flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-near-black/50 dark:text-warm-white/40 mt-0.5">{item.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
