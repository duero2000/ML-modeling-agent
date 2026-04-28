import { describe, it, expect } from "vitest";
import { STAGE_CONTENT } from "../src/stageContent.js";
import { STAGES, MODEL_FAMILIES } from "../src/config.js";

describe("stageContent.js", () => {

  const modelIds = MODEL_FAMILIES.map((f) => f.id);
  const stageIds = STAGES.map((s) => s.id);

  it("has an entry for every stage", () => {
    stageIds.forEach((id) => {
      expect(STAGE_CONTENT[id], `Stage ${id} is missing`).toBeDefined();
    });
  });

  it("has an entry for every model family in every stage", () => {
    stageIds.forEach((stageId) => {
      modelIds.forEach((modelId) => {
        expect(
          STAGE_CONTENT[stageId][modelId],
          `Stage ${stageId} is missing model family: ${modelId}`
        ).toBeDefined();
      });
    });
  });

  it("every entry has a non-empty opener string", () => {
    stageIds.forEach((stageId) => {
      modelIds.forEach((modelId) => {
        const { opener } = STAGE_CONTENT[stageId][modelId];
        expect(typeof opener).toBe("string");
        expect(opener.length).toBeGreaterThan(0);
      });
    });
  });

  it("every entry has exactly 4 chips", () => {
    stageIds.forEach((stageId) => {
      modelIds.forEach((modelId) => {
        const { chips } = STAGE_CONTENT[stageId][modelId];
        expect(
          chips,
          `Stage ${stageId} / ${modelId} does not have exactly 4 chips`
        ).toHaveLength(4);
      });
    });
  });

  it("no chip is an empty string", () => {
    stageIds.forEach((stageId) => {
      modelIds.forEach((modelId) => {
        const { chips } = STAGE_CONTENT[stageId][modelId];
        chips.forEach((chip, i) => {
          expect(
            chip.length,
            `Stage ${stageId} / ${modelId} chip ${i} is empty`
          ).toBeGreaterThan(0);
        });
      });
    });
  });

});
