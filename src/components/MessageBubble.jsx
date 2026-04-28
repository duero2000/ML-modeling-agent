// MessageBubble.jsx
// Renders a single message in one of three variants:
//   "user"      — right-aligned plain text bubble
//   "agent"     — left-aligned bubble with bold and formula formatting
//   "synthesis" — full-width summary banner, no bubble shape
//
// No internal state. No dangerouslySetInnerHTML.
// Bold markers (**text**) and FORMULA: lines are parsed into React elements.

export default function MessageBubble({ role, content }) {
  if (role === "synthesis") {
    return <SynthesisBanner content={content} />;
  }

  const isAgent = role === "agent";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isAgent ? "flex-start" : "flex-end",
        gap: 4,
        maxWidth: "100%",
      }}
    >
      {/* Role label */}
      <div style={styles.roleLabel}>
        {isAgent ? "AGENT" : "YOU"}
      </div>

      {/* Bubble */}
      <div
        style={{
          ...styles.bubble,
          backgroundColor: isAgent ? "#1c1c19" : "#242420",
          border: `1px solid ${
            isAgent ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.11)"
          }`,
          borderTopLeftRadius: isAgent ? 2 : 10,
          borderTopRightRadius: isAgent ? 10 : 2,
          maxWidth: "78%",
        }}
      >
        {isAgent ? (
          <AgentContent content={content} />
        ) : (
          <span style={styles.plainText}>{content}</span>
        )}
      </div>
    </div>
  );
}

// ─── Agent content renderer ───────────────────────────────────────────────────
// Splits on newlines, renders each line as either a formula block or an
// inline-formatted prose line. Empty lines become small vertical spacers.

function AgentContent({ content }) {
  const lines = content.split("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {lines.map((line, i) => {
        if (line.startsWith("FORMULA:")) {
          const formula = line.slice("FORMULA:".length).trim();
          return <FormulaBlock key={i} text={formula} />;
        }

        if (line.trim() === "") {
          return <div key={i} style={{ height: 6 }} />;
        }

        return (
          <p key={i} style={styles.proseLine}>
            <InlineBold text={line} />
          </p>
        );
      })}
    </div>
  );
}

// ─── Inline bold parser ───────────────────────────────────────────────────────
// Splits a string on **markers** and alternates between plain and bold spans.
// Returns an array of React elements — no HTML injection.

function InlineBold({ text }) {
  const parts = text.split(/\*\*(.*?)\*\*/g);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} style={styles.bold}>
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ─── Formula block ────────────────────────────────────────────────────────────

function FormulaBlock({ text }) {
  return (
    <div style={styles.formulaBlock}>
      <span style={styles.formulaPrefix}>FORMULA</span>
      <code style={styles.formulaText}>{text}</code>
    </div>
  );
}

// ─── Synthesis banner ─────────────────────────────────────────────────────────

function SynthesisBanner({ content }) {
  return (
    <div style={styles.synthesisBanner}>
      <div style={styles.synthesisLabel}>
        Session continued from previous context
      </div>
      <div style={styles.synthesisContent}>
        <AgentContent content={content} />
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  roleLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.06em",
    color: "#54524e",
  },
  bubble: {
    padding: "11px 15px",
    borderRadius: 10,
    fontSize: 13.5,
    lineHeight: 1.6,
    color: "#e8e5dc",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  plainText: {
    fontSize: 13.5,
    lineHeight: 1.6,
    color: "#e8e5dc",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  proseLine: {
    margin: 0,
    padding: 0,
    fontSize: 13.5,
    lineHeight: 1.6,
    color: "#e8e5dc",
  },
  bold: {
    color: "#c8a96e",
    fontWeight: 500,
  },
  formulaBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    backgroundColor: "#0d0d0b",
    border: "1px solid rgba(255,255,255,0.08)",
    borderLeft: "3px solid #7aa8cc",
    borderRadius: 4,
    padding: "8px 12px",
    margin: "4px 0",
  },
  formulaPrefix: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.1em",
    color: "#7aa8cc",
    textTransform: "uppercase",
  },
  formulaText: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
    color: "#7aa8cc",
    whiteSpace: "pre-wrap",
  },
  synthesisBanner: {
    width: "100%",
    backgroundColor: "#141412",
    border: "1px solid rgba(200,169,110,0.15)",
    borderLeft: "3px solid rgba(200,169,110,0.4)",
    borderRadius: 6,
    padding: "12px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  synthesisLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 9,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#c8a96e",
    opacity: 0.7,
  },
  synthesisContent: {
    fontSize: 13,
    lineHeight: 1.6,
    color: "#a8a59e",
  },
};