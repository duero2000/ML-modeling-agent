import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SYNTHESIS_PROMPT, synthesizeSession } from "../src/utils/synthesizer.js";

describe("synthesizer.js", () => {

  describe("SYNTHESIS_PROMPT", () => {

    it("is a non-empty string", () => {
      expect(typeof SYNTHESIS_PROMPT).toBe("string");
      expect(SYNTHESIS_PROMPT.length).toBeGreaterThan(0);
    });

    it("contains all required section headers", () => {
      expect(SYNTHESIS_PROMPT).toContain("Model Family");
      expect(SYNTHESIS_PROMPT).toContain("Current Stage");
      expect(SYNTHESIS_PROMPT).toContain("Key Decisions Made");
      expect(SYNTHESIS_PROMPT).toContain("Outputs Interpreted");
      expect(SYNTHESIS_PROMPT).toContain("Open Questions");
      expect(SYNTHESIS_PROMPT).toContain("Next Steps");
    });

    it("instructs Claude not to use em dashes", () => {
      expect(SYNTHESIS_PROMPT).toContain("em dashes");
    });

  });

  describe("synthesizeSession", () => {

    beforeEach(() => {
      // Mock the global fetch so we never make a real API call in tests
      vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("returns the summary string on a successful API response", async () => {
      // Simulate a successful Anthropic API response
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            { type: "text", text: "**Model Family:** Binary Logistic Regression" },
            { type: "text", text: "**Current Stage:** Evaluate on Test Data" },
          ],
        }),
      });

      const messages = [{ role: "user", content: "Let's start" }];
      const result = await synthesizeSession(messages);

      expect(result).toContain("Binary Logistic Regression");
      expect(result).toContain("Evaluate on Test Data");
    });

    it("throws an error when the API response is not ok", async () => {
      // Simulate a failed API response
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: "Invalid API key" },
        }),
      });

      const messages = [{ role: "user", content: "Let's start" }];
      await expect(synthesizeSession(messages)).rejects.toThrow("Invalid API key");
    });

    it("calls fetch with the correct endpoint", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ content: [{ type: "text", text: "Summary" }] }),
      });

      await synthesizeSession([{ role: "user", content: "test" }]);

      expect(fetch).toHaveBeenCalledWith(
        "https://api.anthropic.com/v1/messages",
        expect.objectContaining({ method: "POST" })
      );
    });

  });

});
