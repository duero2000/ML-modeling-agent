// stageContent.js
// Static stage opener messages and chip sets for all 7 stages across all 8 model families.
// Keyed by stage id (0-6) and model family id.
// Consumed by ChatPanel (opener messages) and ChipBar (chips).

// ─── Helper ──────────────────────────────────────────────────────────────────
// Some stages have identical chips regardless of model family.
// Those are defined once and spread into the relevant entries below.

const FRAME_CHIPS_SHARED = [
  "What type of outcome am I predicting?",
  "How do I define success for this model?",
  "What are the business consequences of errors?",
  "Who is the end consumer of this model's output?",
];

const DATA_CHIPS_SHARED = [
  "How do I handle missing values?",
  "Should I split before or after preprocessing?",
  "How do I detect data leakage?",
  "What is the right train/test split ratio?",
];

const INTERPRET_CHIPS_SHARED = [
  "How do I explain this model to a non-technical stakeholder?",
  "What are the top drivers of predictions?",
  "How do I document model limitations?",
  "What should go in the final model summary?",
];

// ─── Stage Content ────────────────────────────────────────────────────────────
export const STAGE_CONTENT = {

  // ── Stage 0: Frame the Problem ──────────────────────────────────────────────
  0: {
    linear_regression: {
      opener: "Let's frame the problem. For linear regression to be the right tool, we need a continuous numeric outcome and reason to believe the relationship between predictors and that outcome is approximately linear. What are you trying to predict, and what does the business care about getting right?",
      chips: FRAME_CHIPS_SHARED,
    },
    binary_logistic: {
      opener: "Let's frame the problem. Binary logistic regression models the probability of a yes/no outcome. Before we touch any data, I want to understand what event you are predicting, what a false positive costs versus a false negative, and who will act on the model's output. Walk me through the business context.",
      chips: FRAME_CHIPS_SHARED,
    },
    regularized_regression: {
      opener: "Let's frame the problem. Regularized regression is typically chosen when you have many predictors, correlated predictors, or a risk of overfitting a standard OLS model. What outcome are you predicting and what is driving the choice to regularize?",
      chips: FRAME_CHIPS_SHARED,
    },
    decision_trees: {
      opener: "Let's frame the problem. Decision trees are interpretable and handle nonlinear relationships natively, but they overfit easily without tuning. What are you predicting, and is interpretability a hard requirement for this use case or a nice-to-have?",
      chips: FRAME_CHIPS_SHARED,
    },
    random_forests: {
      opener: "Let's frame the problem. Random forests trade some interpretability for significant gains in predictive accuracy. What outcome are you modeling, and has a simpler model already been tried? Understanding why you landed on an ensemble method helps frame the rest of the workflow.",
      chips: FRAME_CHIPS_SHARED,
    },
    gradient_boosting: {
      opener: "Let's frame the problem. Gradient boosting is one of the highest-performing methods on tabular data but requires careful tuning to avoid overfitting. What are you predicting, and what does the performance baseline look like from simpler models?",
      chips: FRAME_CHIPS_SHARED,
    },
    neural_networks: {
      opener: "Let's frame the problem. Neural networks are powerful but data-hungry and difficult to interpret. Before committing to this architecture, it is worth being clear about dataset size, whether interpretability is required, and what simpler models have already been tried. What is the prediction task?",
      chips: FRAME_CHIPS_SHARED,
    },
    naive_bayes: {
      opener: "Let's frame the problem. Naive Bayes is a fast, probabilistic classifier that works surprisingly well when the conditional independence assumption approximately holds. It is often a strong baseline. What are you classifying, and what does the feature space look like?",
      chips: FRAME_CHIPS_SHARED,
    },
  },

  // ── Stage 1: Data Preparation ───────────────────────────────────────────────
  1: {
    linear_regression: {
      opener: "On to data preparation. For linear regression, the key concerns are handling missing values, encoding categorical variables, checking for extreme outliers that could distort the OLS fit, and splitting the data before any transformation is fit. What does your dataset look like and what preprocessing have you done so far?",
      chips: DATA_CHIPS_SHARED,
    },
    binary_logistic: {
      opener: "On to data preparation. For logistic regression, class imbalance is often the first thing to address. A dataset where 98% of observations are non-events will produce a model that looks accurate but ignores the minority class entirely. What is the event rate in your data, and how are you thinking about handling imbalance?",
      chips: [
        "How do I handle class imbalance?",
        "Should I use SMOTE or undersampling?",
        "How do I encode categorical predictors?",
        "How do I split before preprocessing to avoid leakage?",
      ],
    },
    regularized_regression: {
      opener: "On to data preparation. Standardization is not optional for regularized regression. Because the penalty is applied to raw coefficient values, predictors on larger scales get penalized more heavily without it. Have you standardized your predictors, and are you fitting the scaler on training data only?",
      chips: [
        "Why must I standardize before regularizing?",
        "How do I fit the scaler correctly to avoid leakage?",
        "How do I handle categorical variables with regularization?",
        "What do I do about missing values?",
      ],
    },
    decision_trees: {
      opener: "On to data preparation. Decision trees are relatively robust to scale and missing values compared to linear models, but data quality still matters. Outliers can create unnecessary splits, and high cardinality categoricals need encoding. What does your raw dataset look like?",
      chips: [
        "Do I need to scale features for a decision tree?",
        "How do I handle high cardinality categorical variables?",
        "How do I deal with missing values in tree models?",
        "What is the right train/test split for tuning?",
      ],
    },
    random_forests: {
      opener: "On to data preparation. Random forests handle missing values and scale better than linear models but still benefit from clean data. Class imbalance is worth addressing here since forests vote by majority. What preprocessing steps have you completed and what is your class distribution?",
      chips: [
        "How does class imbalance affect random forests?",
        "Do I need to scale features for a random forest?",
        "How do I handle missing values in ensemble models?",
        "How do I set up my train/test split?",
      ],
    },
    gradient_boosting: {
      opener: "On to data preparation. Gradient boosting can handle raw features relatively well but is sensitive to noisy data and outliers since each tree is fit to residuals. Extreme values in the target variable can dominate early trees. What does your data look like and have you examined the target distribution?",
      chips: [
        "How do outliers affect gradient boosting?",
        "Do I need to scale features for XGBoost?",
        "How do I handle missing values in XGBoost?",
        "How should I structure my train/validation/test split?",
      ],
    },
    neural_networks: {
      opener: "On to data preparation. Neural networks are sensitive to input scale. All numeric inputs should be normalized or standardized. Categorical variables need encoding, and missing values need to be handled explicitly since networks cannot ignore them. What does your feature set look like?",
      chips: [
        "Should I normalize or standardize for neural networks?",
        "How do I encode categoricals for a neural network?",
        "How do I handle missing values in neural network inputs?",
        "How much data do I need for a neural network to work well?",
      ],
    },
    naive_bayes: {
      opener: "On to data preparation. Naive Bayes estimates probabilities for each feature independently, so the preprocessing decisions are simpler than most other methods. The main concerns are handling zero-frequency categories and deciding how to treat continuous features. What does your feature set consist of?",
      chips: [
        "How do I handle continuous features in Naive Bayes?",
        "What is the zero-frequency problem and how do I fix it?",
        "How do I handle missing values in Naive Bayes?",
        "Does class imbalance affect Naive Bayes?",
      ],
    },
  },

  // ── Stage 2: Variable Selection and Tuning ──────────────────────────────────
  2: {
    linear_regression: {
      opener: "Now for variable selection. In linear regression this means deciding which predictors belong in the model. Too many predictors relative to observations leads to overfitting. Correlated predictors inflate standard errors and make coefficients unstable. What is your predictor count relative to your sample size, and have you checked for multicollinearity?",
      chips: [
        "How do I detect multicollinearity?",
        "What is the VIF threshold I should use?",
        "Should I use forward, backward, or stepwise selection?",
        "How do I use AIC or BIC to compare models?",
      ],
    },
    binary_logistic: {
      opener: "Now for variable selection. For logistic regression, the goal is a parsimonious model that generalizes well. Irrelevant predictors add noise and inflate standard errors. Highly correlated predictors make coefficient interpretation unreliable. How many candidate predictors are you working with and have you examined their individual relationships with the outcome?",
      chips: [
        "How do I assess each predictor's individual relationship with the outcome?",
        "How do I handle multicollinearity in logistic regression?",
        "Should I use stepwise selection or penalized regression instead?",
        "How do I decide how many predictors to include?",
      ],
    },
    regularized_regression: {
      opener: "Now for tuning the regularization. The key decision here is choosing lambda, the penalty strength. Too little regularization and you overfit. Too much and you shrink useful signal to zero. We use cross-validation to find the optimal lambda. Which method are you using, Ridge, LASSO, or Elastic Net, and have you run the CV tuning yet?",
      chips: [
        "How do I use RidgeCV or LassoCV to find the best lambda?",
        "What does the coefficient path plot tell me?",
        "How do I choose between Ridge, LASSO, and Elastic Net?",
        "How do I interpret coefficients after regularization?",
      ],
    },
    decision_trees: {
      opener: "Now for tuning. An untuned decision tree almost always overfits. The three most important parameters are max depth, min samples per split, and min samples per leaf. We use cross-validation to find the right combination. Have you set up a parameter grid and run CV yet?",
      chips: [
        "What values should I try for max depth?",
        "How do I set up a grid search with cross-validation?",
        "What is the difference between grid search and Bayesian optimization?",
        "How do I know when my tree is overfitting?",
      ],
    },
    random_forests: {
      opener: "Now for tuning. The key parameters for a random forest are the number of trees, mtry (predictors considered per split), max depth, and min samples per leaf. More trees generally help up to a point of diminishing returns. Have you established a baseline with default parameters yet?",
      chips: [
        "How do I tune mtry for a random forest?",
        "How many trees do I actually need?",
        "How do I use OOB error to guide tuning?",
        "How do I interpret variable importance scores?",
      ],
    },
    gradient_boosting: {
      opener: "Now for tuning. Gradient boosting has more tuning levers than most methods. The learning rate and number of trees must be tuned jointly. Start with a small learning rate and use early stopping to find the optimal tree count before tuning other parameters. Where are you in this process?",
      chips: [
        "How do I use early stopping in XGBoost?",
        "How do I tune learning rate and n_estimators together?",
        "What is the subsample parameter and when should I adjust it?",
        "How do I tune regularization parameters in XGBoost?",
      ],
    },
    neural_networks: {
      opener: "Now for architecture and tuning. The key decisions are the number of hidden layers, the number of neurons per layer, the activation function, the optimizer, the learning rate, and regularization via dropout. These interact in complex ways. What architecture are you starting with and what is your training setup?",
      chips: [
        "How many layers and neurons should I start with?",
        "How does dropout work and when should I use it?",
        "How do I choose a learning rate?",
        "How do I know when to stop training?",
      ],
    },
    naive_bayes: {
      opener: "Now for variable selection. Naive Bayes does not have tuning parameters in the traditional sense, but the choice of which features to include still matters. Including irrelevant features adds noise to the probability estimates. How did you arrive at your current feature set and have you examined feature distributions by class?",
      chips: [
        "How do I decide which features to include in Naive Bayes?",
        "How does adding irrelevant features affect Naive Bayes?",
        "What is Laplace smoothing and when do I need it?",
        "How do I choose between Gaussian, Multinomial, and Bernoulli Naive Bayes?",
      ],
    },
  },

  // ── Stage 3: Fit the Model ───────────────────────────────────────────────────
  3: {
    linear_regression: {
      opener: "Time to fit the model. Run your OLS regression on the training data and bring back the coefficient table. We will examine the estimates, standard errors, t-statistics, and p-values together. If you have output to paste, drop it here.",
      chips: [
        "How do I read the coefficient table output?",
        "What does the p-value on each coefficient mean?",
        "What is the F-statistic testing?",
        "How do I interpret R-squared vs adjusted R-squared?",
      ],
    },
    binary_logistic: {
      opener: "Time to fit the model. Run your logistic regression on the training data and bring back the output. We will go through the coefficient table, convert log-odds to odds ratios, and check convergence. Paste whatever output you have.",
      chips: [
        "How do I convert log-odds coefficients to odds ratios?",
        "What does model convergence mean and how do I check it?",
        "How do I interpret the intercept in logistic regression?",
        "What is the null deviance vs residual deviance telling me?",
      ],
    },
    regularized_regression: {
      opener: "Time to fit the model. Run your regularized regression with the lambda selected from cross-validation. Paste the output including the selected lambda, nonzero coefficients for LASSO, and the cross-validation error curve if available.",
      chips: [
        "How do I confirm the right lambda was selected?",
        "How do I read the LASSO coefficient output?",
        "What does the CV error curve shape tell me?",
        "How do I fit Elastic Net with both alpha and lambda tuned?",
      ],
    },
    decision_trees: {
      opener: "Time to fit the model. Fit your tuned decision tree on the training data. Paste the tree structure output or the text representation and we will walk through the splits together. If you have a visualization, describe the root node and first few splits.",
      chips: [
        "How do I read a decision tree text output?",
        "What does the first split tell me about the most important variable?",
        "How do I confirm the tree depth matches my tuning parameters?",
        "How do I visualize a decision tree in Python?",
      ],
    },
    random_forests: {
      opener: "Time to fit the model. Fit your random forest on the training data with your tuned parameters. The individual trees are not interpretable directly, so we will focus on OOB score, variable importance, and training accuracy. Paste whatever output you have.",
      chips: [
        "How do I get the OOB score from a fitted random forest?",
        "How do I extract and plot variable importance?",
        "What training accuracy should I expect?",
        "How many trees actually ended up being used?",
      ],
    },
    gradient_boosting: {
      opener: "Time to fit the model. Fit your gradient boosting model with your tuned parameters including the optimal number of trees from early stopping. Paste the training log or final fit summary so we can check the loss curve and confirm the model converged properly.",
      chips: [
        "How do I read the XGBoost training log?",
        "What does the loss curve shape tell me?",
        "How do I confirm early stopping selected the right number of trees?",
        "How do I extract feature importance from XGBoost?",
      ],
    },
    neural_networks: {
      opener: "Time to fit the model. Run your training loop and paste the training and validation loss curves across epochs. We want to see whether the model is converging, whether validation loss tracks training loss, and whether there are signs of overfitting.",
      chips: [
        "How do I read training and validation loss curves?",
        "What does it look like when a neural network overfits?",
        "How do I use early stopping in Keras or PyTorch?",
        "What should my final training loss be?",
      ],
    },
    naive_bayes: {
      opener: "Time to fit the model. Fitting a Naive Bayes model is fast since it only needs to estimate class priors and per-feature likelihoods. Paste your output or confirm the model fit. We will move quickly to assessment since the interesting analysis happens there.",
      chips: [
        "How do I confirm the model fit correctly?",
        "How do I extract the class priors from a fitted Naive Bayes model?",
        "How do I get predicted probabilities instead of just class labels?",
        "How does the model handle features it has not seen before?",
      ],
    },
  },

  // ── Stage 4: Assess on Training Data ────────────────────────────────────────
  4: {
    linear_regression: {
      opener: "Let's assess the model on training data. We want to examine the residual plots, check OLS assumptions, and look at overall fit metrics. Paste your residual vs fitted plot description, any diagnostic output, and your training MAE or RMSE.",
      chips: [
        "How do I interpret a residual vs fitted plot?",
        "How do I test for heteroscedasticity formally?",
        "What is Cook's D telling me about influential points?",
        "Is my R-squared good enough?",
      ],
    },
    binary_logistic: {
      opener: "Let's assess the model on training data. For logistic regression, training assessment means examining the confusion matrix at your chosen threshold, calculating sensitivity and specificity, and looking at the AUC on the training set. Paste your output and we will interpret it together.",
      chips: [
        "How do I read my confusion matrix output?",
        "What threshold should I use for classification?",
        "What is a good AUC on training data?",
        "How do I calculate Somer's D from my AUC?",
      ],
    },
    regularized_regression: {
      opener: "Let's assess the model on training data. For regularized regression, training assessment focuses on the coefficient shrinkage, which variables survived LASSO selection, and the training error at the chosen lambda. Paste your coefficient output and training metrics.",
      chips: [
        "How many variables did LASSO zero out?",
        "How do I compare training error at different lambda values?",
        "How do I interpret coefficients that survived LASSO?",
        "What is my training R-squared telling me?",
      ],
    },
    decision_trees: {
      opener: "Let's assess the model on training data. Decision trees often achieve very high training accuracy because they can overfit the training set exactly if not constrained. Training accuracy alone is not meaningful here. Paste your training metrics and confusion matrix and we will contextualize them.",
      chips: [
        "Why is my training accuracy so high?",
        "How do I get a training confusion matrix for a tree?",
        "How do I check if my tree is overfitting the training data?",
        "What does feature importance look like from a single tree?",
      ],
    },
    random_forests: {
      opener: "Let's assess the model on training data. For random forests, the OOB score is more meaningful than raw training accuracy since it estimates out-of-sample performance using held-out observations from each tree. Paste your OOB score and training metrics.",
      chips: [
        "How does OOB score compare to training accuracy?",
        "What OOB score indicates a well-performing forest?",
        "How do I interpret the variable importance plot?",
        "Is my model overfitting based on training vs OOB error?",
      ],
    },
    gradient_boosting: {
      opener: "Let's assess the model on training data. For gradient boosting, training error typically drops to near zero with enough trees, which is expected and not useful on its own. The training log and validation loss from early stopping are more informative. Paste those outputs.",
      chips: [
        "Why does training error keep dropping with more trees?",
        "How do I read the early stopping output?",
        "What does the gap between training and validation loss tell me?",
        "How do I extract feature importance from a gradient boosting model?",
      ],
    },
    neural_networks: {
      opener: "Let's assess the model on training data. For neural networks, we examine training loss, training accuracy, and whether the loss curve flattened out or was still descending when training stopped. Paste your final epoch metrics and loss curve description.",
      chips: [
        "My training loss is still decreasing. Should I train longer?",
        "How do I interpret training accuracy for a neural network?",
        "What does a loss curve that plateaus early indicate?",
        "How do I check for vanishing gradients?",
      ],
    },
    naive_bayes: {
      opener: "Let's assess the model on training data. Naive Bayes training assessment is quick. Paste your training confusion matrix and accuracy. Since Naive Bayes outputs probabilities, we will also look at how well-calibrated those probabilities are on the training set.",
      chips: [
        "How do I assess probability calibration for Naive Bayes?",
        "What training accuracy should I expect from Naive Bayes?",
        "How do I read my training confusion matrix?",
        "How does Naive Bayes perform on imbalanced training data?",
      ],
    },
  },

  // ── Stage 5: Evaluate on Test Data ──────────────────────────────────────────
  5: {
    linear_regression: {
      opener: "Now we evaluate on the held-out test set. This is where we find out if the model generalizes. Paste your test MAE, RMSE, and any residual diagnostics on test data. We will compare these to training metrics to assess generalization.",
      chips: [
        "How much degradation from training to test is acceptable?",
        "How do I interpret test RMSE vs training RMSE?",
        "What does a large gap between train and test error mean?",
        "How do I report test performance to stakeholders?",
      ],
    },
    binary_logistic: {
      opener: "Now we evaluate on the held-out test set. Paste your test confusion matrix, test AUC, sensitivity, and specificity. We will compare to training metrics and assess whether the model discriminates and calibrates well on unseen data.",
      chips: [
        "How does my test AUC compare to training AUC?",
        "How do I plot an ROC curve on test data?",
        "How do I use the Youden Index to select the final threshold?",
        "How do I assess calibration on the test set?",
      ],
    },
    regularized_regression: {
      opener: "Now we evaluate on the held-out test set. Paste your test R-squared, test MAE or RMSE, and the final model coefficients. We will examine how the regularized model generalizes compared to what an unregularized OLS would have done.",
      chips: [
        "How do I compare regularized vs unregularized test performance?",
        "What test metrics should I report for a regularized model?",
        "How does test error compare to the cross-validation error from tuning?",
        "How do I interpret the final retained coefficients?",
      ],
    },
    decision_trees: {
      opener: "Now we evaluate on the held-out test set. This is the critical check for a decision tree since training accuracy is almost always inflated. Paste your test accuracy, confusion matrix, and any other test metrics. We will compare to training to diagnose overfitting.",
      chips: [
        "How large a gap between training and test accuracy indicates overfitting?",
        "How do I get a full classification report on test data?",
        "How do I plot the ROC curve for a decision tree classifier?",
        "Should I retune based on test performance?",
      ],
    },
    random_forests: {
      opener: "Now we evaluate on the held-out test set. Paste your test accuracy, test AUC if this is a classification task, and confusion matrix. We will compare test performance to the OOB score from training to see if the OOB estimate was accurate.",
      chips: [
        "How does test accuracy compare to my OOB score?",
        "How do I get test AUC for a random forest classifier?",
        "What does high variance between training and test tell me?",
        "How do I report random forest performance to stakeholders?",
      ],
    },
    gradient_boosting: {
      opener: "Now we evaluate on the held-out test set. Gradient boosting models often generalize well when tuned correctly. Paste your test metrics including accuracy or RMSE, AUC if applicable, and confusion matrix. We will compare to the validation loss from early stopping.",
      chips: [
        "How does test performance compare to validation loss from early stopping?",
        "How do I get test AUC from an XGBoost classifier?",
        "What test metrics matter most for gradient boosting?",
        "How do I diagnose if I overtuned on the validation set?",
      ],
    },
    neural_networks: {
      opener: "Now we evaluate on the held-out test set. Neural networks are prone to overfitting, so the gap between training and test performance is the key signal here. Paste your test loss, test accuracy, and confusion matrix.",
      chips: [
        "How large a gap between training and test loss is acceptable?",
        "How do I get a confusion matrix from a neural network?",
        "My test accuracy is much lower than training. What do I do?",
        "How do I report neural network test performance?",
      ],
    },
    naive_bayes: {
      opener: "Now we evaluate on the held-out test set. Paste your test accuracy, confusion matrix, and test AUC if available. Naive Bayes often generalizes well relative to its simplicity. We will compare test to training and assess whether the independence assumption held well enough.",
      chips: [
        "How do I know if the independence assumption hurt generalization?",
        "How does Naive Bayes test accuracy compare to more complex models?",
        "How do I get test AUC from a Naive Bayes classifier?",
        "When should I abandon Naive Bayes for a more complex model?",
      ],
    },
  },

  // ── Stage 6: Interpret and Communicate ──────────────────────────────────────
  6: {
    linear_regression: {
      opener: "Final stage: interpret and communicate. Linear regression coefficients are directly interpretable. Each coefficient represents the expected change in the outcome for a one-unit increase in that predictor, holding all others constant. Let's walk through your final coefficient table and build the narrative for stakeholders.",
      chips: INTERPRET_CHIPS_SHARED,
    },
    binary_logistic: {
      opener: "Final stage: interpret and communicate. The core output for logistic regression is the odds ratio table. Each OR tells a business story about which factors increase or decrease the odds of the outcome. Let's translate your model output into plain language for decision makers.",
      chips: INTERPRET_CHIPS_SHARED,
    },
    regularized_regression: {
      opener: "Final stage: interpret and communicate. Regularized regression coefficients are more difficult to interpret than OLS because the penalty shrinks them. Focus on direction and relative magnitude rather than exact values. Which variables survived and what direction do they point?",
      chips: INTERPRET_CHIPS_SHARED,
    },
    decision_trees: {
      opener: "Final stage: interpret and communicate. Decision trees are among the most interpretable models available. The tree structure itself is the explanation. Walk me through the top three splits in your final tree and we will build a plain-language narrative from those.",
      chips: INTERPRET_CHIPS_SHARED,
    },
    random_forests: {
      opener: "Final stage: interpret and communicate. Random forests are not directly interpretable at the tree level, so we rely on variable importance and partial dependence plots to explain what the model learned. What are the top five variables by importance and what direction do they drive predictions?",
      chips: INTERPRET_CHIPS_SHARED,
    },
    gradient_boosting: {
      opener: "Final stage: interpret and communicate. Like random forests, gradient boosting models require post-hoc interpretation tools. SHAP values give the most principled local explanations, while permutation importance gives global signal. What interpretation tools have you run so far?",
      chips: INTERPRET_CHIPS_SHARED,
    },
    neural_networks: {
      opener: "Final stage: interpret and communicate. Neural networks are black boxes by default. Interpretation requires external tools like SHAP or LIME applied after the fact. The key communication challenge is explaining predictions without being able to point to coefficients. What is your audience's tolerance for complexity?",
      chips: INTERPRET_CHIPS_SHARED,
    },
    naive_bayes: {
      opener: "Final stage: interpret and communicate. Naive Bayes is highly interpretable through its class probabilities and per-feature likelihoods. You can show exactly how each feature contributed to a specific prediction by walking through the probability calculation. Let's build that narrative.",
      chips: INTERPRET_CHIPS_SHARED,
    },
  },

};