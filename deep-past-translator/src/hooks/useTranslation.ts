import { useState, useCallback, useRef } from 'react';
import { translate } from '../lib/api';
import type { AkkadianPhrase } from '../components/translate/PhraseModal';

export function useTranslation() {
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doTranslate = useCallback(async (
    text: string,
    languageId: string,
    allPhrases: AkkadianPhrase[] = [],
  ) => {
    if (!text.trim()) { setOutput(''); setError(null); return; }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await translate(text, languageId, allPhrases);
        setOutput(result.text);
        setIsCached(result.cached);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Translation failed');
        setOutput('');
      } finally {
        setIsLoading(false);
      }
    }, 800);
  }, []);

  return { output, isLoading, error, isCached, doTranslate };
}
