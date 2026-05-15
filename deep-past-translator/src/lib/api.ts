// In dev, requests go through Vite proxies to avoid CORS preflight failures.
// Router endpoint (new): /hf-api  → router.huggingface.co/hf-inference
// Legacy endpoint (old): /hf-legacy → api-inference.huggingface.co
const ROUTER_BASE = import.meta.env.DEV
  ? '/hf-api/models'
  : 'https://router.huggingface.co/hf-inference/models';

const LEGACY_BASE = import.meta.env.DEV
  ? '/hf-legacy/models'
  : 'https://api-inference.huggingface.co/models';

const API_TOKEN = import.meta.env.VITE_HF_API_TOKEN || '';

import { MODEL_MAP, LANGUAGE_PHRASE_CACHE } from './constants';
import type { AkkadianPhrase } from '../components/translate/PhraseModal';

// Thrown when a model has no inference support on either endpoint
class NoInferenceSupport extends Error {
  constructor() { super('NO_INFERENCE_SUPPORT'); }
}

async function fetchHF(base: string, modelId: string, text: string): Promise<Response> {
  return fetch(`${base}/${modelId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: text,
      options: { wait_for_model: true },
    }),
  });
}

async function callHF(modelId: string, text: string, retries = 3): Promise<string> {
  let response = await fetchHF(ROUTER_BASE, modelId, text);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const notSupported =
      typeof body.error === 'string' &&
      body.error.toLowerCase().includes('not supported by provider');

    if (notSupported) {
      // Fall back to legacy endpoint
      response = await fetchHF(LEGACY_BASE, modelId, text);
    } else if (response.status === 503 && retries > 0) {
      const wait = Math.min((body.estimated_time ?? 10) * 1000, 15_000);
      await new Promise(r => setTimeout(r, wait));
      return callHF(modelId, text, retries - 1);
    } else {
      throw new Error(body.error ?? `API error ${response.status}`);
    }
  }

  // Handle errors from the legacy fallback
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    if (response.status === 404) throw new NoInferenceSupport();
    if (response.status === 503 && retries > 0) {
      const wait = Math.min((body.estimated_time ?? 10) * 1000, 15_000);
      await new Promise(r => setTimeout(r, wait));
      return callHF(modelId, text, retries - 1);
    }
    throw new Error(body.error ?? `API error ${response.status}`);
  }

  const result = await response.json();
  if (result.error) throw new Error(result.error);

  return (
    result[0]?.translation_text ??
    result[0]?.generated_text ??
    'Translation unavailable'
  );
}

export async function translate(
  text: string,
  languageId: string,
  allPhrases: AkkadianPhrase[] = [],
): Promise<{ text: string; cached: boolean }> {
  const modelId = MODEL_MAP[languageId];

  if (languageId === 'akkadian') {
    const key = text.toLowerCase().trim();
    // Search full phrase list first (1,561 pairs from train.csv)
    const match = allPhrases.find(p => p.akkadian.toLowerCase().trim() === key);
    if (match) return { text: match.english, cached: true };

    // No match — show friendly message
    if (modelId === 'PLACEHOLDER_AKKADIAN_MODEL') {
      return {
        text: "This phrase doesn't match any known translation. Please try again, or browse all phrases!",
        cached: true,
      };
    }
  }

  try {
    const translated = await callHF(modelId, text);
    return { text: translated, cached: false };
  } catch (err) {
    if (err instanceof NoInferenceSupport) {
      // Check the phrase cache for this language
      const cache = LANGUAGE_PHRASE_CACHE[languageId];
      if (cache) {
        const hit = cache[text.toLowerCase().trim()];
        if (hit) return { text: hit, cached: true };
        return {
          text: 'Live translation for this language is unavailable on the free API tier. Try one of the example phrases above!',
          cached: true,
        };
      }
    }
    throw err;
  }
}
