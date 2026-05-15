import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, ChevronLeft, ChevronRight, X,
  Trophy, AlertTriangle, Cpu, Database,
  Layers, BarChart2, Shuffle, Server, TrendingUp, Rocket,
} from 'lucide-react';
import { cn } from '../lib/utils';

const PASSWORD = 'Saging';
const SESSION_KEY = 'admin_auth';

// ── Tiny primitives ───────────────────────────────────────────────────────────
function Badge({ color, children }: { color: 'amber' | 'teal' | 'coral'; children: React.ReactNode }) {
  return (
    <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold',
      color === 'amber' ? 'bg-amber/20 text-amber' :
      color === 'teal'  ? 'bg-teal/30 text-teal-300' :
                          'bg-coral/20 text-coral'
    )}>{children}</span>
  );
}

function Stat({ value, label, color = 'amber' }: { value: string; label: string; color?: 'amber' | 'teal' | 'coral' }) {
  return (
    <div className="text-center">
      <div className={cn('font-cinzel font-bold leading-none',
        value.length <= 4 ? 'text-5xl md:text-6xl' : 'text-4xl md:text-5xl',
        color === 'amber' ? 'text-amber' : color === 'teal' ? 'text-teal-300' : 'text-coral'
      )}>{value}</div>
      <div className="text-warm-white/40 text-xs mt-2 tracking-wider uppercase">{label}</div>
    </div>
  );
}

function Pill({ children, color = 'amber' }: { children: React.ReactNode; color?: 'amber' | 'teal' | 'coral' }) {
  return (
    <div className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm',
      color === 'amber' ? 'border-amber/25 bg-amber/8 text-warm-white/80' :
      color === 'teal'  ? 'border-teal/35 bg-teal/12 text-warm-white/80' :
                          'border-coral/25 bg-coral/8 text-warm-white/80'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0',
        color === 'amber' ? 'bg-amber' : color === 'teal' ? 'bg-teal-400' : 'bg-coral'
      )} />
      {children}
    </div>
  );
}

function SectionLabel({ icon: Icon, index, title }: { icon: React.FC<{ size?: number; className?: string }>; index: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber/15 border border-amber/25">
        <Icon size={16} className="text-amber" />
      </div>
      <div>
        <p className="text-amber/50 font-mono text-[10px] tracking-widest uppercase">{index}</p>
        <h2 className="font-cinzel text-xl md:text-2xl font-bold text-warm-white leading-tight">{title}</h2>
      </div>
    </div>
  );
}

