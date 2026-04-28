// synthesizer.js
// Handles session compression when context health hits amber or the user
// manually triggers synthesis. Fires a separate focused API call and returns
// a structured summary string that replaces the full message history.

import { MODEL, MAX_TOKENS } from "../config.js";

// ─── Synthesis system prompt ──────────────────────────────────────────────────
// This is a focused prompt used only for the synthesis call.
// It instructs Claude to compress the session into a structured summary
// that can serve as opening context for a fresh session.
export const SYNTHESIS_PROMPT = `
You are summarizing a machine learning coaching session. Your output will be used as the opening context for a continued session, so Claude must be able to pick up exactly where things left off.

Produce a structured summary using exactly these sections:

**Model Family:** The model type being worked on.
**Current Stage:** The stage the user was on when synthesis was triggered.
**Key Decisions Made:** A bulleted list of modeling choices that were confirmed (e.g. chosen lambda, selected features, threshold decision).
**Outputs Interpreted:** A bulleted list of specific outputs that were discussed and what they meant (e.g. AUC of 0.82 on training, Cook's D flagged observation 47).
**Open Questions:** Any questions raised but not yet resolved.
**Next Steps:** What the user should do when the session continues.

Be specific. Use actual numbers and variable names from the conversation where available. Do not use em dashes. Keep the total summary under 400 tokens.
`.trim();

// ─── synthesizeSession ────────────────────────────────────────────────────────
// Takes the full messages array and fires the synthesis API call.
// Returns the formatted summary string on success.
// Throws an error on failure so the caller can handle it gracefully.
export async function synthesizeSession(messages) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      // Required header for direct browser API calls
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS.synthesis,
      system: SYNTHESIS_PROMPT,
      // Pass the full session history so Claude has complete context
      messages: messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.error?.message || "Synthesis API call failed");
  }

  const data = await response.json();

  // Extract the text content from the response
  const summary = data.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return summary;
}