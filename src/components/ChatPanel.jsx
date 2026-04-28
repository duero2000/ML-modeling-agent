// ChatPanel.jsx
// Main chat area. The most complex component in the app.
//
// Owns:
//   - input field state
//   - isLoading and isSynthesizing flags
//   - send() — builds user message, calls API, appends agent response
//   - callAPI() — direct fetch to Anthropic /v1/messages
//   - handleSynthesize() — registered with App via registerSynthesize()
//   - useEffect for chip regeneration on stage or mode change
//   - useEffect for auto-scroll on new messages
//
// Composes: MessageBubble, ChipBar

import { useState, useEffect, useRef } from "react";
import { MODEL, MAX_TOKENS, CONTEXT_WINDOW } from "../config.js";
import { SYSTEM_PROMPT } from "../systemPrompt.js";
import { estimateSessionTokens } from "../utils/tokenEstimator.js";
import { synthesizeSession } from "../utils/synthesizer.js";
import MessageBubble from "./MessageBubble.jsx";
import ChipBar from "./ChipBar.jsx";

export default function ChatPanel({
  session,
  setMessages,
  setChips,
  setSessionStats,
  setCurrentStage,
  resetAfterSynthesis,
  registerSynthesize,
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const bottomRef = useRef(null);
  const isFirstRender = useRef(true);

  const { messages, chips, currentStage, mode, modelFamily, sessionStats } =
    session;

  // ── Register handleSynthesize with App on mount ─────────────────────────────
  useEffect(() => {
    registerSynthesize(handleSynthesize);
  }, []);

  // ── Auto-scroll to bottom on new messages ───────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Chip regeneration on stage or mode change ───────────────────────────────
  // Skips the initial mount since Onboarding already fired the first chip call.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    regenerateChips();
  }, [currentStage, mode]);

  // ── API call (streaming) ──────────────────────────────────────────────────────────
  // Sends the request with stream: true and reads Server-Sent Events line by
  // line. Calls onChunk(text) with each incremental delta so the UI updates
  // in real time. Returns the full completed string when the stream closes.
  async function callAPI(history, onChunk) {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS.main,
        stream: true,
        system: SYSTEM_PROMPT,
        // Remap internal "agent" role to "assistant" for the Anthropic API
        // and filter out synthesis banner messages which are not valid API turns
        messages: history
          .filter((m) => m.role === "user" || m.role === "agent")
          .map((m) => ({
            role: m.role === "agent" ? "assistant" : "user",
            content: m.content,
          })),
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    // Read the response body as a stream of SSE lines
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Decode the incoming chunk and append to buffer
      buffer += decoder.decode(value, { stream: true });

      // Split on newlines and process each complete SSE line
      const lines = buffer.split("\n");

      // Keep the last incomplete line in the buffer for the next iteration
      buffer = lines.pop();

      for (const line of lines) {
        // SSE data lines start with "data: "
        if (!line.startsWith("data: ")) continue;

        const json = line.slice(6).trim();

        // Stream end sentinel
        if (json === "[DONE]") break;

        try {
          const event = JSON.parse(json);

          // Only content_block_delta events carry text tokens
          if (
            event.type === "content_block_delta" &&
            event.delta?.type === "text_delta"
          ) {
            const chunk = event.delta.text;
            fullText += chunk;
            onChunk(fullText);
          }
        } catch {
          // Malformed SSE line, skip silently
        }
      }
    }

    return fullText;
  }

  // ── Chip regeneration call ──────────────────────────────────────────────────
  async function regenerateChips() {
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
          model: MODEL,
          max_tokens: MAX_TOKENS.chips,
          system: `You generate exactly 4 short chip suggestions for a machine learning coaching app.
The user is studying ${modelFamily} at stage ${currentStage + 1} of 7 in ${mode} mode.
Return only a JSON array of 4 strings. No preamble, no markdown, no explanation.
Each string must be under 8 words and phrased as a question or prompt the user would send.
Example: ["What is the default split criterion?","How do I tune max depth?","Show me the confusion matrix","What does the Gini index measure?"]`,
          messages: [
            { role: "user", content: "Generate chips." },
          ],
        }),
      });

      const data = await response.json();
      const raw = data.content[0].text.trim();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setChips(parsed.slice(0, 4));
      }
    } catch (err) {
      console.error("Chip regeneration failed:", err);
    }
  }

  // ── send() ──────────────────────────────────────────────────────────────────
  async function send(text) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isLoading) return;

    setInput("");
    setIsLoading(true);

    const userMessage = { role: "user", content: trimmed };
    const updatedHistory = [...messages, userMessage];

    // Add the user message and an empty agent placeholder immediately.
    // The placeholder is updated in real time as streaming chunks arrive.
    setMessages([...updatedHistory, { role: "agent", content: "" }]);

    try {
      // onChunk fires on every token and updates the agent message in place
      const agentText = await callAPI(updatedHistory, (partialText) => {
        setMessages([
          ...updatedHistory,
          { role: "agent", content: partialText },
        ]);
      });

      // Final update with the complete text and stats
      const finalHistory = [...updatedHistory, { role: "agent", content: agentText }];
      setMessages(finalHistory);
      updateStats(finalHistory);
    } catch (err) {
      console.error("API call failed:", err);
      setMessages([
        ...updatedHistory,
        { role: "agent", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // ── Session stats update ────────────────────────────────────────────────────
  function updateStats(history) {
    const estimatedTokens = estimateSessionTokens(history);
    const contextHealthPercent = Math.round(
      (estimatedTokens / CONTEXT_WINDOW) * 100
    );
    setSessionStats({
      messageCount: history.filter((m) => m.role === "user").length,
      estimatedTokens,
      contextHealthPercent: Math.min(contextHealthPercent, 100),
    });
  }

  // ── handleSynthesize ────────────────────────────────────────────────────────
  async function handleSynthesize() {
    if (isSynthesizing || messages.length === 0) return;
    setIsSynthesizing(true);

    try {
      const summary = await synthesizeSession(messages);
      const summaryMessage = { role: "synthesis", content: summary };
      resetAfterSynthesis(summaryMessage);
    } catch (err) {
      console.error("Synthesis failed:", err);
    } finally {
      setIsSynthesizing(false);
    }
  }

  // ── Keyboard handler ────────────────────────────────────────────────────────
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // ── Determine where to render ChipBar ──────────────────────────────────────
  // Chips appear after the last agent message in the list.
  const lastAgentIndex = messages
    .map((m, i) => (m.role === "agent" ? i : -1))
    .filter((i) => i !== -1)
    .at(-1);

  return (
    <div style={styles.container}>

      {/* ── Message list ──────────────────────────────────────────────────── */}
      <div style={styles.messageList}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            Start by asking a question or selecting a chip below.
          </div>
        )}

        {messages.map((message, i) => (
          <div key={i}>
            <MessageBubble role={message.role} content={message.content} />
            {i === lastAgentIndex && chips.length > 0 && (
              <ChipBar
                chips={chips}
                onChipClick={send}
                isLoading={isLoading}
              />
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div style={styles.loadingRow}>
            <TypingDots />
          </div>
        )}

        {/* Synthesis loading indicator */}
        {isSynthesizing && (
          <div style={styles.loadingRow}>
            <div style={styles.synthesizingLabel}>Synthesizing session...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input row ─────────────────────────────────────────────────────── */}
      <div style={styles.inputRow}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or paste model output..."
          disabled={isLoading || isSynthesizing}
          rows={1}
          style={{
            ...styles.textarea,
            opacity: isLoading || isSynthesizing ? 0.5 : 1,
          }}
        />
        <button
          onClick={() => send()}
          disabled={isLoading || isSynthesizing || !input.trim()}
          style={{
            ...styles.sendBtn,
            opacity: isLoading || isSynthesizing || !input.trim() ? 0.35 : 1,
            cursor:
              isLoading || isSynthesizing || !input.trim()
                ? "default"
                : "pointer",
          }}
        >
          Send
        </button>
      </div>

    </div>
  );
}

// ─── Typing dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <>
      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.3; }
          40%            { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
      <div style={typingStyles.container}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              ...typingStyles.dot,
              animation: `dotBounce 1.2s ${i * 0.2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
    backgroundColor: "#0d0d0b",
  },
  messageList: {
    flex: 1,
    overflowY: "auto",
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  emptyState: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: "#3a3a36",
    letterSpacing: "0.05em",
    textAlign: "center",
    marginTop: 48,
  },
  loadingRow: {
    display: "flex",
    alignItems: "flex-start",
    paddingLeft: 2,
  },
  synthesizingLabel: {
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    color: "#c8a96e",
    letterSpacing: "0.06em",
    opacity: 0.7,
  },
  inputRow: {
    display: "flex",
    gap: 10,
    padding: "14px 20px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    backgroundColor: "#111110",
    alignItems: "flex-end",
  },
  textarea: {
    flex: 1,
    backgroundColor: "#1a1a17",
    color: "#e8e5dc",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 6,
    padding: "10px 14px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 13.5,
    lineHeight: 1.5,
    resize: "none",
    outline: "none",
    transition: "opacity 0.2s ease",
  },
  sendBtn: {
    padding: "10px 20px",
    backgroundColor: "rgba(200,169,110,0.15)",
    color: "#c8a96e",
    border: "1px solid rgba(200,169,110,0.35)",
    borderRadius: 6,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.06em",
    transition: "opacity 0.2s ease",
    flexShrink: 0,
  },
};

const typingStyles = {
  container: {
    display: "flex",
    gap: 5,
    padding: "12px 14px",
    backgroundColor: "#1c1c19",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 10,
    borderTopLeftRadius: 2,
    width: 52,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: "#54524e",
  },
};