import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Trash2, BookOpen, Cpu, Trophy } from 'lucide-react';
import { FRENCH_TRAINING_PAIRS } from '../lib/constants';
import { translate } from '../lib/api';
import { cn } from '../lib/utils';

type Tab = 'dictionary' | 'neural' | 'akkadian';

function DictionaryBuilder() {
  const [pairs, setPairs] = useState([{ source: 'bonjour', target: 'hello' }]);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');

  const addPair = () => setPairs([...pairs, { source: '', target: '' }]);
  const removePair = (i: number) => setPairs(pairs.filter((_, j) => j !== i));
  const updatePair = (i: number, field: 'source' | 'target', value: string) => {
    const next = [...pairs];
    next[i][field] = value;
    setPairs(next);
  };

  const doTest = () => {
    const dict: Record<string, string> = {};
    pairs.forEach(p => {
      if (p.source && p.target) dict[p.source.toLowerCase()] = p.target;
    });
    const words = testInput.toLowerCase().split(/\s+/);
    const translated = words.map(w => dict[w] || `[${w}?]`).join(' ');
    setTestOutput(translated);
  };

  return (
    <div>
      <div className="bg-amber/5 rounded-xl p-4 mb-6 text-sm text-near-black/70 dark:text-warm-white/60">
        Build a word-by-word dictionary. This is how early machine translation worked — fast but terrible for context
        and idioms.
      </div>
      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
        {pairs.map((pair, i) => (
          <div key={i} className="flex gap-2 items-center">
            <input
              value={pair.source}
              onChange={e => updatePair(i, 'source', e.target.value)}
              placeholder="French word"
              className="flex-1 px-3 py-2 rounded-lg border border-amber/20 bg-white dark:bg-near-black/30 text-sm focus:outline-none focus:border-amber"
            />
            <span className="text-amber font-bold">=</span>
            <input
              value={pair.target}
              onChange={e => updatePair(i, 'target', e.target.value)}
              placeholder="English word"
              className="flex-1 px-3 py-2 rounded-lg border border-teal/20 bg-white dark:bg-near-black/30 text-sm focus:outline-none focus:border-teal"
            />
            <button onClick={() => removePair(i)} className="text-coral/60 hover:text-coral p-1">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button onClick={addPair} className="flex items-center gap-2 text-sm text-amber hover:text-amber/80 mb-6">
        <Plus size={14} /> Add word pair
      </button>
      <div className="flex gap-3 mb-4">
        <input
          value={testInput}
          onChange={e => setTestInput(e.target.value)}
          placeholder="Type a French sentence to translate..."
          className="flex-1 px-3 py-2 rounded-lg border border-amber/20 bg-white dark:bg-near-black/30 text-sm focus:outline-none focus:border-amber"
        />
        <button onClick={doTest} className="px-4 py-2 bg-amber text-charcoal rounded-lg text-sm font-bold hover:bg-amber/90">
          Try It
        </button>
      </div>
      {testOutput && (
        <div className="rounded-lg bg-teal/10 border border-teal/20 p-4">
          <p className="text-xs text-near-black/50 dark:text-warm-white/40 mb-1">Dictionary translation:</p>
          <p className="font-mono text-sm">{testOutput}</p>
          <p className="text-xs text-coral mt-2 italic">
            Notice how word order and idioms break? This is why modern AI learned to understand context.
          </p>
        </div>
      )}
    </div>
  );
}

function TrainingSimulator() {
  const [selectedPairs, setSelectedPairs] = useState<number[]>(
    FRENCH_TRAINING_PAIRS.slice(0, 10).map((_, i) => i)
  );
  const [modelSize, setModelSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [epochs, setEpochs] = useState(5);
  const [training, setTraining] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trained, setTrained] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [testOutput, setTestOutput] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const togglePair = (i: number) => {
    setSelectedPairs(prev => (prev.includes(i) ? prev.filter(j => j !== i) : [...prev, i]));
  };

  const getAccuracy = () => {
    const dataMult = Math.min(selectedPairs.length / FRENCH_TRAINING_PAIRS.length, 1);
    const epochMult = Math.min(epochs / 20, 1);
    const sizeMult = modelSize === 'small' ? 0.7 : modelSize === 'medium' ? 0.85 : 0.95;
    const overfit = epochs > 10 ? Math.max(0, (epochs - 10) * 0.5) : 0;
    return Math.max(30, Math.min(95, Math.round((dataMult * 0.4 + epochMult * 0.3 + sizeMult * 0.3) * 100 - overfit)));
  };

  const getBleu = () => Math.round(getAccuracy() * 0.45);

  const startTraining = () => {
    setTraining(true);
    setProgress(0);
    setTrained(false);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTraining(false);
          setTrained(true);
          return 100;
        }
        return p + 100 / (epochs * 8);
      });
    }, 120);
  };

  const doTest = async () => {
    if (!testInput) return;
    setIsTranslating(true);
    try {
      const result = await translate(testInput, 'french');
      setTestOutput(result.text);
    } catch {
      setTestOutput('Translation service unavailable');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-teal/5 rounded-xl p-4 text-sm text-near-black/70 dark:text-warm-white/60">
        Select training data, configure your model, and simulate the training process. The AI API runs the actual
        translation.
      </div>

      {/* Training data selection */}
      <div>
        <h4 className="font-semibold mb-3 text-sm">
          Training Data ({selectedPairs.length}/{FRENCH_TRAINING_PAIRS.length} pairs selected)
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
          {FRENCH_TRAINING_PAIRS.map((pair, i) => (
            <button
              key={i}
              onClick={() => togglePair(i)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs text-left transition-all',
                selectedPairs.includes(i)
                  ? 'border-teal bg-teal/10 text-teal'
                  : 'border-near-black/10 dark:border-warm-white/10 hover:border-teal/30'
              )}
            >
              <span
                className={cn(
                  'w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center text-[10px]',
                  selectedPairs.includes(i) ? 'bg-teal border-teal text-white' : 'border-current'
                )}
              >
                {selectedPairs.includes(i) ? '✓' : ''}
              </span>
              <span className="truncate font-mono">{pair.french}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Config */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold mb-2 text-sm">Model Size</h4>
          <div className="flex gap-2">
            {(['small', 'medium', 'large'] as const).map(s => (
              <button
                key={s}
                onClick={() => setModelSize(s)}
                className={cn(
                  'flex-1 py-2 rounded-lg border text-xs font-semibold capitalize transition-all',
                  modelSize === s
                    ? 'border-amber bg-amber/20 text-amber'
                    : 'border-near-black/10 dark:border-warm-white/10 hover:border-amber/30'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-sm">Training Epochs: {epochs}</h4>
          <input
            type="range"
            min={1}
            max={20}
            value={epochs}
            onChange={e => setEpochs(+e.target.value)}
            className="w-full accent-amber"
          />
          <div className="flex justify-between text-xs text-near-black/40 dark:text-warm-white/30">
            <span>1 (fast)</span>
            <span>20 (thorough)</span>
          </div>
        </div>
      </div>

      {/* Train button */}
      <button
        onClick={startTraining}
        disabled={training || selectedPairs.length === 0}
        className="w-full py-3 bg-amber text-charcoal rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Play size={18} /> {training ? 'Training...' : 'Train Model!'}
      </button>

      {/* Progress */}
      <AnimatePresence>
        {(training || trained) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="w-full bg-near-black/10 dark:bg-warm-white/10 rounded-full h-3 mb-2">
              <motion.div
                className="h-3 bg-gradient-to-r from-amber to-coral rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-near-black/50 dark:text-warm-white/40">
              {Math.round(progress)}% complete
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Report card */}
      <AnimatePresence>
        {trained && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber/20 p-6 bg-amber/5"
          >
            <h4 className="font-cinzel font-bold text-lg mb-4 flex items-center gap-2">
              <Trophy size={20} className="text-amber" /> Training Report Card
            </h4>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-3 rounded-xl bg-amber/10">
                <div className="text-3xl font-bold text-amber">{getAccuracy()}%</div>
                <div className="text-xs text-near-black/50 dark:text-warm-white/40">Accuracy</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-teal/10">
                <div className="text-3xl font-bold text-teal">{getBleu()}</div>
                <div className="text-xs text-near-black/50 dark:text-warm-white/40">BLEU Score</div>
              </div>
            </div>
            <div className="text-sm text-near-black/70 dark:text-warm-white/60 space-y-1">
              {epochs > 10 && (
                <p className="text-coral">Warning: Your model might be overfitting — try fewer epochs!</p>
              )}
              {selectedPairs.length < 8 && (
                <p className="text-coral">Tip: Add more training data to improve accuracy.</p>
              )}
              {selectedPairs.length > 15 && (
                <p className="text-teal">Great job! More data leads to better generalization.</p>
              )}
            </div>
            <div className="mt-6">
              <h5 className="font-semibold text-sm mb-2">Test your model:</h5>
              <div className="flex gap-2">
                <input
                  value={testInput}
                  onChange={e => setTestInput(e.target.value)}
                  placeholder="Enter French text..."
                  className="flex-1 px-3 py-2 rounded-lg border border-amber/20 text-sm focus:outline-none bg-white dark:bg-near-black/30"
                />
                <button
                  onClick={doTest}
                  disabled={isTranslating}
                  className="px-4 py-2 bg-amber text-charcoal rounded-lg text-sm font-bold hover:bg-amber/90 disabled:opacity-50"
                >
                  {isTranslating ? '...' : 'Test'}
                </button>
              </div>
              {testOutput && <div className="mt-2 rounded-lg bg-teal/10 p-3 text-sm">{testOutput}</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AkkadianChallenge() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-near-black/5 dark:bg-warm-white/5 p-6">
        <h3 className="font-cinzel text-xl font-bold mb-4 text-amber">The Kaggle Deep Past Challenge</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Training documents', value: '~1,500', icon: '📄' },
            { label: 'Model parameters', value: '3.7B', icon: '🧠' },
            { label: 'Winning ChrF++ score', value: '54.7', icon: '🏆' },
          ].map(item => (
            <div key={item.label} className="text-center p-4 rounded-xl bg-amber/5 border border-amber/10">
              <div className="text-3xl mb-1">{item.icon}</div>
              <div className="font-bold text-amber text-xl">{item.value}</div>
              <div className="text-xs text-near-black/50 dark:text-warm-white/40 mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <h4 className="font-semibold mb-3">Preprocessing Pipeline</h4>
        <div className="space-y-2 mb-6">
          {[
            {
              step: 'Character normalization',
              before: 'h → ḫ, ( → {, ) → }',
              after: 'Standardized Akkadian characters',
            },
            { step: 'Gap handling', before: 'xxx, [...], PN', after: '<gap> tokens' },
            { step: 'Subscript conversion', before: 'a4, DU10', after: 'a₄, DU₁₀' },
            { step: 'Fraction normalization', before: '1/3, 0.333', after: '⅓' },
          ].map(item => (
            <div
              key={item.step}
              className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs py-2 border-b border-amber/10 last:border-0"
            >
              <span className="font-semibold w-44 flex-shrink-0">{item.step}</span>
              <span className="font-mono text-coral/70 flex-1">{item.before}</span>
              <span className="text-amber/60">→</span>
              <span className="font-mono text-teal/70 flex-1">{item.after}</span>
            </div>
          ))}
        </div>

        <h4 className="font-semibold mb-3">Before / After Examples</h4>
        <div className="space-y-3">
          {[
            {
              raw: 'KIŠIB ma-nu-ba-lúm-a-šur DUMU ṣí-lá-(d)IM broken [...]',
              clean: 'KIŠIB ma-nu-ba-lúm-a-šur DUMU ṣí-lá-{d}IM <gap>',
            },
            {
              raw: '0.333 ma-na 2 GÍN KÙ.BABBAR',
              clean: '⅓ ma-na 2 GÍN KÙ.BABBAR',
            },
          ].map((ex, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-amber/10">
              <div className="px-3 py-2 bg-coral/10 font-mono text-xs">
                <span className="text-coral/60 mr-2">raw:</span>
                {ex.raw}
              </div>
              <div className="px-3 py-2 bg-teal/10 font-mono text-xs">
                <span className="text-teal/60 mr-2">clean:</span>
                {ex.clean}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-amber/10 border border-amber/20 text-center">
          <p className="text-sm font-semibold mb-2">Baseline (word-by-word) vs. ByT5-XL Winner</p>
          <div className="flex items-center justify-center gap-4">
            <div>
              <div className="font-bold text-2xl text-coral">12.3</div>
              <div className="text-xs text-near-black/50 dark:text-warm-white/40">Baseline ChrF++</div>
            </div>
            <div className="text-amber text-2xl">→</div>
            <div>
              <div className="font-bold text-2xl text-amber">54.7</div>
              <div className="text-xs text-near-black/50 dark:text-warm-white/40">ByT5-XL ChrF++</div>
            </div>
          </div>
          <p className="text-xs text-near-black/50 dark:text-warm-white/40 mt-2">
            4.4× improvement through deep learning
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Train() {
  const [activeTab, setActiveTab] = useState<Tab>('dictionary');

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    { id: 'dictionary', label: 'Translation Memory', icon: <BookOpen size={16} /> },
    { id: 'neural', label: 'Train Neural Model', icon: <Cpu size={16} /> },
    { id: 'akkadian', label: 'Akkadian Challenge', icon: <Trophy size={16} /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-cinzel text-4xl md:text-5xl font-bold mb-4">
            Train Your <span className="text-amber">Own Model</span>
          </h1>
          <p className="text-near-black/60 dark:text-warm-white/50 text-lg">
            Experiment with translation models — no GPU required. Learn the core concepts interactively.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm transition-all',
                activeTab === tab.id
                  ? 'bg-amber text-charcoal'
                  : 'bg-near-black/5 dark:bg-warm-white/5 hover:bg-amber/10 text-near-black/70 dark:text-warm-white/60'
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-amber/10 bg-white dark:bg-near-black/20 p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeTab === 'dictionary' && <DictionaryBuilder />}
              {activeTab === 'neural' && <TrainingSimulator />}
              {activeTab === 'akkadian' && <AkkadianChallenge />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
