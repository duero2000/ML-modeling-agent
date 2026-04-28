// App.jsx
// Root component. Owns all session state and routes between the two top-level
// views: Onboarding (no model selected) and Chat (model selected).
// All state is passed down as props — no context, no global store.

import { useState, useRef } from "react";
import { MODES, STAGES } from "./config.js";
import Onboarding from "./components/Onboarding.jsx";
import TopBar from "./components/TopBar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ChatPanel from "./components/ChatPanel.jsx";

// ─── Initial state factory ────────────────────────────────────────────────────
function buildInitialState() {
  return {
    modelFamily: null,
    currentStage: 0,
    mode: MODES.GUIDED,
    messages: [],
    chips: [],
    sessionStats: {
      messageCount: 0,
      estimatedTokens: 0,
      contextHealthPercent: 0,
    },
    synthesisAvailable: false,
  };
}

export default function App() {
  const [session, setSession] = useState(buildInitialState());

  // Holds the handleSynthesize function registered by ChatPanel once mounted.
  // Passed to Sidebar as onSynthesize so the button can trigger it without
  // Sidebar needing to know anything about the API call logic.
  const synthesizeRef = useRef(null);

  // ── Granular state updaters ─────────────────────────────────────────────────

  function setModelFamily(modelFamily) {
    setSession((prev) => ({ ...prev, modelFamily }));
  }

  function setCurrentStage(currentStage) {
    setSession((prev) => ({ ...prev, currentStage }));
  }

  function setMode(mode) {
    setSession((prev) => ({ ...prev, mode }));
  }

  function setMessages(messages) {
    setSession((prev) => ({ ...prev, messages }));
  }

  function setChips(chips) {
    setSession((prev) => ({ ...prev, chips }));
  }

  function setSessionStats(sessionStats) {
    setSession((prev) => ({ ...prev, sessionStats }));
  }

  function setSynthesisAvailable(synthesisAvailable) {
    setSession((prev) => ({ ...prev, synthesisAvailable }));
  }

  function registerSynthesize(fn) {
    synthesizeRef.current = fn;
  }

  function resetAfterSynthesis(summaryMessage) {
    setSession((prev) => ({
      ...buildInitialState(),
      modelFamily: prev.modelFamily,
      currentStage: prev.currentStage,
      mode: prev.mode,
      synthesisAvailable: true,
      messages: [summaryMessage],
    }));
  }

  // ── View routing ────────────────────────────────────────────────────────────

  if (!session.modelFamily) {
    return (
      <Onboarding
        onStart={setModelFamily}
        setChips={setChips}
      />
    );
  }

  return (
    <div style={styles.root}>
      <TopBar
        stage={STAGES[session.currentStage]}
        modelFamily={session.modelFamily}
        mode={session.mode}
        messages={session.messages}
      />
      <div style={styles.body}>
        <Sidebar
          session={session}
          setCurrentStage={setCurrentStage}
          setMode={setMode}
          setModelFamily={setModelFamily}
          setChips={setChips}
          setSynthesisAvailable={setSynthesisAvailable}
          onSynthesize={() => synthesizeRef.current?.()}
        />
        <ChatPanel
          session={session}
          setMessages={setMessages}
          setChips={setChips}
          setSessionStats={setSessionStats}
          setCurrentStage={setCurrentStage}
          resetAfterSynthesis={resetAfterSynthesis}
          registerSynthesize={registerSynthesize}
        />
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#0d0d0b",
    color: "#e8e5dc",
    fontFamily: "'IBM Plex Sans', sans-serif",
    overflow: "hidden",
  },
  body: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
};