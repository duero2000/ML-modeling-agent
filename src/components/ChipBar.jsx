// ChipBar.jsx
// Renders 4 quick-reply chip buttons below the latest agent message.
// Chips disable and dim while a response is loading.
// No internal state. Calls onChipClick(chipText) on tap.

export default function ChipBar({ chips, onChipClick, isLoading }) {
  if (!chips || chips.length === 0) return null;

  return (
    <div style={styles.row}>
      {chips.map((chip, i) => (
        <ChipButton
          key={i}
          text={chip}
          disabled={isLoading}
          onClick={() => onChipClick(chip)}
        />
      ))}
    </div>
  );
}

// ─── Individual chip button ───────────────────────────────────────────────────

function ChipButton({ text, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.chip,
        opacity: disabled ? 0.35 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(200,169,110,0.45)";
          e.currentTarget.style.color = "#c8a96e";
          e.currentTarget.style.backgroundColor = "rgba(200,169,110,0.06)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "#8a8880";
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {text}
    </button>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    paddingTop: 8,
    paddingLeft: 2,
    maxWidth: "78%",
  },
  chip: {
    padding: "5px 11px",
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.1)",
    backgroundColor: "transparent",
    color: "#8a8880",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 12,
    lineHeight: 1.4,
    textAlign: "left",
    transition: "border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease",
  },
};