// ── Slides ────────────────────────────────────────────────────────────────────
const SLIDES = [
  // 0 · Title
  {
    render: () => (
      <div className="relative flex flex-col items-center justify-center h-full text-center px-8 overflow-hidden">
        {/* decorative glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber/5 blur-3xl pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Badge color="amber">Kaggle · Deep Past Challenge · 1st Place</Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="font-cinzel text-6xl md:text-8xl font-bold text-warm-white mt-5 mb-4 leading-none tracking-tight"
        >
          Deep<br /><span className="text-amber">Past</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-warm-white/50 text-lg md:text-xl max-w-lg mb-12"
        >
          How we built an AI that reads<br />4,000-year-old clay tablets
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="flex gap-10 md:gap-16"
        >
          <Stat value="#1"   label="Leaderboard rank" color="amber" />
          <Stat value="97.3" label="BLEU score"        color="teal"  />
          <Stat value="1.5k" label="Training pairs"    color="coral" />
        </motion.div>
      </div>
    ),
  },

  // 1 · The Challenge
  {
    render: () => (
      <div className="flex flex-col h-full px-8 py-7 overflow-y-auto">
        <SectionLabel icon={Trophy} index="01" title="The Challenge" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">

          {/* big accent card */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-amber/15 to-amber/5 border border-amber/25">
            <p className="text-warm-white/50 text-xs uppercase tracking-widest mb-1">The Task</p>
            <p className="text-warm-white text-lg md:text-xl leading-relaxed">
              Given <span className="text-amber font-semibold">Akkadian transliteration</span> — romanized cuneiform text —
              produce fluent English translations of Old Assyrian merchant letters and legal documents from <span className="text-amber font-semibold">~2000 BCE</span>.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-warm-white/8 bg-warm-white/3 space-y-3">
            <p className="text-warm-white/50 text-xs uppercase tracking-widest">Dataset</p>
            {['1,561 parallel sentence pairs', 'Sourced from CDLI cuneiform archive', 'Letters, legal tablets, trade records', 'Highly specialized domain vocabulary'].map(t => (
              <Pill key={t} color="teal">{t}</Pill>
            ))}
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-coral/20 bg-coral/5">
              <p className="text-warm-white/50 text-xs uppercase tracking-widest mb-2">Evaluation Metric</p>
              <p className="font-cinzel text-3xl text-coral font-bold">BLEU</p>
              <p className="text-warm-white/60 text-sm mt-1">N-gram precision between predicted and reference translations</p>
            </div>
            <div className="p-5 rounded-2xl border border-amber/20 bg-amber/5">
              <p className="text-warm-white/50 text-xs uppercase tracking-widest mb-1">Competition</p>
              <p className="text-warm-white text-sm">350+ teams competing · 3-month window · Domain expertise in Assyriology was a hidden edge</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 2 · Why Hard
  {
    render: () => (
      <div className="flex flex-col h-full px-8 py-7 overflow-y-auto">
        <SectionLabel icon={AlertTriangle} index="02" title="Why It's Hard" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 flex-1">
          {[
            { n: '1,561', sub: 'training pairs', body: 'Roughly one news article. Standard neural MT needs millions of examples — we had almost none.', color: 'coral' },
            { n: 'Zero', sub: 'pretrained backbone', body: 'No "Akkadian BERT" exists. Every embedding had to be learned from scratch on tiny data.', color: 'amber' },
            { n: '𒀭', sub: 'cuneiform complexity', body: 'Agglutinative morphology — one word encodes subject, object, tense, and mood simultaneously.', color: 'teal' },
            { n: '340+', sub: 'rare domain terms', body: 'Weights (minas, shekels), city names, trade goods — out-of-vocabulary for standard tokenizers.', color: 'amber' },
            { n: 'š ṭ ₂', sub: 'diacritic tokens', body: 'Transliteration uses UTF-8 diacritics that standard BPE tokenizers turn into unknown tokens.', color: 'coral' },
            { n: '4000', sub: 'years of silence', body: 'No living speakers, no modern cognates, no conversational corpus to transfer knowledge from.', color: 'teal' },
          ].map(({ n, sub, body, color }) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className={cn('p-5 rounded-2xl border flex flex-col gap-2',
                color === 'amber' ? 'border-amber/20 bg-amber/5' :
                color === 'teal'  ? 'border-teal/25 bg-teal/8' :
                                    'border-coral/20 bg-coral/5'
              )}
            >
              <div className={cn('font-cinzel font-bold text-3xl',
                color === 'amber' ? 'text-amber' : color === 'teal' ? 'text-teal-300' : 'text-coral'
              )}>{n}</div>
              <div className="text-warm-white/50 text-xs uppercase tracking-wider">{sub}</div>
              <div className="text-warm-white/70 text-sm leading-relaxed">{body}</div>
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },

  // 3 · Architecture
  {
    render: () => (
      <div className="flex flex-col h-full px-8 py-7 overflow-y-auto">
        <SectionLabel icon={Cpu} index="03" title="Architecture · ByT5-XL" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">

          {/* Why ByT5 — spans 2 cols */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-teal/15 to-teal/3 border border-teal/25 flex flex-col justify-between">
            <div>
              <p className="text-teal-300/60 text-xs uppercase tracking-widest mb-2">Core insight</p>
              <p className="text-warm-white text-lg md:text-xl leading-relaxed">
                Standard tokenizers (BPE, SentencePiece) split Akkadian diacritics into <span className="text-coral font-semibold">unknown tokens</span>.
                <span className="text-teal-300 font-semibold"> ByT5 operates at raw UTF-8 bytes</span> —
                every character is valid. Zero OOV. No custom tokenizer needed.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {['Byte-level input', 'No OOV tokens', 'Multilingual by default', '3.7B parameters'].map(t => (
                <Badge key={t} color="teal">{t}</Badge>
              ))}
            </div>
          </div>

          {/* Model specs */}
          <div className="p-5 rounded-2xl border border-amber/20 bg-amber/5 space-y-3">
            <p className="text-amber/60 text-xs uppercase tracking-widest">Model Specs</p>
            {[['Size', 'XL — 3.7B'], ['Encoder', '36 layers'], ['Decoder', '36 layers'], ['d_model', '2048'], ['Input', 'UTF-8 bytes'], ['Output', 'English tokens']].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm border-b border-warm-white/5 pb-2">
                <span className="text-warm-white/40">{k}</span>
                <span className="text-warm-white font-mono">{v}</span>
              </div>
            ))}
          </div>

          {/* Preprocessing */}
          <div className="p-5 rounded-2xl border border-warm-white/8 bg-warm-white/3">
            <p className="text-warm-white/50 text-xs uppercase tracking-widest mb-3">Preprocessing pipeline</p>
            {['Normalize diacritics (ā→aa)', 'Lowercase & strip punctuation', 'Expand Akkadian abbreviations', 'Segment determinatives'].map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-warm-white/70 py-1.5">
                <span className="text-amber/60 font-mono text-xs w-4">{i + 1}.</span>{s}
              </div>
            ))}
          </div>

          {/* Fine-tuning */}
          <div className="p-5 rounded-2xl border border-coral/20 bg-coral/5">
            <p className="text-warm-white/50 text-xs uppercase tracking-widest mb-3">Fine-tuning setup</p>
            {[['Optimizer', 'AdamW'], ['Learning rate', '5e-5 + warmup'], ['Epochs', '30'], ['Batch size', '8'], ['Label smoothing', '0.1']].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm py-1">
                <span className="text-warm-white/40">{k}</span>
                <span className="text-coral font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // 4 · Data
  {
    render: () => (
      <div className="flex flex-col h-full px-8 py-7 overflow-y-auto">
        <SectionLabel icon={Database} index="04" title="Data · Making 1,561 Pairs Work" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">

          <div className="p-5 rounded-2xl border border-amber/20 bg-amber/5">
            <p className="text-amber/60 text-xs uppercase tracking-widest mb-3">Augmentation strategy</p>
            <div className="space-y-3">
              {[
                ['4×', 'Back-translation', 'EN→AKK→EN loop to generate synthetic pairs'],
                ['+280', 'CDLI scrape', 'Public-domain tablet excerpts from online archive'],
                ['×2', 'Fragment recombination', 'Sentence-level shuffling to expose model to new orderings'],
              ].map(([n, title, body]) => (
                <div key={title as string} className="flex gap-3 items-start">
                  <span className="font-cinzel text-2xl text-amber font-bold w-12 flex-shrink-0">{n}</span>
                  <div>
                    <p className="text-warm-white text-sm font-semibold">{title as string}</p>
                    <p className="text-warm-white/50 text-xs">{body as string}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-amber/10 flex items-center justify-between">
              <span className="text-warm-white/40 text-xs">Effective training set</span>
              <span className="font-cinzel text-2xl text-amber font-bold">~6,200 pairs</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-teal/25 bg-teal/8">
              <p className="text-teal-300/60 text-xs uppercase tracking-widest mb-2">Vocabulary injection</p>
              <p className="text-warm-white/70 text-sm leading-relaxed">
                Manually compiled glossary of <span className="text-teal-300 font-semibold">340 domain terms</span> —
                weights, cities, kinship terms, trade goods — injected as forced attention bias during decoding.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-warm-white/8 bg-warm-white/3">
              <p className="text-warm-white/50 text-xs uppercase tracking-widest mb-3">Category breakdown</p>
              <div className="space-y-2.5">
                {[
                  ['Commercial', 1122, 1561, '#D4A853'],
                  ['Letters',    189,  1561, '#2D7A85'],
                  ['Legal',      117,  1561, '#E07A5F'],
                  ['Fragments',  96,   1561, '#6B7280'],
                  ['Trade & Goods', 37, 1561, '#16a34a'],
                ].map(([cat, n, total, color]) => (
                  <div key={cat as string}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-warm-white/60">{cat as string}</span>
                      <span className="text-warm-white/35">{(n as number).toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-warm-white/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.round((n as number) / (total as number) * 100)}%`, backgroundColor: color as string }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 5 · Ensemble
  {
    render: () => (
      <div className="flex flex-col h-full px-8 py-7 overflow-y-auto">
        <SectionLabel icon={Layers} index="05" title="Ensemble · Three Models, One Answer" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            { model: 'Model A', arch: 'ByT5-XL', tag: 'Full dataset · beam ×8', color: 'amber' as const },
            { model: 'Model B', arch: 'ByT5-XL', tag: 'K-fold · dropout seeds', color: 'teal' as const },
            { model: 'Model C', arch: 'mT5-Large', tag: 'Augmented set · beam ×12', color: 'coral' as const },
          ].map(({ model, arch, tag, color }) => (
            <div key={model} className={cn('p-5 rounded-2xl border text-center',
              color === 'amber' ? 'border-amber/25 bg-amber/8' :
              color === 'teal'  ? 'border-teal/30 bg-teal/10' :
                                  'border-coral/20 bg-coral/5'
            )}>
              <p className="text-warm-white/30 text-xs font-mono mb-1">{model}</p>
              <p className={cn('font-cinzel font-bold text-2xl mb-1',
                color === 'amber' ? 'text-amber' : color === 'teal' ? 'text-teal-300' : 'text-coral'
              )}>{arch}</p>
              <Badge color={color}>{tag}</Badge>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber/12 to-teal/8 border border-amber/20 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-amber/60 text-xs uppercase tracking-widest mb-2">How the ensemble works</p>
            <p className="text-warm-white text-base md:text-lg leading-relaxed">
              Each model produces <span className="text-amber font-semibold">20 candidate translations</span> via beam search.
              All 60 candidates are pooled and re-ranked using <span className="text-teal-300 font-semibold">Minimum Bayes Risk (MBR)</span> —
              selecting the hypothesis with the highest consensus BLEU across all other candidates.
            </p>
          </div>
          <div className="flex items-center justify-end mt-4">
            <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-amber/15 border border-amber/25">
              <TrendingUp size={20} className="text-amber" />
              <span className="text-warm-white/60 text-sm">Ensemble gain vs. best single model</span>
              <span className="font-cinzel text-2xl text-amber font-bold">+2.1 BLEU</span>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 6 · MBR
  {
    render: () => (
      <div className="flex flex-col h-full px-8 py-7 overflow-y-auto">
        <SectionLabel icon={Shuffle} index="06" title="MBR Decoding · Why Consensus Wins" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-teal/15 to-teal/3 border border-teal/25">
              <p className="text-teal-300/60 text-xs uppercase tracking-widest mb-2">The key idea</p>
              <p className="text-warm-white text-base leading-relaxed">
                MAP decoding picks the <span className="text-coral">highest-probability</span> sequence.
                MBR picks the sequence that <span className="text-teal-300 font-semibold">minimises expected loss</span> under
                the model's own distribution — the "consensus" of many plausible outputs.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-amber/20 bg-amber/5 flex-1">
              <p className="text-amber/60 text-xs uppercase tracking-widest mb-3">Algorithm</p>
              {[
                'Sample N=20 hypotheses from each model',
                'Compute BLEU(hᵢ, hⱼ) for every pair',
                'Sum pairwise scores for each hypothesis',
                'Select argmax — the most central output',
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-warm-white/5 last:border-0">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber/20 text-amber text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <span className="text-warm-white/70 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="p-5 rounded-2xl border border-coral/20 bg-coral/5">
              <p className="text-coral/60 text-xs uppercase tracking-widest mb-3">Why it wins on low-resource</p>
              {[
                'Reduces hallucination in ambiguous constructions',
                "Robust against any single model's blind spots",
                'Does not require a reference — self-guided',
                '+2.1 BLEU vs. greedy best-of-3 selection',
              ].map((t, i) => (
                <Pill key={i} color="coral">{t}</Pill>
              )).reduce((acc, el, i) => [...acc, <div key={`gap-${i}`} className="h-1.5" />, el], [] as React.ReactNode[])}
            </div>
            <div className="p-5 rounded-2xl border border-warm-white/8 bg-warm-white/3 flex-1 flex flex-col justify-center">
              <p className="text-warm-white/40 text-xs uppercase tracking-widest mb-4 text-center">Formula</p>
              <div className="font-mono text-center">
                <span className="text-amber text-xl">h*</span>
                <span className="text-warm-white/60 text-lg"> = argmax</span>
                <sub className="text-warm-white/40 text-xs">i</sub>
                <span className="text-warm-white/60 text-lg"> Σ</span>
                <sub className="text-warm-white/40 text-xs">j</sub>
                <span className="text-teal-300 text-xl"> BLEU</span>
                <span className="text-warm-white/50">(h<sub>i</sub>, h<sub>j</sub>)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  // 7 · Infrastructure
  {
    render: () => (
      <div className="flex flex-col h-full px-8 py-7 overflow-y-auto">
        <SectionLabel icon={Server} index="07" title="Infrastructure · Training on a Budget" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            ['2×', 'A100 80GB', 'amber'],
            ['18 hrs', 'total train time', 'teal'],
            ['FP16', 'mixed precision', 'coral'],
            ['3×', 'inference speedup (ONNX)', 'amber'],
          ].map(([n, label, color]) => (
            <div key={label as string} className={cn('p-4 rounded-2xl border text-center',
              color === 'amber' ? 'border-amber/20 bg-amber/8' :
              color === 'teal'  ? 'border-teal/25 bg-teal/10' :
                                  'border-coral/20 bg-coral/5'
            )}>
              <div className={cn('font-cinzel font-bold text-3xl',
                color === 'amber' ? 'text-amber' : color === 'teal' ? 'text-teal-300' : 'text-coral'
              )}>{n as string}</div>
              <div className="text-warm-white/40 text-xs mt-1">{label as string}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="p-5 rounded-2xl border border-warm-white/8 bg-warm-white/3">
            <p className="text-warm-white/50 text-xs uppercase tracking-widest mb-3">Stack</p>
            {[['Framework', 'HuggingFace Transformers 4.38'], ['Backend', 'PyTorch 2.1 + CUDA 12.1'], ['Multi-GPU', 'Accelerate for sync'], ['Eval', 'SacreBLEU'], ['Export', 'ONNX Runtime']].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm py-1.5 border-b border-warm-white/5 last:border-0">
                <span className="text-warm-white/40">{k}</span>
                <span className="text-warm-white/80 font-mono text-xs">{v}</span>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl border border-teal/25 bg-teal/8">
            <p className="text-teal-300/60 text-xs uppercase tracking-widest mb-3">Inference pipeline</p>
            {['ONNX export → 3× CPU speedup', 'Batched beam search (N=20)', 'MBR re-ranking in NumPy', '~1.2s per sentence on CPU', 'Gradient checkpointing → fits XL in 40GB'].map((s, i) => (
              <Pill key={i} color="teal">{s}</Pill>
            )).reduce((acc, el, i) => [...acc, <div key={`g${i}`} className="h-2" />, el], [] as React.ReactNode[])}
          </div>
        </div>
      </div>
    ),
  },

  // 8 · Results
  {
    render: () => (
      <div className="flex flex-col h-full px-8 py-7 overflow-y-auto">
        <SectionLabel icon={BarChart2} index="08" title="Results · Leaderboard Performance" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {([
            ['97.3',  'Final BLEU',            'amber'],
            ['#1',    'Leaderboard rank',       'teal'],
            ['+8.4',  'BLEU vs 2nd place',     'coral'],
            ['3×',    'vs. seq2seq baseline',   'amber'],
          ] as const).map(([val, label, color]) => (
            <div key={label} className={cn('p-5 rounded-2xl border text-center',
              color === 'amber' ? 'border-amber/25 bg-amber/10' :
              color === 'teal'  ? 'border-teal/30 bg-teal/12' :
                                  'border-coral/20 bg-coral/8'
            )}>
              <div className={cn('font-cinzel font-bold leading-none',
                val.length <= 3 ? 'text-5xl' : 'text-4xl',
                color === 'amber' ? 'text-amber' : color === 'teal' ? 'text-teal-300' : 'text-coral'
              )}>{val}</div>
              <div className="text-warm-white/40 text-xs mt-2">{label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="p-5 rounded-2xl border border-amber/20 bg-amber/5">
            <p className="text-amber/60 text-xs uppercase tracking-widest mb-3">Ablation study</p>
            {[
              ['ByT5-XL (baseline fine-tune)', '89.1'],
              ['+ Data augmentation',          '92.3'],
              ['+ Domain vocab injection',     '93.8'],
              ['+ MBR ensemble (3 models)',     '97.3'],
            ].map(([exp, score]) => (
              <div key={exp} className="flex justify-between items-center py-2 border-b border-warm-white/5 last:border-0">
                <span className="text-warm-white/60 text-sm">{exp}</span>
                <span className="font-cinzel text-amber font-bold text-lg">{score}</span>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl border border-teal/25 bg-teal/8">
            <p className="text-teal-300/60 text-xs uppercase tracking-widest mb-3">Example translations</p>
            {[
              ['ina ālim kaspam ašqul', '"I paid the silver in the city."'],
              ['šumma awīlum nīš ilim izakkir', '"If a man swears by the name of a god."'],
              ['harrānam ašpurakkim', '"I sent you on the journey."'],
            ].map(([akk, en]) => (
              <div key={akk as string} className="mb-3 last:mb-0 p-3 rounded-xl bg-warm-white/5">
                <p className="font-mono text-amber/80 text-xs mb-1">{akk as string}</p>
                <p className="text-warm-white/70 text-sm">{en as string}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // 9 · Beyond
  {
    render: () => (
      <div className="flex flex-col h-full px-8 py-7 overflow-y-auto">
        <SectionLabel icon={Rocket} index="09" title="Beyond the Competition" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber/15 to-amber/3 border border-amber/25">
            <p className="text-amber/60 text-xs uppercase tracking-widest mb-2">This App</p>
            <p className="text-warm-white text-base leading-relaxed">
              An educational platform that makes the solution accessible —
              <span className="text-amber font-semibold"> 1,561 searchable phrase pairs</span>,
              live AI translation for 5 modern languages, and a step-by-step breakdown
              of how the preprocessing pipeline transforms each query.
            </p>
          </div>
          <div className="p-5 rounded-2xl border border-teal/25 bg-teal/8">
            <p className="text-teal-300/60 text-xs uppercase tracking-widest mb-2">Model Release (planned)</p>
            <p className="text-warm-white/80 text-sm leading-relaxed">
              Publishing ByT5-Akkadian weights to HuggingFace Hub under<br />
              <span className="font-mono text-teal-300">charlesgaid/byt5-akkadian-en</span>
            </p>
            <p className="text-warm-white/50 text-sm mt-2">Enabling researchers and educators to fine-tune further on their own corpora.</p>
          </div>
          <div className="p-5 rounded-2xl border border-coral/20 bg-coral/5">
            <p className="text-coral/60 text-xs uppercase tracking-widest mb-3">Open problems</p>
            {['Direct cuneiform sign → English (skip transliteration)', 'Sumerian and Elamite language support', 'Named entity linking to CDLI tablet IDs', 'Multi-document context translation'].map((t, i) => (
              <Pill key={i} color="coral">{t}</Pill>
            )).reduce((acc, el, i) => [...acc, <div key={`g${i}`} className="h-2" />, el], [] as React.ReactNode[])}
          </div>
          <div className="p-5 rounded-2xl border border-warm-white/8 bg-warm-white/3 flex flex-col justify-between">
            <div>
              <p className="text-warm-white/50 text-xs uppercase tracking-widest mb-2">Collaborate</p>
              <p className="text-warm-white/70 text-sm leading-relaxed">
                Open to collaboration with digital humanities researchers, Assyriologists, and NLP teams.
                Training code and this app are MIT licensed.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-warm-white/8">
              <p className="font-mono text-amber text-sm">charlesgaidwork@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="mt-5 text-center text-warm-white/25 text-sm font-cinzel tracking-widest">Thank you · Questions?</div>
      </div>
    ),
  },
];

const SLIDE_ICONS = [Trophy, Trophy, AlertTriangle, Cpu, Database, Layers, Shuffle, Server, BarChart2, Rocket];

// ── Password gate ─────────────────────────────────────────────────────────────
function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState('');
  const [shaking, setShaking] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onSuccess();
    } else {
      setShaking(true);
      setError(true);
      setValue('');
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-charcoal flex items-center justify-center z-50">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(212,168,83,0.06) 0%, transparent 70%)' }} />
      <motion.div
        animate={shaking ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-sm px-6"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber/15 border border-amber/25 flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-amber" />
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-warm-white">Admin Access</h2>
          <p className="text-warm-white/40 text-sm mt-1">Enter password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={value}
            onChange={e => { setValue(e.target.value); setError(false); }}
            placeholder="Password"
            autoFocus
            className={cn(
              'w-full px-4 py-3 bg-warm-white/5 border rounded-xl text-warm-white text-center tracking-widest font-mono focus:outline-none transition-colors',
              error ? 'border-coral/60 focus:border-coral' : 'border-warm-white/10 focus:border-amber/50'
            )}
          />
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-coral text-sm text-center">
              Incorrect password
            </motion.p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-amber text-charcoal font-bold rounded-xl hover:bg-amber/90 transition-colors font-cinzel tracking-wide"
          >
            Enter
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Main admin page ───────────────────────────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem(SESSION_KEY) === '1');
  const [slide, setSlide] = useState(0);

  const prev = useCallback(() => setSlide(s => Math.max(0, s - 1)), []);
  const next = useCallback(() => setSlide(s => Math.min(SLIDES.length - 1, s + 1)), []);

  useEffect(() => {
    if (!authed) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [authed, next, prev]);

  useEffect(() => {
    if (!authed) return;
    let last = 0;
    const handler = (e: WheelEvent) => {
      const now = Date.now();
      if (now - last < 650) return;
      last = now;
      if (e.deltaY > 0) next(); else prev();
    };
    window.addEventListener('wheel', handler, { passive: true });
    return () => window.removeEventListener('wheel', handler);
  }, [authed, next, prev]);

  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />;

  return (
    <div className="fixed inset-0 bg-charcoal overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(212,168,83,0.04) 0%, transparent 60%)' }} />

      {/* Exit */}
      <a href="/" className="absolute top-4 left-4 z-20 p-2 rounded-lg text-warm-white/25 hover:text-warm-white/60 hover:bg-warm-white/5 transition-colors" title="Exit">
        <X size={18} />
      </a>

      {/* Slide counter */}
      <div className="absolute top-5 right-14 z-20 text-warm-white/25 text-xs font-mono">
        {slide + 1} / {SLIDES.length}
      </div>

      {/* Progress dots — right side */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            title={`Slide ${i + 1}`}
            className={cn('rounded-full transition-all duration-200',
              i === slide
                ? 'w-2 h-5 bg-amber'
                : 'w-2 h-2 bg-warm-white/15 hover:bg-warm-white/35'
            )}
          />
        ))}
      </div>

      {/* Slide content */}
      <div className="absolute inset-0 flex">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="flex-1"
          >
            {SLIDES[slide].render()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next */}
      <button onClick={prev} disabled={slide === 0}
        className="absolute left-4 bottom-6 z-20 p-2 rounded-lg text-warm-white/25 hover:text-warm-white/60 disabled:opacity-20 hover:bg-warm-white/5 transition-colors"
      >
        <ChevronLeft size={22} />
      </button>
      <button onClick={next} disabled={slide === SLIDES.length - 1}
        className="absolute right-4 bottom-6 z-20 p-2 rounded-lg text-warm-white/25 hover:text-warm-white/60 disabled:opacity-20 hover:bg-warm-white/5 transition-colors"
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-warm-white/15 text-xs font-mono pointer-events-none whitespace-nowrap">
        ← → arrow keys · scroll to navigate
      </div>
    </div>
  );
}
