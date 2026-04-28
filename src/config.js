// ─── Model string ───────────────────────────────────────────────────────────
// Single source of truth for the Claude model used across all API calls
export const MODEL = "claude-sonnet-4-6";

// ─── API token limits ────────────────────────────────────────────────────────
// Each call type gets its own cap to control credit usage
export const MAX_TOKENS = {
  main: 1000,       // Main conversation responses
  chips: 300,       // Chip regeneration (lean, context-specific suggestions)
  synthesis: 400,   // Session compression summary
};

// ─── Context window ──────────────────────────────────────────────────────────
// Used by UsageBubble to calculate context health percentage
// 200k token window; we treat 160k as the practical ceiling before warning
export const CONTEXT_WINDOW = 160000;

// ─── Context health thresholds ───────────────────────────────────────────────
// Green below AMBER, amber between AMBER and RED, red above RED
export const HEALTH_THRESHOLDS = {
  AMBER: 0.60,
  RED: 0.85,
};

// ─── Chip regeneration triggers ──────────────────────────────────────────────
// These are the only three events that fire a chip regeneration API call
export const CHIP_TRIGGERS = {
  MODEL_SELECTED: "MODEL_SELECTED",
  STAGE_CHANGED: "STAGE_CHANGED",
  MODE_CHANGED: "MODE_CHANGED",
};

// ─── Modes ───────────────────────────────────────────────────────────────────
export const MODES = {
  GUIDED: "guided",
  QA: "qa",
};

// ─── Stage definitions ───────────────────────────────────────────────────────
// 7 stages in the guided workflow, indexed 0 through 6
export const STAGES = [
  { id: 0, label: "Frame the Problem",           shortName: "Frame"    },
  { id: 1, label: "Data Preparation",            shortName: "Data"     },
  { id: 2, label: "Variable Selection & Tuning", shortName: "Variables"},
  { id: 3, label: "Fit the Model",               shortName: "Fit"      },
  { id: 4, label: "Assess on Training Data",     shortName: "Train"    },
  { id: 5, label: "Evaluate on Test Data",       shortName: "Test"     },
  { id: 6, label: "Interpret & Communicate",     shortName: "Interpret"},
];

// ─── Model families ──────────────────────────────────────────────────────────
// 8 families shown on the onboarding screen in a 2x4 grid
// Colors are muted accent tones that complement the dark background (#0d0d0b)
// and warm off-white text (#e8e5dc) without competing with the gold (#c8a96e)
export const MODEL_FAMILIES = [
  {
    id: "linear_regression",
    label: "Linear Regression",
    description: "OLS, residuals, assumptions, diagnostics",
    color: "#4a7c6f",
  },
  {
    id: "binary_logistic",
    label: "Binary Logistic Regression",
    description: "MLE, odds ratios, AUC, confusion matrix",
    color: "#5a6e9c",
  },
  {
    id: "regularized_regression",
    label: "Regularized Regression",
    description: "Ridge, LASSO, Elastic Net, lambda tuning",
    color: "#7a5c8a",
  },
  {
    id: "decision_trees",
    label: "Decision Trees (CART)",
    description: "Greedy splits, Gini, entropy, pruning",
    color: "#8a6a3a",
  },
  {
    id: "random_forests",
    label: "Random Forests",
    description: "Bagging, OOB score, variable importance",
    color: "#3a7a5a",
  },
  {
    id: "gradient_boosting",
    label: "Gradient Boosting & XGBoost",
    description: "Sequential residuals, weak learners, eta",
    color: "#7a3a3a",
  },
  {
    id: "neural_networks",
    label: "Neural Networks",
    description: "Layers, activations, deep learning variants",
    color: "#3a5a7a",
  },
  {
    id: "naive_bayes",
    label: "Naive Bayes",
    description: "Bayes theorem, conditional independence",
    color: "#6a7a3a",
  },
];