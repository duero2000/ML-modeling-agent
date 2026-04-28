import { describe, it, expect } from "vitest";
import {
  MODEL,
  MAX_TOKENS,
  CONTEXT_WINDOW,
  HEALTH_THRESHOLDS,
  CHIP_TRIGGERS,
  MODES,
  STAGES,
  MODEL_FAMILIES,
} from "../src/config.js";

describe("config.js", () => {

  it("exports the correct model string", () => {
    expect(MODEL).toBe("claude-sonnet-4-6");
  });

  it("exports MAX_TOKENS with correct values", () => {
    expect(MAX_TOKENS.main).toBe(1000);
    expect(MAX_TOKENS.chips).toBe(300);
    expect(MAX_TOKENS.synthesis).toBe(400);
  });

  it("exports a numeric CONTEXT_WINDOW", () => {
    expect(typeof CONTEXT_WINDOW).toBe("number");
    expect(CONTEXT_WINDOW).toBeGreaterThan(0);
  });

  it("exports HEALTH_THRESHOLDS with AMBER below RED", () => {
    expect(HEALTH_THRESHOLDS.AMBER).toBeLessThan(HEALTH_THRESHOLDS.RED);
    expect(HEALTH_THRESHOLDS.AMBER).toBe(0.60);
    expect(HEALTH_THRESHOLDS.RED).toBe(0.85);
  });

  it("exports all three CHIP_TRIGGERS", () => {
    expect(CHIP_TRIGGERS.MODEL_SELECTED).toBeDefined();
    expect(CHIP_TRIGGERS.STAGE_CHANGED).toBeDefined();
    expect(CHIP_TRIGGERS.MODE_CHANGED).toBeDefined();
  });

  it("exports both MODES", () => {
    expect(MODES.GUIDED).toBe("guided");
    expect(MODES.QA).toBe("qa");
  });

  it("exports exactly 7 stages", () => {
    expect(STAGES).toHaveLength(7);
  });

  it("each stage has an id, label, and shortName", () => {
    STAGES.forEach((stage) => {
      expect(stage).toHaveProperty("id");
      expect(stage).toHaveProperty("label");
      expect(stage).toHaveProperty("shortName");
    });
  });

  it("stage ids are sequential from 0 to 6", () => {
    STAGES.forEach((stage, index) => {
      expect(stage.id).toBe(index);
    });
  });

  it("exports exactly 8 model families", () => {
    expect(MODEL_FAMILIES).toHaveLength(8);
  });

  it("each model family has an id, label, description, and color", () => {
    MODEL_FAMILIES.forEach((family) => {
      expect(family).toHaveProperty("id");
      expect(family).toHaveProperty("label");
      expect(family).toHaveProperty("description");
      expect(family).toHaveProperty("color");
    });
  });

  it("all model family ids are unique", () => {
    const ids = MODEL_FAMILIES.map((f) => f.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

});
