import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowRight } from 'lucide-react';

function ScrollSection({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, isInView } = useScrollAnimation();
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
      className="mb-24"
    >
      <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-amber mb-8">{title}</h2>
      {children}
    </motion.section>
  );
}

function Token({ text, color = 'amber' }: { text: string; color?: string }) {
  const colorMap: Record<string, string> = {
    amber: 'bg-amber/20 border-amber/40 text-amber',
    teal: 'bg-teal/20 border-teal/40 text-teal',
    coral: 'bg-coral/20 border-coral/40 text-coral',
  };
  return (
    <span
      className={`inline-block px-2 py-1 rounded border font-mono text-xs mr-1 mb-1 ${colorMap[color] || colorMap.amber}`}
    >
      {text}
    </span>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">
            How <span className="text-amber">AI Translates</span>
          </h1>
          <p className="text-near-black/60 dark:text-warm-white/50 text-lg max-w-2xl mx-auto">
            A visual, interactive journey through neural machine translation — from raw text to meaning.
          </p>
        </motion.div>

        <ScrollSection title="1. What Is Translation?">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="rounded-2xl bg-amber/10 p-6 text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="font-mono text-sm text-amber">Bonjour le monde</p>
              <p className="text-xs text-near-black/50 dark:text-warm-white/40 mt-1">French input</p>
            </div>
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-4xl mx-auto w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center"
              >
                🧠
              </motion.div>
              <p className="text-xs text-near-black/50 dark:text-warm-white/40 mt-2">AI "understands" meaning</p>
            </div>
            <div className="rounded-2xl bg-teal/10 p-6 text-center">
              <div className="text-4xl mb-3">💬</div>
              <p className="font-mono text-sm text-teal-light">Hello world</p>
              <p className="text-xs text-near-black/50 dark:text-warm-white/40 mt-1">English output</p>
            </div>
          </div>
          <p className="mt-8 text-near-black/70 dark:text-warm-white/60 leading-relaxed">
            Translation is like having a bilingual friend who reads a message, grasps its meaning, and then recreates
            that meaning naturally in another language. AI does the same — but through mathematics.
          </p>
        </ScrollSection>

        <ScrollSection title="2. How Humans vs. AI Translate">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-amber/20 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">👤 Human Translator</h3>
              {[
                '1. Reads the text',
                '2. Grasps the meaning',
                '3. Reconstructs in new language',
                '4. Refines for natural flow',
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 py-2 border-b border-amber/10 last:border-0 text-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-amber/20 text-amber text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  {step}
                </motion.div>
              ))}
            </div>
            <div className="rounded-2xl border border-teal/20 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">🤖 AI Model</h3>
              {[
                '1. Reads tokens (subword pieces)',
                '2. Converts to numbers (embeddings)',
                '3. Processes through neural layers',
                '4. Generates output token by token',
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 py-2 border-b border-teal/10 last:border-0 text-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-teal/20 text-teal text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  {step}
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollSection>

        <ScrollSection title="3. The Encoder-Decoder Architecture">
          <p className="text-near-black/70 dark:text-warm-white/60 leading-relaxed mb-8">
            Modern translation models use an <strong>Encoder-Decoder</strong> architecture. The encoder reads the
            input and compresses it into a rich mathematical representation. The decoder reads that representation and
            generates the output one word at a time.
          </p>
          <div className="rounded-2xl bg-near-black/5 dark:bg-warm-white/5 p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-center flex-wrap">
              {/* Input tokens */}
              <div className="text-center">
                <p className="text-xs text-near-black/40 dark:text-warm-white/30 mb-2">Input tokens</p>
                <div>
                  {['Bon', 'jour', '▁le', '▁monde'].map((t, i) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, y: -10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Token text={t} color="amber" />
                    </motion.span>
                  ))}
                </div>
              </div>
              <ArrowRight size={20} className="text-amber" />
              {/* Encoder */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-xl bg-amber/20 border border-amber px-6 py-4 text-center cursor-default"
              >
                <div className="text-2xl mb-1">📦</div>
                <div className="font-bold text-sm text-amber">ENCODER</div>
                <div className="text-xs text-near-black/50 dark:text-warm-white/40">8 transformer layers</div>
              </motion.div>
              <ArrowRight size={20} className="text-teal" />
              {/* Hidden state */}
              <motion.div
                animate={{
                  boxShadow: ['0 0 0px #1A535C', '0 0 20px #1A535C', '0 0 0px #1A535C'],
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="rounded-full w-16 h-16 bg-teal/30 border-2 border-teal flex items-center justify-center text-center cursor-default"
              >
                <span className="text-xs font-bold text-teal">
                  Hidden
                  <br />
                  State
                </span>
              </motion.div>
              <ArrowRight size={20} className="text-teal" />
              {/* Decoder */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-xl bg-teal/20 border border-teal px-6 py-4 text-center cursor-default"
              >
                <div className="text-2xl mb-1">🔓</div>
                <div className="font-bold text-sm text-teal">DECODER</div>
                <div className="text-xs text-near-black/50 dark:text-warm-white/40">8 transformer layers</div>
              </motion.div>
              <ArrowRight size={20} className="text-teal" />
              {/* Output */}
              <div className="text-center">
                <p className="text-xs text-near-black/40 dark:text-warm-white/30 mb-2">Output tokens</p>
                <div>
                  {['Hello', '▁world'].map((t, i) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2 + 0.5 }}
                      viewport={{ once: true }}
                    >
                      <Token text={t} color="teal" />
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollSection>

        <ScrollSection title="4. What Makes Akkadian Special?">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: 'Morphological Complexity',
                desc: 'One Akkadian word can pack in what takes a full English sentence to express.',
                example: 'a-na ha-ra-nim ú-ṣé-er → "send (it) on the caravan"',
                icon: '🧩',
              },
              {
                title: 'Determinatives',
                desc: 'Special prefixes mark semantic categories. {d} means "deity", {ki} means "place".',
                example: '{d}UTU → "Šamaš (the sun god)"',
                icon: '🔮',
              },
              {
                title: 'Damaged Tablets',
                desc: "4,000-year-old clay breaks. Missing sections become <gap> tokens in the AI's input.",
                example: '[broken] [...] → <gap>',
                icon: '🏺',
              },
              {
                title: 'Low-Resource',
                desc: 'Only ~1,500 training pairs vs millions for French/Spanish. Every example matters.',
                example: '1,500 pairs vs 2M+ for high-resource',
                icon: '📊',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-amber/20 p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <h4 className="font-bold">{item.title}</h4>
                </div>
                <p className="text-sm text-near-black/60 dark:text-warm-white/50 mb-3">{item.desc}</p>
                <div className="font-mono text-xs bg-amber/10 rounded p-2 text-amber">{item.example}</div>
              </motion.div>
            ))}
          </div>
        </ScrollSection>

        <ScrollSection title="5. ByT5 — The Model That Cracked It">
          <p className="text-near-black/70 dark:text-warm-white/60 leading-relaxed mb-6">
            Most language models work at the word or subword level. ByT5 works at the <strong>byte level</strong> —
            it processes raw bytes (the actual numbers computers use to store characters). This makes it incredibly
            powerful for languages like Akkadian with unusual characters and morphology.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-coral/10 border border-coral/20 p-5">
              <h4 className="font-bold mb-3 text-coral">Word-Level Model</h4>
              <div className="font-mono text-xs space-y-1">
                <div className="text-near-black/50 dark:text-warm-white/40">Input: "um-ma"</div>
                <div className="text-near-black/50 dark:text-warm-white/40">→ [UNKNOWN TOKEN] ← Problem!</div>
                <div className="text-xs text-coral mt-2">Fails on unseen words</div>
              </div>
            </div>
            <div className="rounded-xl bg-teal/10 border border-teal/20 p-5">
              <h4 className="font-bold mb-3 text-teal">ByT5 (Byte-Level)</h4>
              <div className="font-mono text-xs space-y-1">
                <div className="text-near-black/50 dark:text-warm-white/40">Input: "um-ma"</div>
                <div>
                  <Token text="75" color="teal" />
                  <Token text="6d" color="teal" />
                  <Token text="2d" color="teal" />
                  <Token text="6d" color="teal" />
                  <Token text="61" color="teal" />
                </div>
                <div className="text-xs text-teal mt-2">Every character handled perfectly</div>
              </div>
            </div>
          </div>
        </ScrollSection>

        <ScrollSection title="6. Training the Model">
          <p className="text-near-black/70 dark:text-warm-white/60 leading-relaxed mb-6">
            Training is an iterative process. The model sees thousands of Akkadian→English pairs, guesses a
            translation, compares its guess to the correct answer, and adjusts its internal parameters to do better
            next time.
          </p>
          <div className="rounded-2xl bg-near-black/5 dark:bg-warm-white/5 p-6">
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  label: 'Feed a training pair',
                  detail: 'Akkadian: "1 ma-na KÙ.BABBAR" → English: "1 mina of silver"',
                  color: 'amber',
                },
                {
                  step: '2',
                  label: 'Model guesses',
                  detail: 'Prediction: "1 silver mina" (close, but wrong order)',
                  color: 'coral',
                },
                {
                  step: '3',
                  label: 'Compare to correct answer',
                  detail: 'Loss = distance between prediction and truth. Lower is better.',
                  color: 'coral',
                },
                {
                  step: '4',
                  label: 'Adjust weights (backpropagation)',
                  detail: 'Millions of tiny adjustments to improve the next prediction',
                  color: 'teal',
                },
                {
                  step: '5',
                  label: 'Repeat for 1,500 examples × 3 epochs',
                  detail: 'After ~4,500 updates, the model learns the patterns',
                  color: 'teal',
                },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      item.color === 'amber'
                        ? 'bg-amber/20 text-amber'
                        : item.color === 'coral'
                          ? 'bg-coral/20 text-coral'
                          : 'bg-teal/20 text-teal'
                    }`}
                  >
                    {item.step}
                  </span>
                  <div>
                    <div className="font-semibold text-sm">{item.label}</div>
                    <div className="text-xs text-near-black/50 dark:text-warm-white/40 mt-0.5">{item.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollSection>
      </div>
    </div>
  );
}
