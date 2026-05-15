// TypeScript port of cleaner.py preprocess functions

const FRACTION_LOOKUP: Record<string, string> = {
  '1_6': '⅙', '1_4': '¼', '1_3': '⅓', '1_2': '½',
  '2_3': '⅔', '3_4': '¾', '5_6': '⅚',
};

function nearestFraction(decimal: number): string | null {
  const frac: Record<string, number> = {
    '1_6': 1 / 6, '1_4': 0.25, '1_3': 1 / 3, '1_2': 0.5,
    '2_3': 2 / 3, '3_4': 0.75, '5_6': 5 / 6,
  };
  for (const [key, val] of Object.entries(frac)) {
    if (Math.abs(decimal - val) < 0.005) return FRACTION_LOOKUP[key];
  }
  return null;
}

export function processFractionsDynamic(text: string): string {
  if (typeof text !== 'string') return String(text);

  // Step 0.1: Clean boundary markers
  text = text.replace(/\((\+?\d+)\)/g, '$1');
  text = text.replace(/\[(\+?\d+)\]/g, '$1');
  text = text.replace(/˹(\+?\d+)˺/g, '$1');
  text = text.replace(/⌈(\+?\d+)⌋/g, '$1');
  text = text.replace(/「(\+?\d+)」/g, '$1');
  text = text.replace(/⸢(\+?\d+)⸣/g, '$1');

  // Step 0.2: X+X addition
  const additionPattern = /(\d+(?:\.\d+)?)\s*\+\s*(\d+(?:\.\d+)?)/g;
  let prev = '';
  while (prev !== text) {
    prev = text;
    text = text.replace(additionPattern, (_, a, b) => {
      const result = parseFloat(a) + parseFloat(b);
      return result % 1 === 0 ? String(Math.floor(result)) : result.toFixed(5).replace(/\.?0+$/, '');
    });
  }

  // Step 0.3: Roman month numbers
  const romanMap: Record<string, string> = {
    'XII': '12', 'VIII': '8', 'VII': '7', 'III': '3', 'XI': '11',
    'IX': '9', 'VI': '6', 'IV': '4', 'II': '2', 'X': '10', 'V': '5', 'I': '1',
  };
  text = text.replace(/\b(Month|month)\s+(XII|VIII|VII|III|XI|IX|VI|IV|II|X|V|I)\b/g,
    (_, m, r) => `${m} ${romanMap[r]}`);

  // Step 1.1: Common fractions to unicode
  text = text.replace(/1\s*\/\s*6/g, '⅙');
  text = text.replace(/1\s*\/\s*4/g, '¼');
  text = text.replace(/1\s*\/\s*3/g, '⅓');
  text = text.replace(/1\s*\/\s*2/g, '½');
  text = text.replace(/2\s*\/\s*3/g, '⅔');
  text = text.replace(/3\s*\/\s*4/g, '¾');
  text = text.replace(/5\s*\/\s*6/g, '⅚');

  // Step 1.2: General fraction conversion
  text = text.replace(/(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)/g, (_match, int_, num1, den1, num2, den2) => {
    let val: number;
    if (int_ !== undefined) {
      val = parseInt(int_) + parseInt(num1) / parseInt(den1);
    } else {
      val = parseInt(num2) / parseInt(den2);
    }
    return val % 1 === 0 ? String(Math.floor(val)) : val.toFixed(5).replace(/\.?0+$/, '');
  });

  // Step 2.1: Truncate long floats
  text = text.replace(/(\d+\.\d{5})\d+/g, '$1');

  // Step 2.2: Convert decimals to unicode fractions
  text = text.replace(/\b\d+\.\d+\b/g, (match) => {
    const val = parseFloat(match);
    const intPart = Math.floor(val);
    const decPart = val - intPart;
    if (decPart < 0.0001) return String(intPart);
    const frac = nearestFraction(decPart);
    if (frac) {
      return intPart === 0 ? frac : `${intPart} ${frac}`;
    }
    return match;
  });

  // Step 3.1: Ensure space between integer and fraction
  text = text.replace(/(\d)([¼½¾⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞])/g, '$1 $2');

  return text;
}

// Safe subscript conversion without lookbehind (for browser compatibility)
const AKKADIAN_LETTERS = new Set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZšŠṣṢṭṬḫḪ'.split(''));
const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
};

function convertSubscripts(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (/\d/.test(ch) && i > 0 && AKKADIAN_LETTERS.has(text[i - 1])) {
      // Collect all consecutive digits
      let digits = ch;
      let j = i + 1;
      while (j < text.length && /\d/.test(text[j])) {
        digits += text[j];
        j++;
      }
      result += digits.split('').map(d => SUBSCRIPT_MAP[d] || d).join('');
      i = j - 1;
    } else {
      result += ch;
    }
  }
  return result;
}

