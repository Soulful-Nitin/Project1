export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to 1
  topics: string[];
}

const POSITIVE_WORDS = [
  'delicious', 'tasty', 'amazing', 'excellent', 'fresh', 'good', 'great', 'love',
  'clean', 'hot', 'crispy', 'perfect', 'flavorful', 'flavourful', 'hygienic',
  'satisfied', 'yummy', 'superb', 'enjoyed', 'warm', 'sufficient', 'tender',
  'soft', 'nicely', 'well cooked', 'better', 'improved', 'best'
];

const NEGATIVE_WORDS = [
  'terrible', 'horrible', 'bad', 'poor', 'disgusting', 'awful', 'stale', 'cold',
  'oily', 'greasy', 'salty', 'too salty', 'spicy', 'too spicy', 'bland', 'burnt',
  'undercooked', 'raw', 'hair', 'insect', 'fly', 'dirty', 'unhygienic', 'smell',
  'smelly', 'sour', 'watery', 'tasteless', 'hard', 'stiff', 'less', 'insufficient',
  'late', 'delay', 'repetitive', 'boring', 'unhealthy', 'worst', 'unpleasant'
];

const TOPIC_KEYWORDS: Record<string, string[]> = {
  'Taste': ['taste', 'flavor', 'flavour', 'delicious', 'yummy', 'bland', 'tasteless', 'sweet', 'sour', 'bitter'],
  'Oiliness': ['oil', 'oily', 'grease', 'greasy', 'fat', 'heavy', 'deep fried'],
  'Spiciness': ['spicy', 'chili', 'chilli', 'mirchi', 'masala', 'hot', 'pepper', 'pungent'],
  'Saltiness': ['salt', 'salty', 'too salty', 'no salt', 'namak'],
  'Hygiene': ['hygiene', 'clean', 'dirty', 'hair', 'insect', 'fly', 'cockroach', 'stone', 'unhygienic', 'germs', 'hand wash'],
  'Freshness': ['fresh', 'stale', 'smell', 'rotten', 'old food', 'leftover', 'fungus'],
  'Quantity': ['quantity', 'portion', 'amount', 'less', 'more', 'served less', 'shortage', 'finished early', 'insufficient'],
  'Temperature': ['cold', 'hot', 'lukewarm', 'warm', 'chilled', 'frozen', 'temperature'],
  'Timing & Service': ['late', 'delay', 'queue', 'waiting', 'slow', 'staff', 'behavior', 'rude', 'serving'],
  'Menu Variety': ['repeat', 'repetition', 'everyday', 'same menu', 'boring', 'variety', 'change'],
};

export class SentimentService {
  /**
   * Analyzes feedback text and produces sentiment and topic tags.
   * Built modularly so it can easily bridge to OpenAI/Gemini/HuggingFace if API key is provided.
   */
  public static analyze(text: string): SentimentAnalysisResult {
    if (!text || text.trim().length === 0) {
      return {
        sentiment: 'neutral',
        sentimentScore: 0,
        topics: [],
      };
    }

    const lowerText = text.toLowerCase();
    const words = lowerText.match(/\b\w+\b/g) || [];

    let score = 0;
    let matchedPositive = 0;
    let matchedNegative = 0;

    for (const word of POSITIVE_WORDS) {
      if (lowerText.includes(word)) {
        score += 1;
        matchedPositive++;
      }
    }

    for (const word of NEGATIVE_WORDS) {
      if (lowerText.includes(word)) {
        score -= 1.3; // Negative words slightly heavier weight
        matchedNegative++;
      }
    }

    // Negation adjustments: "not good", "not fresh", "never clean"
    const negationRegex = /\b(not|never|hardly|scarcely|barely)\s+(\w+)\b/g;
    let match;
    while ((match = negationRegex.exec(lowerText)) !== null) {
      const nextWord = match[2];
      if (POSITIVE_WORDS.includes(nextWord)) {
        score -= 2.0;
        matchedNegative++;
      } else if (NEGATIVE_WORDS.includes(nextWord)) {
        score += 1.5;
        matchedPositive++;
      }
    }

    // Determine topics
    const topics: string[] = [];
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      if (keywords.some((kw) => lowerText.includes(kw))) {
        topics.push(topic);
      }
    }

    // Normalize sentiment score between -1 and 1
    const totalMatches = matchedPositive + matchedNegative || 1;
    let normalizedScore = Number(Math.max(-1, Math.min(1, score / (totalMatches * 1.5))).toFixed(2));

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (normalizedScore >= 0.2) {
      sentiment = 'positive';
    } else if (normalizedScore <= -0.2) {
      sentiment = 'negative';
    }

    return {
      sentiment,
      sentimentScore: normalizedScore,
      topics: topics.length > 0 ? topics : ['General'],
    };
  }
}
