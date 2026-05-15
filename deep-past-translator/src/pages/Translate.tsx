import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Copy, RefreshCw, Info, CheckCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { LANGUAGES, EXAMPLE_PHRASES } from '../lib/constants';
import { getPreprocessSteps } from '../lib/preprocess';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '../lib/utils';

export default function Translate() {
  const [searchParams] = useSearchParams();
  const initialLang = LANGUAGES.find(l => l.id === searchParams.get('lang')) ?? LANGUAGES[0];
  const [selectedLang, setSelectedLang] = useState(initialLang);
  const [inputText, setInputText] = useState('');
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const { output, isLoading, error, isCached, doTranslate } = useTranslation();

  useEffect(() => {
    if (inputText) doTranslate(inputText, selectedLang.id);
  }, [inputText, selectedLang.id]);

  const preprocessSteps =
    selectedLang.id === 'akkadian' && inputText ? getPreprocessSteps(inputText) : [];

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-cinzel text-3xl md:text-5xl font-bold mb-4"
          >
            Live <span className="text-amber">AI Translator</span>
          </motion.h1>
          <p className="text-near-black/60 dark:text-warm-white/50 text-lg">
            Translate ancient Akkadian and modern languages into English using real AI models
          </p>
        </div>

        {/* Language selector */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {LANGUAGES.map(lang => (
            <button
              key={lang.id}
              onClick={() => {
                setSelectedLang(lang);
                setInputText('');
              }}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all',
                selectedLang.id === lang.id
                  ? 'border-amber bg-amber text-charcoal'
                  : 'border-amber/20 hover:border-amber/50 dark:border-warm-white/20'
              )}
            >
              <span>{lang.flag}</span> {lang.name}
            </button>
          ))}
        </div>

        {/* Example phrases */}
        <div className="mb-6">
          <p className="text-xs text-near-black/50 dark:text-warm-white/40 mb-2 text-center">Try an example:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {(EXAMPLE_PHRASES[selectedLang.id] || []).map(ex => (
              <button
                key={ex.source}
                onClick={() => setInputText(ex.source)}
                className="px-3 py-1.5 text-xs rounded-lg bg-amber/10 hover:bg-amber/20 border border-amber/20 font-mono transition-colors max-w-xs truncate"
              >
                {ex.source}
              </button>
            ))}
          </div>
        </div>

        {/* Translation panes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Input */}
          <div className="rounded-2xl border border-amber/20 overflow-hidden bg-white dark:bg-near-black/50">
            <div className="px-4 py-3 border-b border-amber/10 flex items-center gap-3">
              <span className="text-xl">{selectedLang.flag}</span>
              <span className="font-cinzel font-bold text-sm">{selectedLang.name}</span>
              {selectedLang.id === 'akkadian' && (
                <span className="text-xs text-amber bg-amber/10 px-2 py-0.5 rounded-full">
                  Cuneiform Transliteration
                </span>
              )}
            </div>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={
                selectedLang.id === 'akkadian'
                  ? 'Enter Akkadian transliteration...'
                  : `Enter ${selectedLang.name} text...`
              }
              className="w-full h-48 p-4 bg-transparent resize-none font-mono text-sm focus:outline-none placeholder-near-black/30 dark:placeholder-warm-white/20"
            />
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-teal/20 overflow-hidden bg-white dark:bg-near-black/50 relative">
            <div className="px-4 py-3 border-b border-teal/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🇬🇧</span>
                <span className="font-cinzel font-bold text-sm">English</span>
                {isCached && output && (
                  <span className="text-xs text-warm-white/40 bg-near-black/20 px-2 py-0.5 rounded-full">
                    example
                  </span>
                )}
              </div>
              {output && (
                <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-teal/10 transition-colors">
                  {copied ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <Copy size={16} className="text-near-black/50" />
                  )}
                </button>
              )}
            </div>
            <div className="h-48 p-4 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center gap-3 h-full">
                  <RefreshCw size={18} className="animate-spin text-amber" />
                  <span className="text-near-black/40 dark:text-warm-white/30 text-sm">Translating...</span>
                </div>
              ) : error ? (
                <div className="text-coral text-sm">{error}</div>
              ) : output ? (
                <p className="text-near-black dark:text-warm-white leading-relaxed">{output}</p>
              ) : (
                <p className="text-near-black/30 dark:text-warm-white/20 text-sm italic">
                  Translation will appear here...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Breakdown section */}
        {selectedLang.id === 'akkadian' && inputText && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-2 mx-auto px-6 py-3 border border-amber/30 rounded-xl hover:bg-amber/5 transition-colors mb-4"
            >
              <Info size={16} className="text-amber" />
              <span className="text-sm font-semibold">How did the AI process this?</span>
              <ChevronDown
                size={16}
                className={cn('text-amber transition-transform', showBreakdown && 'rotate-180')}
              />
            </button>

            <AnimatePresence>
              {showBreakdown && preprocessSteps.length > 0 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {preprocessSteps.map((step, i) => (
                      <motion.div
                        key={step.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-xl border border-amber/10 p-4 bg-amber/5"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{step.icon}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{step.name}</h4>
                            <p className="text-xs text-near-black/50 dark:text-warm-white/40">{step.description}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="font-mono text-xs bg-coral/10 rounded p-2 overflow-x-auto">
                            <span className="text-coral/60 mr-1">before:</span> {step.before}
                          </div>
                          <div className="font-mono text-xs bg-teal/10 rounded p-2 overflow-x-auto">
                            <span className="text-teal mr-1">after:</span> {step.after}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