export function preprocessTransliteration(text: string | null | undefined): string {
  if (text == null) return '';

  // Special symbol removal
  text = text.replace(/\s*Seal Impression [A-Z]\s*/g, '');
  text = text.replace(/Seal Impression/g, '');
  text = text.replace(/broken/g, 'xxx');
  text = text.replace(/------------/g, '');
  text = text.replace(/---- Single Ruling ----/g, '');
  text = text.replace(/---- Double Ruling ----/g, '');

  // Character substitutions
  const charMap: Record<string, string> = {
    'X': 'x', '×': 'x', 'ā': 'a', 'Ş': 'Ṣ', 'ş': 'ṣ', 'Ș': 'Ṣ', 'ș': 'ṣ',
    'Ț': 'Ṭ', 'ț': 'ṭ', 'İ': 'I', 'Ī': 'I', 'ī': 'i', 'Î': 'I', 'î': 'i',
    'ı': 'i', 'h': 'ḫ', 'H': 'Ḫ', 'ḥ': 'ḫ', 'Ḥ': 'Ḫ', '=': '-',
    '(': '{', ')': '}', '—': '-', '–': '-',
  };
  for (const [from, to] of Object.entries(charMap)) {
    text = text.split(from).join(to);
  }
  text = text.split('ᵈ').join('{d}').split('ᵏⁱ').join('{ki}');
  text = text.split('{{').join('{').split('}}').join('}');
  text = text.split('??').join('?').split('!!').join('!').split('//').join('/');
  text = text.split('-/').join('-');
  text = text.split('{?}').join('').split('{!}').join('');
  text = text.split('(?)').join('').split('(!)').join('');

  const upperChars = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁻', '°', '˚'];
  for (const ch of upperChars) text = text.split(ch).join('');
  const badChars1 = ['"', 'ʺ', 'ʾ', "'", '´', 'ʼ', 'ˊ', '˘', 'ˋ', 'ˇ', 'ˈ', 'ʿ', 'ʹ', '‘', '’', '`', '^', '˹', '˺', '⸢', '⸣', '⌜', '⌝', '「', '」', '⌈', '⌋', '⌊', '⌉', '˻', '˼', '⸤', '⸥', '≪', '≫', '《', '》', '⟪', '⟫', '«', '»', '〈', '〉', '⟨', '⟩', '˃', '‹', '›', '⁽', '⁾', 'ˁ', 'ˀ'];
  for (const ch of badChars1) text = text.split(ch).join('');
  const badChars2 = '!?⸮ʔ⸮,/;˷˴|:⁺*';
  for (const ch of badChars2) text = text.split(ch).join(' ');

  // Fractions
  text = processFractionsDynamic(text);

  // Subscript conversion (browser-safe, no lookbehind)
  text = convertSubscripts(text);

  // Editorial annotations removal
  text = text.replace(/\(\s*(?:fem\.|sing\.|pl\.|plural|f\.|plur\.)(?:\s+(?:fem\.|sing\.|pl\.|plural|f\.|plur\.))*\s*\)/g, '');
  text = text.replace(/\(\s*(?:K|Rs|lR)(?:\s+(?:K|Rs|lR))*\s*\)/g, '');
  text = text.replace(/\b(?:le\.e\.|lo\.e\.|l\.o\.e\.|obv\.|rev\.|r\.e\.|u\.e\.)\s*/g, '');

  // Gap replacement
  text = text.replace(/\bPN\b|\bPn\b/g, '<gap>');
  text = text.replace(/\bbreak\b|\bbroken\b/g, '');
  text = text.replace(/\[\s*[sx?]*\]/g, '[xxx]');
  const badCharsSquare = '[]';
  for (const ch of badCharsSquare) text = text.split(ch).join('');
  text = text.replace(/(?:\.\s+){2,}\./g, (m) => m.replace(/ /g, ''));
  text = text.replace(/\.{3,}(\s+\.{3,})*/g, '<gap>');
  text = text.replace(/……|…/g, '<gap>');
  text = text.replace(/xx+/g, '<gap>');
  text = text.replace(/\bx\b/g, '<gap>');
  text = text.split('{large break}').join('<gap>');
  text = text.replace(/\{\d+\s+broken\s+lines\}/g, '<gap>');
  text = text.split('<gap>').join('\x00GAP\x00');
  const badCharsAngle = '<>';
  for (const ch of badCharsAngle) text = text.split(ch).join('');
  text = text.split('\x00GAP\x00').join(' <gap> ');

  text = text.replace(/\s+/g, ' ').trim().replace(/^-+|-+$/g, '');
  text = text.split(' -').join('-').split('- ').join('-');
  text = text.split(' .').join('.').split('. ').join('.');
  text = text.split('> .').join('>.').split('> :').join('>:').split("> '").join(">'");

  text = text.replace(/<gap>([ \-\t]*<gap>)+/g, '<gap>');
  text = text.split('{ <gap> }').join('<gap>');
  text = text.split('[ <gap> ]').join('<gap>');

  return text;
}

