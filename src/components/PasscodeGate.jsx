// src/components/PasscodeGate.jsx
// First screen rendered by App if the user has not authenticated yet.
// Compares the entered passcode against VITE_APP_PASSCODE from the environment.
// Props: onSuccess() — called when the correct passcode is entered

import { useState } from "react";

export default function PasscodeGate({ onSuccess }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  // Compare input against the env variable and either pass through or shake
  function handleSubmit() {
    if (input === import.meta.env.VITE_APP_PASSCODE) {
      onSuccess();
    } else {
      setError(true);
      setInput("");
      // Clear the error state after the shake animation completes
      setTimeout(() => setError(false), 600);
    }
  }

  // Allow Enter key to submit
  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div style={styles.root}>
      <div style={styles.card}>

        {/* App title */}
        <p style={styles.label}>ML Modeling Agent</p>
        <h1 style={styles.title}>Enter Passcode</h1>

        {/* Passcode input */}
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="••••••••"
          style={{
            ...styles.input,
            // Red border on incorrect attempt
            borderColor: error ? "#c0392b" : "#2a2a28",
            animation: error ? "shake 0.5s ease" : "none",
          }}
          autoFocus
        />

        {/* Error message */}
        {error && (
          <p style={styles.errorText}>Incorrect passcode. Try again.</p>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          style={styles.button}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#b8943a")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#c8a96e")}
        >
          Enter
        </button>
      </div>

      {/* Shake keyframe injected as a style tag */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
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
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "48px",
    backgroundColor: "#141412",
    border: "1px solid #2a2a28",
    borderRadius: "12px",
    width: "340px",
  },
  label: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#c8a96e",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 600,
    color: "#e8e5dc",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "#0d0d0b",
    border: "1px solid #2a2a28",
    borderRadius: "6px",
    color: "#e8e5dc",
    fontSize: "16px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  },
  errorText: {
    margin: 0,
    fontSize: "13px",
    color: "#c0392b",
    fontFamily: "'IBM Plex Mono', monospace",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#c8a96e",
    border: "none",
    borderRadius: "6px",
    color: "#0d0d0b",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
};
