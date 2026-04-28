// tokenEstimator.js
// Lightweight token estimation utilities.
// We estimate tokens by dividing character count by 4, which is a reasonable
// approximation for English text. This is used for context health tracking only,
// not for billing or hard limits.

// Estimates token count for a single string
export function estimateTokens(str) {
  if (!str || typeof str !== "string") return 0;
  return Math.round(str.length / 4);
}

// Sums token estimates across the full messages array
// Each message has the shape { role: "user" | "assistant", content: string }
export function estimateSessionTokens(messages) {
  if (!Array.isArray(messages)) return 0;
  return messages.reduce((total, msg) => {
    return total + estimateTokens(msg.content);
  }, 0);
}