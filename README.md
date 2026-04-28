# ML Modeling Agent

> I built this because I was tired of tabbing between previous projects, tutorials, lecture notes, textbooks, and half-remembered formulas every time I needed to think through a modeling problem. This is my single source of truth, an AI-powered agent that walks me through the full supervised modeling workflow, on demand, without the context-switching.

![Demo](./assets/demo.gif)
*Drop your demo GIF here after deployment*

---

## Why I Built It

I was preparing for a technical ML interview and kept bouncing between notes, slides, and reference material to piece together a coherent mental model of each method. There was no single place that let me ask a precise question, get a precise answer grounded in the right context, and then keep going without losing the thread. So I built one.

---

## What It Does

ML Modeling Agent is a conversational AI tool built on top of Claude (Anthropic) that guides you through a 7-stage supervised modeling workflow. You pick a model family, choose how you want to engage, and work through the process in a structured chat interface.

---

## Model Families

The agent covers eight model families. Each one has its own stage opener messages, chip sets, and context-aware responses tailored to that method's specific workflow and interpretation patterns.

**Linear Regression** covers continuous outcome modeling, OLS fitting, residual diagnostics, R² and adjusted R², and coefficient interpretation.

**Binary Logistic Regression** covers binary outcome classification, MLE fitting, odds ratio interpretation for both continuous and categorical predictors, confusion matrix metrics (sensitivity, specificity, AUC, C-statistic, Somer's D, Youden Index), and calibration.

**Regularized Regression** covers Ridge, LASSO, and Elastic Net. This includes the requirement for standardization before fitting, lambda tuning via cross-validation (RidgeCV, LassoCV, ElasticNetCV), coefficient path plots, and the tradeoff between shrinkage and interpretability as lambda grows.

**Decision Trees (CART)** covers recursive binary splitting using Gini impurity or MSE, greedy algorithm limitations, pruning strategies, tree depth and complexity tradeoffs, and variable importance scores.

**Random Forests** covers ensemble of decorrelated trees, bootstrap aggregation, out-of-bag error estimation, variable importance via mean decrease in impurity, and hyperparameter tuning.

**Gradient Boosting and XGBoost** covers sequential tree building, learning rate and depth tradeoffs, regularization terms in XGBoost, early stopping, and feature importance.

**Neural Networks** covers forward and backward propagation, activation functions, layer depth and width tradeoffs, overfitting via dropout and regularization, and when neural networks earn their complexity cost.

**Naive Bayes** covers the conditional independence assumption, likelihood estimation, Laplace smoothing, and where the model holds up despite its simplifying assumption.

---

## The 7-Stage Workflow

Every session moves through the same seven stages regardless of model family. The agent adapts its questions, interpretation rules, and context to whichever family you selected at onboarding.

**Stage 1: Frame the Problem**
Define the outcome variable, confirm its type (binary, continuous, categorical), choose the appropriate model family, and establish the train/test split strategy. This stage locks the problem definition before any data work begins.

**Stage 2: Data Preparation**
Handle missing values, identify and address outliers, encode categorical variables via dummy coding, screen for class imbalance in classification problems, and standardize predictors where required (mandatory for regularized regression).

**Stage 3: Variable Selection and Tuning**
Method-specific work: forward, backward, or stepwise selection for logistic regression; hyperparameter tuning with cross-validation for trees and ensembles; lambda selection via RidgeCV, LassoCV, or ElasticNetCV for regularized regression. The goal is a final candidate variable set before fitting.

**Stage 4: Fit the Model**
Fit the final model on training data using the method-appropriate algorithm. MLE for logistic regression, greedy recursive splitting for decision trees, penalized SSE minimization for regularized regression. No tuning happens here, this stage is execution only.

**Stage 5: Assess on Training Data**
Evaluate in-sample performance using the right metrics for the task. For classification: confusion matrix, accuracy, sensitivity, specificity, AUC, C-statistic, Somer's D, Youden Index, and calibration. For continuous outcomes: MAE, MAPE, and R². For trees and regularized models: variable importance scores and coefficient path plots.

**Stage 6: Evaluate on Test Data**
Apply the frozen model to held-out test data. Compare train vs. test metrics to detect overfitting. This stage produces the honest estimate of how the model will perform on new data.

**Stage 7: Interpret and Communicate**
Translate model output into plain language. Odds ratios for logistic regression, decision rules and variable importance rankings for trees, and direction with relative magnitude for regularized regression. The emphasis is on communicating findings in a way that is defensible and useful to a non-technical audience.

---


## Vision

This project is in continuous development. The near-term goal is a fully deployable, polished tool covering the core supervised modeling workflow. The long-term goal is a general-purpose modeling thinking partner, a tool I can bring any real problem to, frame it correctly, select the right approach, build and interpret the model, and communicate the results. The ambition is not a study app. It is a permanent part of how I work.

Planned expansions include broader model family coverage, support for unsupervised methods, richer output interpretation for real pasted results, and eventually a problem framing mode that helps diagnose what kind of model a given business question actually calls for.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React + Vite | Fast dev loop, clean component model |
| Styling | Inline styles only | No build-time CSS tooling, full control |
| AI | Anthropic Claude API | Best-in-class reasoning for technical content |
| Deployment | Vercel | Zero-config deploys from GitHub |
| Testing | Vitest | Unit tests for all pure utility functions |

---

## Architecture Highlights

**Component ownership is strict.** App.jsx owns all session state. ChatPanel owns all API logic. Sidebar owns navigation only. No component reaches into another's domain.

**Chip regeneration is side-effect driven.** A `useEffect` in ChatPanel watches `currentStage` and `mode` and fires a chip API call on transition. An `isFirstRender` ref prevents a double-fire on mount.

**Synthesize wiring is ref-based.** ChatPanel defines `handleSynthesize` and registers it with App via `registerSynthesize` on mount. App holds it in a `useRef` and passes it to Sidebar. All API logic stays in ChatPanel. Sidebar owns only the button.

**Token estimation is local.** No external tokenizer. Character count divided by 4 gives a close enough estimate for context health tracking. The health bar updates on every message and changes color at 60% (amber) and 85% (red).

---

## Running Locally

```bash
# Clone the repo
git clone https://github.com/duero2000/ml-modeling-agent.git
cd ml-modeling-agent

# Install dependencies
npm install

# Add your Anthropic API key
echo "VITE_ANTHROPIC_API_KEY=your_key_here" > .env

# Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Running Tests

```bash
npm run test
```

32 tests cover config constants, stage content structure, token estimation, and session synthesis logic. Components with no exported pure functions have no test files by design.

---

## Project Structure

```
src/
  components/
    Onboarding.jsx      # Model family selection screen
    TopBar.jsx          # Session header + download
    Sidebar.jsx         # Stage tracker, mode toggle, usage bubble
    ChatPanel.jsx       # Message history, input, API calls
    MessageBubble.jsx   # User, agent, and synthesis message variants
    ChipBar.jsx         # Suggested prompt chips
    UsageBubble.jsx     # Token usage + context health bar
  config.js             # All constants in one place
  systemPrompt.js       # Full agent system prompt
  stageContent.js       # Stage openers and chips per model family
  synthesizer.js        # Synthesis API call + formatting
  tokenEstimator.js     # Token count estimation
  App.jsx               # Session state + view routing
tests/
  config.test.js
  stageContent.test.js
  tokenEstimator.test.js
  synthesizer.test.js
```

---

## Known Limitations

A few things I know need improvement and plan to address:

- Chip failures are silent. If the API returns malformed JSON, chips disappear without any feedback.
- There is no restart affordance. Refreshing the browser is the only way to start a new session.
- The system prompt does not inject current stage or model family. Claude infers both from conversation history rather than receiving them explicitly.
- No session persistence. Closing the tab loses everything.

---

## License

MIT