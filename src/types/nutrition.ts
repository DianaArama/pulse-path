export type NutritionSummary = {
  caloriesLogged: number;
  calorieTarget: number;
  proteinLogged: number;
  proteinTarget: number;
  carbsLogged: number;
  carbsTarget: number;
  fatLogged: number;
  fatTarget: number;
  waterTarget: number;
  waterLogged: number;
};

export type MealRecommendation = {
  id: string;
  name: string;
  mealType: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  imageAlt: string;
  tags: string[];
  prepTime: number;
  ingredients: string[];
  steps: string[];
};

export type NutritionHabit = {
  id: string;
  label: string;
  completed: boolean;
};
