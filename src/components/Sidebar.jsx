// Sidebar.jsx
// Left panel of the chat view. Purely presentational with prop-driven state.
// Owns no internal state. All navigation calls pass upward to App via setters.
//
// Sections (top to bottom):
//   1. Stage tracker — 7 clickable rows, completion indicators
//   2. Mode toggle   — Guided vs Q&A
//   3. Model switcher — select from MODEL_FAMILIES
//   4. UsageBubble  — session stats display
//   5. Synthesize button — muted at green health, gold pulse at amber+

import { STAGES, MODEL_FAMILIES, MODES } from "../config.js";
import UsageBubble from "./UsageBubble.jsx";

export default function Sidebar({
  session,
  setCurrentStage,
  setMode,
  setModelFamily,
  setChips,
  setSynthesisAvailable,
  onSynthesize,
}) {
  const { currentStage, mode, modelFamily, sessionStats, synthesisAvailable } =
    session;
  const { contextHealthPercent } = sessionStats;

  // ── Health-derived button state ─────────────────────────────────────────────
  const isAmber = contextHealthPercent >= 60 && contextHealthPercent < 85;
  const isRed   = contextHealthPercent >= 85;
  const synthesizeActive = isAmber || isRed;

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleStageClick(index) {
    setCurrentStage(index);
    // Chip regeneration is handled by ChatPanel's useEffect watching currentStage
  }

  function handleModeToggle(newMode) {
    if (newMode === mode) return;
    setMode(newMode);
    // Chip regeneration is handled by ChatPanel's useEffect watching mode
  }

  function handleFamilyChange(e) {
    setModelFamily(e.target.value);
  }

  return (
    <>
      {/* Pulse keyframe injected inline — no CSS files */}
      <style>{`
        @keyframes sidebarPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(200, 169, 110, 0); }
          50%       { box-shadow: 0 0 0 5px rgba(200, 169, 110, 0.18); }
        }
      `}</style>

      <div style={styles.container}>

        {/* ── 1. Stage tracker ──────────────────────────────────────────────── */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Stages</div>
          {STAGES.map((stage, i) => {
            const isActive    = i === currentStage;
            const isComplete  = i < currentStage;
            const rowColor    = isActive
              ? "#c8a96e"
              : isComplete
              ? "#4caf7d"
              : "#54524e";

            return (
              <div
                key={i}
                onClick={() => handleStageClick(i)}
                style={{
                  ...styles.stageRow,
                  borderLeft: `2px solid ${isActive ? "#c8a96e" : "transparent"}`,
                  backgroundColor: isActive
                    ? "rgba(200,169,110,0.07)"
                    : "transparent",
                  color: rowColor,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {/* Completion dot */}
                <div
                  style={{
                    ...styles.dot,
                    backgroundColor: isComplete
                      ? "#4caf7d"
                      : isActive
                      ? "#c8a96e"
                      : "transparent",
                    border: `1px solid ${
                      isComplete ? "#4caf7d" : isActive ? "#c8a96e" : "#3a3a36"
                    }`,
                  }}
                />
                <span style={{ fontSize: 11, lineHeight: 1.3 }}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── 2. Mode toggle ────────────────────────────────────────────────── */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Mode</div>
          <div style={styles.modeRow}>
            {[MODES.GUIDED, MODES.QA].map((m) => {
              const isSelected = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => handleModeToggle(m)}
                  style={{
                    ...styles.modeBtn,
                    backgroundColor: isSelected
                      ? "rgba(200,169,110,0.12)"
                      : "transparent",
                    color: isSelected ? "#c8a96e" : "#54524e",
                    border: `1px solid ${
                      isSelected ? "rgba(200,169,110,0.35)" : "rgba(255,255,255,0.07)"
                    }`,
                  }}
                >
                  {m === MODES.GUIDED ? "Guided" : "Q&A"}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 3. Model family switcher ──────────────────────────────────────── */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Model Family</div>
          <select
            value={modelFamily}
            onChange={handleFamilyChange}
            style={styles.select}
          >
            {MODEL_FAMILIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* ── 4. UsageBubble ────────────────────────────────────────────────── */}
        <div style={styles.section}>
          <UsageBubble sessionStats={sessionStats} />
        </div>

        {/* ── 5. Synthesize button ──────────────────────────────────────────── */}
        <div style={{ ...styles.section, marginTop: "auto" }}>
          <button
            onClick={onSynthesize}
            disabled={!synthesizeActive}
            style={{
              ...styles.synthesizeBtn,
              backgroundColor: synthesizeActive
                ? "rgba(200,169,110,0.12)"
                : "rgba(255,255,255,0.03)",
              color: synthesizeActive ? "#c8a96e" : "#3a3a36",
              border: `1px solid ${
                synthesizeActive
                  ? "rgba(200,169,110,0.35)"
                  : "rgba(255,255,255,0.05)"
              }`,
              cursor: synthesizeActive ? "pointer" : "default",
              animation: isAmber ? "sidebarPulse 2.4s ease-in-out infinite" : "none",
            }}
          >
            Synthesize &amp; Continue
          </button>
          {synthesisAvailable && (
            <div style={styles.synthesisNote}>
              Session was previously synthesized
            </div>
          )}
        </div>

      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  container: {
    width: 200,
    flexShrink: 0,
    borderRight: "1px solid rgba(255,255,255,0.07)",
    backgroundColor: "#111110",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: "16px 0 12px",
    gap: 4,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    padding: "0 12px 14px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  sectionLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#3a3a36",
    marginBottom: 6,
  },
  stageRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 8px",
    borderRadius: 4,
    cursor: "pointer",
    transition: "background-color 0.15s ease, color 0.15s ease",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    flexShrink: 0,
    transition: "background-color 0.2s ease",
  },
  modeRow: {
    display: "flex",
    gap: 6,
  },
  modeBtn: {
    flex: 1,
    padding: "5px 0",
    borderRadius: 4,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  select: {
    width: "100%",
    padding: "6px 8px",
    backgroundColor: "#1a1a17",
    color: "#e8e5dc",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 11,
    cursor: "pointer",
    outline: "none",
  },
  synthesizeBtn: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 5,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.06em",
    textAlign: "center",
    transition: "all 0.3s ease",
  },
  synthesisNote: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    color: "#3a3a36",
    letterSpacing: "0.05em",
    textAlign: "center",
    marginTop: 4,
  },
};