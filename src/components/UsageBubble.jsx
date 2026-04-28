// UsageBubble.jsx
// Session usage display. Purely presentational — no internal state.
// Receives sessionStats as a prop and renders three data points:
//   1. Message count
//   2. Estimated token count
//   3. Context health bar with numeric percentage
//
// Health color thresholds (match config.js definitions):
//   Green  — below 60%
//   Amber  — 60% to 85%
//   Red    — above 85%

export default function UsageBubble({ sessionStats }) {
  const { messageCount, estimatedTokens, contextHealthPercent } = sessionStats;

  // ── Health color ────────────────────────────────────────────────────────────
  const healthColor =
    contextHealthPercent >= 85
      ? "#e05252"   // red
      : contextHealthPercent >= 60
      ? "#c8943a"   // amber
      : "#4caf7d";  // green

  // ── Token display ───────────────────────────────────────────────────────────
  // Format with comma separator for readability at higher counts
  const formattedTokens = estimatedTokens.toLocaleString();

  // Clamp the fill width to 100 so the bar never overflows its track
  const fillWidth = Math.min(contextHealthPercent, 100);

  return (
    <div style={styles.container}>

      {/* Row 1 — Messages */}
      <div style={styles.row}>
        <span style={styles.label}>Messages</span>
        <span style={styles.value}>{messageCount}</span>
      </div>

      {/* Row 2 — Tokens */}
      <div style={styles.row}>
        <span style={styles.label}>Est. Tokens</span>
        <span style={styles.value}>{formattedTokens}</span>
      </div>

      {/* Row 3 — Context health */}
      <div style={styles.healthBlock}>
        <div style={styles.healthHeader}>
          <span style={styles.label}>Context</span>
          <span style={{ ...styles.value, color: healthColor }}>
            {contextHealthPercent}%
          </span>
        </div>
        {/* Track */}
        <div style={styles.track}>
          {/* Fill */}
          <div
            style={{
              ...styles.fill,
              width: `${fillWidth}%`,
              backgroundColor: healthColor,
            }}
          />
        </div>
      </div>

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "14px 16px",
    backgroundColor: "#111110",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  healthBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  healthHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.07em",
    color: "#6a6a64",
    textTransform: "uppercase",
  },
  value: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13,
    color: "#e8e5dc",
  },
  track: {
    width: "100%",
    height: 5,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.4s ease, background-color 0.4s ease",
  },
};