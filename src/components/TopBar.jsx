// TopBar.jsx
// Thin bar across the top of the chat view.
// Renders the active stage label, model family badge, and mode indicator.
// Houses the download summary icon — clicking it compiles the full message
// history into a markdown file and triggers a browser download.
// No internal state. Props in, render out.

import { MODEL_FAMILIES } from "../config.js";

export default function TopBar({ stage, modelFamily, mode, messages }) {
  const familyLabel =
    MODEL_FAMILIES.find((f) => f.id === modelFamily)?.label ?? modelFamily ?? "";

  // ── Download summary ────────────────────────────────────────────────────────
  function downloadSummary() {
    if (!messages || messages.length === 0) return;

    const date = new Date().toISOString().slice(0, 10);

    const roleLabel = (role) => {
      if (role === "user")      return "**You**";
      if (role === "agent")     return "**Agent**";
      if (role === "synthesis") return "**Session Summary**";
      return "**Unknown**";
    };

    const body = messages
      .map((m) => `${roleLabel(m.role)}\n\n${m.content}`)
      .join("\n\n---\n\n");

    const markdown = [
      `# ML Modeling Coach — Session Summary`,
      `Model Family: ${familyLabel}`,
      `Date: ${date}`,
      ``,
      `---`,
      ``,
      body,
    ].join("\n");

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url  = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href     = url;
    anchor.download = `ml-coach-session-${date}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={styles.bar}>

      {/* Left — stage index and label */}
      <div style={styles.left}>
        <span style={styles.stageIndex}>
          {stage ? `${(stage.id ?? 0) + 1} / 7` : ""}
        </span>
        <span style={styles.stageLabel}>
          {stage?.label ?? ""}
        </span>
      </div>

      {/* Center — model family badge */}
      <div style={styles.center}>
        <span style={styles.familyBadge}>
          {familyLabel}
        </span>
      </div>

      {/* Right — mode badge and download icon */}
      <div style={styles.right}>
        <span style={styles.modeBadge}>
          {mode?.toUpperCase() ?? ""}
        </span>
        <button
          onClick={downloadSummary}
          disabled={!messages || messages.length === 0}
          title="Download session summary"
          style={{
            ...styles.downloadBtn,
            opacity: messages && messages.length > 0 ? 1 : 0.3,
            cursor: messages && messages.length > 0 ? "pointer" : "default",
          }}
        >
          {/* Download icon — inline SVG, no external dependency */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1v7M4 5.5l3 3 3-3M2 10.5v1a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-1"
              stroke="#54524e"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 44,
    padding: "0 20px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    backgroundColor: "#111110",
    flexShrink: 0,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  stageIndex: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: "#3a3a36",
    letterSpacing: "0.08em",
  },
  stageLabel: {
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12,
    color: "#8a8880",
    letterSpacing: "0.02em",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    flex: 1,
  },
  familyBadge: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    color: "#c8a96e",
    letterSpacing: "0.06em",
    padding: "3px 10px",
    border: "1px solid rgba(200,169,110,0.25)",
    borderRadius: 20,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
  },
  modeBadge: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    color: "#54524e",
    letterSpacing: "0.1em",
    padding: "3px 8px",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
  },
  downloadBtn: {
    background: "none",
    border: "none",
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s ease",
  },
};