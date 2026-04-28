import { describe, it, expect } from "vitest";
import { estimateTokens, estimateSessionTokens } from "../src/utils/tokenEstimator.js";

describe("tokenEstimator.js", () => {

  describe("estimateTokens", () => {

    it("returns 0 for an empty string", () => {
      expect(estimateTokens("")).toBe(0);
    });

    it("returns 0 for null or undefined", () => {
      expect(estimateTokens(null)).toBe(0);
      expect(estimateTokens(undefined)).toBe(0);
    });

    it("returns 0 for a non-string input", () => {
      expect(estimateTokens(123)).toBe(0);
    });

    it("divides character length by 4 and rounds", () => {
      // 8 chars / 4 = 2
      expect(estimateTokens("abcdefgh")).toBe(2);
      // 10 chars / 4 = 2.5 -> rounds to 3
      expect(estimateTokens("abcdefghij")).toBe(3);
    });

    it("handles a realistic message string", () => {
      const msg = "How do I interpret an odds ratio below 1?";
      const expected = Math.round(msg.length / 4);
      expect(estimateTokens(msg)).toBe(expected);
    });

  });

  describe("estimateSessionTokens", () => {

    it("returns 0 for an empty array", () => {
      expect(estimateSessionTokens([])).toBe(0);
    });

    it("returns 0 for a non-array input", () => {
      expect(estimateSessionTokens(null)).toBe(0);
      expect(estimateSessionTokens(undefined)).toBe(0);
    });

    it("sums token estimates across all messages", () => {
      const messages = [
        { role: "user", content: "abcdefgh" },      // 8 chars = 2 tokens
        { role: "assistant", content: "abcdefgh" },  // 8 chars = 2 tokens
      ];
      expect(estimateSessionTokens(messages)).toBe(4);
    });

    it("handles messages with varying content lengths", () => {
      const messages = [
        { role: "user", content: "Hi" },
        { role: "assistant", content: "Hello, how can I help you today?" },
      ];
      const expected =
        Math.round("Hi".length / 4) +
        Math.round("Hello, how can I help you today?".length / 4);
      expect(estimateSessionTokens(messages)).toBe(expected);
    });

  });

});
