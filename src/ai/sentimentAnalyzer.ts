import { SentimentAspect, SentimentResult } from '../types';

const POSITIVE_WORDS = new Set(['amazing', 'great', 'excellent', 'delicious', 'tasty', 'fresh', 'friendly', 'fast', 'quick', 'clean', 'good', 'love', 'loved', 'perfect', 'affordable', 'generous', 'warm', 'polite', 'recommend', 'best', 'wonderful', 'juicy']);
const NEGATIVE_WORDS = new Set(['slow', 'bad', 'cold', 'rude', 'dirty', 'small', 'expensive', 'bland', 'late', 'worst', 'terrible', 'awful', 'overpriced', 'stale', 'disappointing', 'poor', 'undercooked', 'burnt', 'greasy']);

const ASPECT_KEYWORDS: Record<SentimentAspect['label'], Set<string>> = {
  Taste: new Set(['taste', 'tasty', 'flavor', 'flavour', 'delicious', 'bland', 'spicy', 'juicy']),
  Service: new Set(['service', 'staff', 'waiter', 'waitress', 'server', 'slow', 'rude', 'friendly', 'polite']),
  Portion: new Set(['portion', 'quantity', 'size', 'small', 'large', 'generous']),
  Price: new Set(['price', 'expensive', 'cheap', 'affordable', 'overpriced', 'value']),
  Cleanliness: new Set(['clean', 'dirty', 'hygiene', 'hygienic']),
  Ambience: new Set(['ambience', 'ambiance', 'atmosphere', 'decor', 'seating', 'music']),
};

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z']+/g) || []);
}

function sentenceSplit(text: string): string[] {
  return text.split(/[.!?]/).map((s) => s.trim()).filter(Boolean);
}

function sentimentOf(tokens: string[]): 'Positive' | 'Negative' | 'Neutral' {
  let pos = 0, neg = 0;
  tokens.forEach((t) => { if (POSITIVE_WORDS.has(t)) pos++; if (NEGATIVE_WORDS.has(t)) neg++; });
  if (pos > neg) return 'Positive';
  if (neg > pos) return 'Negative';
  return 'Neutral';
}

/** Lightweight aspect-based sentiment analysis (rule-based, transparent). */
export function analyzeSentiment(text: string): SentimentResult {
  const sentences = sentenceSplit(text).length ? sentenceSplit(text) : [text];
  const aspectSentiments: Record<string, ('Positive' | 'Negative' | 'Neutral')[]> = {};

  sentences.forEach((sentence) => {
    const tokens = tokenize(sentence);
    const s = sentimentOf(tokens);
    (Object.keys(ASPECT_KEYWORDS) as SentimentAspect['label'][]).forEach((aspect) => {
      if (tokens.some((t) => ASPECT_KEYWORDS[aspect].has(t))) {
        aspectSentiments[aspect] = aspectSentiments[aspect] || [];
        aspectSentiments[aspect].push(s);
      }
    });
  });

  const aspects: SentimentAspect[] = Object.entries(aspectSentiments).map(([label, sentiments]) => {
    const pos = sentiments.filter((s) => s === 'Positive').length;
    const neg = sentiments.filter((s) => s === 'Negative').length;
    const overall = pos > neg ? 'Positive' : neg > pos ? 'Negative' : 'Neutral';
    return { label: label as SentimentAspect['label'], sentiment: overall };
  });

  const allTokens = tokenize(text);
  const posCount = allTokens.filter((t) => POSITIVE_WORDS.has(t)).length;
  const negCount = allTokens.filter((t) => NEGATIVE_WORDS.has(t)).length;
  let overall: SentimentResult['overall'] = 'Neutral';
  if (posCount > 0 && negCount > 0) overall = 'Mixed';
  else if (posCount > negCount) overall = 'Positive';
  else if (negCount > posCount) overall = 'Negative';

  return { overall, aspects };
}
