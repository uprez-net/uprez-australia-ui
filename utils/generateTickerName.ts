export function generateTicker(companyName: string): string {
  if (!companyName || typeof companyName !== "string") {
    throw new Error("companyName must be a valid string");
  }

  // Remove special characters & normalize spaces
  const cleaned = companyName
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  // Common legal/noise words to ignore
  const stopWords = new Set([
    "PVT",
    "PRIVATE",
    "LIMITED",
    "LTD",
    "LLP",
    "INC",
    "CORP",
    "CORPORATION",
    "TECHNOLOGIES",
    "TECH",
    "SOLUTIONS",
    "SYSTEMS",
    "INDIA",
    "INDUSTRIES",
    "GROUP",
    "GLOBAL",
  ]);

  const words = cleaned
    .split(" ")
    .filter((word) => !stopWords.has(word));

  let ticker = "";

  if (words.length >= 3) {
    // Take first letter of first 3 meaningful words
    ticker = words.slice(0, 3).map(w => w[0]).join("");
  } else if (words.length === 2) {
    // First 2 letters of first word + first letter of second
    ticker = words[0].slice(0, 2) + words[1][0];
  } else if (words.length === 1) {
    // First 3 letters of the only word
    ticker = words[0].slice(0, 3);
  } else {
    // Fallback safety
    ticker = "CMP";
  }

  return ticker.toUpperCase();
}