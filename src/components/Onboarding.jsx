// src/components/Onboarding.jsx
// Model family selection screen. Shown on first load before any session begins.
// Owns one piece of internal state: the currently selected model family object.
// Props: onStart(modelFamily) — called after chip generation completes
//        setChips(chips)      — loads the first chip set into App state

import { useState } from "react";
import { MODEL_FAMILIES } from "../config.js";

export default function Onboarding({ onStart, setChips }) {
  // selectedFamily holds the full family object or null
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fires the chip generation API call for the selected model family,
  // then transitions to the chat view with the first chip set loaded
  async function handleStart() {
    if (!selectedFamily || loading) return;
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 300,
          system: `You generate quick-reply chips for an ML coaching app.
The user has just selected a model family and is about to begin Stage 0: Frame the Problem.
Return exactly 4 short chips as a JSON array of strings.
Each chip should be a question or prompt a learner would naturally ask at the start of framing a modeling problem for the selected model family.
Chips should be concise, 6 words or fewer.
Return only the JSON array, no explanation, no markdown, no backticks.
Example format: ["What is the target variable?","When do I use this model?","What data do I need?","How do I frame the outcome?"]`,
          messages: [
            {
              role: "user",
              content: `Model family: ${selectedFamily.label}. Generate 4 stage 0 chips.`,
            },
          ],
        }),
      });

      const data = await response.json();

      // Extract the text content from the response
      const text = data.content?.[0]?.text ?? "[]";

      // Parse the JSON array, fall back to empty array if malformed
      let chips = [];
      try {
        chips = JSON.parse(text);
      } catch {
        chips = [];
      }

      // Load chips into App state, then transition to chat view
      setChips(chips);
      onStart(selectedFamily.id);

    } catch (err) {
      // Network or API failure — still transition so the session is not blocked
      console.error("Chip generation failed:", err);
      setChips([]);
      onStart(selectedFamily.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.inner}>

        {/* Header */}
        <p style={styles.eyebrow}>ML Modeling Agent</p>
        <h1 style={styles.heading}>Choose a model family</h1>
        <p style={styles.subheading}>
          Your selection primes the coaching context for all seven stages.
        </p>

        {/* 2x4 card grid */}
        <div style={styles.grid}>
          {MODEL_FAMILIES.map((family) => {
            const isSelected = selectedFamily?.id === family.id;
            return (
              <button
                key={family.id}
                onClick={() => setSelectedFamily(family)}
                style={{
                  ...styles.card,
                  borderColor: isSelected ? "#c8a96e" : "rgba(232,229,220,0.08)",
                  background: isSelected
                    ? "rgba(200,169,110,0.07)"
                    : "rgba(232,229,220,0.03)",
                  boxShadow: isSelected
                    ? "0 0 0 1px #c8a96e"
                    : "none",
                }}
              >
                {/* Color swatch — the family's accent color as a small top bar */}
                <div
                  style={{
                    ...styles.swatch,
                    backgroundColor: family.color,
                  }}
                />
                <span style={styles.cardLabel}>{family.label}</span>
                <span style={styles.cardDesc}>{family.description}</span>
              </button>
            );
          })}
        </div>

        {/* Confirm button — gold when ready, muted when no selection */}
        <button
          onClick={handleStart}
          disabled={!selectedFamily || loading}
          style={{
            ...styles.startBtn,
            background: selectedFamily && !loading ? "#c8a96e" : "rgba(200,169,110,0.15)",
            color: selectedFamily && !loading ? "#0d0d0b" : "rgba(200,169,110,0.4)",
            cursor: selectedFamily && !loading ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Starting..." : "Start Session"}
        </button>

      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0d0d0b",
    color: "#e8e5dc",
    fontFamily: "'IBM Plex Sans', sans-serif",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  inner: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "720px",
    gap: "16px",
  },
  eyebrow: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#c8a96e",
    margin: 0,
  },
  heading: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#e8e5dc",
    margin: 0,
    textAlign: "center",
  },
  subheading: {
    fontSize: "14px",
    color: "rgba(232,229,220,0.5)",
    margin: 0,
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "12px",
    width: "100%",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
    padding: "16px",
    border: "1px solid",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
    transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
  },
  swatch: {
    width: "100%",
    height: "3px",
    borderRadius: "2px",
    marginBottom: "4px",
  },
  cardLabel: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: "13px",
    fontWeight: 600,
    color: "#e8e5dc",
    lineHeight: 1.3,
  },
  cardDesc: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: "10px",
    color: "rgba(232,229,220,0.4)",
    lineHeight: 1.5,
  },
  startBtn: {
    marginTop: "8px",
    padding: "12px 40px",
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "'IBM Plex Sans', sans-serif",
    border: "none",
    borderRadius: "6px",
    transition: "background 0.2s, color 0.2s",
    letterSpacing: "0.02em",
  },
};