// Linear regression model trained on data/sessions.csv (220 rows)
// Fitted with scikit-learn, one-hot encoded categorical features.
// Test R² = 0.916 | Train R² = 0.877 | MAE = 0.44
// Baseline (intercept) = architecture genre, blue_hour, fog weather, crowd_level 0

export const MODEL_INFO = {
  intercept: 7.549,
  r2Test: 0.916,
  r2Train: 0.877,
  mae: 0.44,
  trainingRows: 176,
  testRows: 44,
};

const GENRE_COEF: Record<string, number> = {
  architecture: 0,
  landscape: 0.523,
  portrait: 0.454,
  street: 0.112,
};

const TIME_COEF: Record<string, number> = {
  blue_hour: 0,
  golden_hour: 0.38,
  midday: -2.975,
  night: -1.632,
};

const WEATHER_COEF: Record<string, number> = {
  fog: 0,
  overcast: -0.099,
  rain: -1.6,
  sunny: 0.051,
};

const CROWD_COEF = -0.416;

export type PredictionInput = {
  genre: string;
  timeOfDay: string;
  weather: string;
  crowdLevel: number;
};

export function predictRating(input: PredictionInput): number {
  const raw =
    MODEL_INFO.intercept +
    (GENRE_COEF[input.genre] ?? 0) +
    (TIME_COEF[input.timeOfDay] ?? 0) +
    (WEATHER_COEF[input.weather] ?? 0) +
    CROWD_COEF * input.crowdLevel;

  return Math.min(10, Math.max(1, raw));
}

// Explains which factors pushed the prediction up or down
export function explainPrediction(input: PredictionInput) {
  return [
    { label: "Genre", value: input.genre, effect: GENRE_COEF[input.genre] ?? 0 },
    { label: "Time of day", value: input.timeOfDay.replace("_", " "), effect: TIME_COEF[input.timeOfDay] ?? 0 },
    { label: "Weather", value: input.weather, effect: WEATHER_COEF[input.weather] ?? 0 },
    { label: "Crowd level", value: String(input.crowdLevel), effect: CROWD_COEF * input.crowdLevel },
  ];
}