export function preprocessTranslation(text: string | null | undefined): string {
  if (text == null) return '';
  text = String(text);

  const charMap: Record<string, string> = {
    'X': 'x', "ʾ": "'", 'Ş': 'Ṣ', 'ş': 'ṣ', 'ș': 'ṣ', 'Ț': 'Ṭ', 'ț': 'ṭ',
    'ḫ': 'h', 'Ḫ': 'H', 'ḥ': 'ḫ', 'Ḥ': 'Ḫ',
  };
  for (const [from, to] of Object.entries(charMap)) text = text.split(from).join(to);
  text = text.split('{?}').join('').split('{!}').join('');
  text = text.split('(?)').join('').split('(!)').join('');

  const upperChars = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹', '⁻', '°', '˚'];
  for (const ch of upperChars) text = text.split(ch).join('');
  const lowerChars = ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'];
  for (const ch of lowerChars) text = text.split(ch).join('');

  text = processFractionsDynamic(text);

  text = text.replace(/\bPN\b|\bPn\b/g, '<gap>');
  text = text.replace(/\[\s*[sx?]*\]/g, '[xxx]');
  text = text.replace(/(?:\.\s+){2,}\./g, (m) => m.replace(/ /g, ''));
  text = text.replace(/\.{3,}(\s+\.{3,})*/g, '<gap>');
  text = text.replace(/……|…/g, '<gap>');
  text = text.replace(/xx+/gi, '<gap>');
  text = text.replace(/\bx\b/gi, '<gap>');
  text = text.split('{large break}').join('<gap>');
  text = text.replace(/\{\d+\s+broken\s+lines\}/g, '<gap>');

  text = text.split('<gap>').join('\x00GAP\x00');
  const badCharsSquare = '˹˺⸢⸣「」⌈⌋⌊|';
  for (const ch of badCharsSquare) text = text.split(ch).join('');
  const badCharsSlash = '/*+';
  for (const ch of badCharsSlash) text = text.split(ch).join(' ');
  text = text.split('\x00GAP\x00').join(' <gap> ');

  text = text.replace(/\s+/g, ' ').trim().replace(/^-+|-+$/g, '');
  text = text.split(' -').join('-').split('- ').join('-');
  text = text.split('> .').join('>.').split('> :').join('>:');

  text = text.replace(/<gap>([ \-\t]*<gap>)+/g, '<gap>');
  text = text.split('{ <gap> }').join('<gap>');
  text = text.split('[ <gap> ]').join('<gap>');

  return text;
}

export interface PreprocessStep {
  name: string;
  description: string;
  before: string;
  after: string;
  icon: string;
}

export function getPreprocessSteps(inputText: string): PreprocessStep[] {
  const step0 = inputText;

  let step1 = step0;
  // char normalization
  const charMap: Record<string, string> = { 'h': 'ḫ', 'H': 'Ḫ', '(': '{', ')': '}' };
  for (const [f, t] of Object.entries(charMap)) step1 = step1.split(f).join(t);

  const step2 = step1
    .replace(/\bPN\b|\bPn\b/g, '<gap>')
    .replace(/xx+/g, '<gap>')
    .replace(/\bx\b/g, '<gap>')
    .replace(/\.{3,}/g, '<gap>');

  const step3 = convertSubscripts(step2);

  const step4 = processFractionsDynamic(step3);

  return [
    { name: 'Character Normalization', description: 'Standardize special Akkadian characters (h to hh, H to HH, brackets)', before: step0, after: step1, icon: '[A]' },
    { name: 'Gap Replacement', description: 'Replace damaged sections (xx+, ..., PN) with <gap> tokens', before: step1, after: step2, icon: '[?]' },
    { name: 'Subscript Conversion', description: 'Convert trailing digits to subscript notation (a4 to a4)', before: step2, after: step3, icon: '[4]' },
    { name: 'Fraction Normalization', description: 'Convert fractions to Unicode symbols (1/3 to 1/3, 0.5 to 1/2)', before: step3, after: step4, icon: '[/]' },
  ];
}
