// utils/bm25.ts
import winkBM25 from "wink-bm25-text-search";
import winkNLP from "wink-nlp";
import model from "wink-eng-lite-web-model";

const nlp = winkNLP(model);
const bm25 = winkBM25();

bm25.defineConfig({ fldWeights: { text: 1 } });
bm25.definePrepTasks([(text: string) => nlp.readDoc(text).tokens().out()]);

export function encodeBM25(query: string) {
  const tokens = nlp.readDoc(query).tokens().out();
  const freqs: Record<number, number> = {};

  tokens.forEach((t: string) => {
    const h = hashToken(t);
    freqs[h] = (freqs[h] || 0) + 1;
  });

  return {
    indices: Object.keys(freqs).map(Number),
    values: Object.values(freqs),
  };
}

function hashToken(token: string): number {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash << 5) - hash + token.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
