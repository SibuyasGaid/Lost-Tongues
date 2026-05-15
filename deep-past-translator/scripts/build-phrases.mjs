import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseCSV(text) {
  const rows = [];
  let current = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      current.push(field); field = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      current.push(field);
      if (current.some(f => f.trim())) rows.push(current);
      current = []; field = '';
      if (ch === '\r' && text[i + 1] === '\n') i++;
    } else {
      field += ch;
    }
  }
  if (field || current.length) { current.push(field); rows.push(current); }
  return rows;
}

function categorize(translation) {
  const t = translation.toLowerCase();
  if (/thus says|speak to|urgent|missive|wrote to me|wrote us|have written|letter/.test(t)) return 'Letters';
  if (/silver|gold|mina|shekel|copper|tin|price|paid|payment|bought|sold|lent|debt|interest|loan/.test(t)) return 'Commercial';
  if (/seal of|witnessed by|verdict|colony|court|testimony|proceedings|dagger/.test(t)) return 'Legal';
  if (/textile|wool|garment|donkey|caravan|merchandise|transport|cargo/.test(t)) return 'Trade & Goods';
  return 'Fragments';
}

const csvPath = join(__dirname, '../../sample_files/train.csv');
const text = readFileSync(csvPath, 'utf-8');
const rows = parseCSV(text);

const phrases = [];
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (row.length < 3) continue;
  const [id, akkadian, english] = row;
  if (!akkadian?.trim() || !english?.trim()) continue;
  phrases.push({
    id: id.trim(),
    akkadian: akkadian.trim(),
    english: english.trim(),
    category: categorize(english),
  });
}

mkdirSync(join(__dirname, '../public'), { recursive: true });
const outputPath = join(__dirname, '../public/akkadian-phrases.json');
writeFileSync(outputPath, JSON.stringify(phrases), 'utf-8');

const cats = {};
phrases.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1; });
console.log(`✓ ${phrases.length} phrases → public/akkadian-phrases.json`);
console.log('  Categories:', cats);
