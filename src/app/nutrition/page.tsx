import PageHeader from '@/components/ui/PageHeader';
import MealRecommendations from '@/components/nutrition/MealRecommendations';
import NutritionSummary from '@/components/nutrition/NutritionSummary';
import NutritionHabits from '@/components/nutrition/NutritionHabits';
import type {
  MealRecommendation,
  NutritionHabit,
  NutritionSummary as NutritionSummaryData,
} from '@/types/nutrition';

const nutritionSummary: NutritionSummaryData = {
  calorieTarget: 2200,
  caloriesLogged: 1650,
  proteinTarget: 140,
  proteinLogged: 105,
  carbsTarget: 240,
  carbsLogged: 180,
  fatTarget: 70,
  fatLogged: 52,
  waterTarget: 2.5,
  waterLogged: 1.8,
};

const mealRecommendations: MealRecommendation[] = [
  {
    id: 'meal-1',
    name: 'Salmon Power Bowl',
    mealType: 'Lunch',
    calories: 620,
    protein: 42,
    carbs: 58,
    fat: 24,
    image: '/images/salmon-bowl.jfif',
    imageAlt: 'Salmon bowl with rice, greens, avocado, and vegetables',
    tags: ['High protein', 'Omega-3', 'Post-workout'],
    prepTime: 25,
    ingredients: [
      '150g grilled salmon',
      '120g cooked brown rice',
      '1 cup mixed greens',
      '1/2 avocado',
      '1/2 cup cucumber',
      '1/2 cup cherry tomatoes',
      '1 tbsp lemon yogurt dressing',
    ],
    steps: [
      'Cook the brown rice and let it cool slightly.',
      'Season and grill the salmon until cooked through.',
      'Add greens, rice, cucumber, tomatoes, and avocado to a bowl.',
      'Place the salmon on top.',
      'Drizzle with lemon yogurt dressing and serve.',
    ],
  },
  {
    id: 'meal-2',
    name: 'Greek Yogurt Recovery Bowl',
    mealType: 'Snack',
    calories: 380,
    protein: 32,
    carbs: 42,
    fat: 9,
    image: '/images/yogurt-bowl.jfif',
    imageAlt: 'Greek yogurt bowl with berries, banana, and granola',
    tags: ['Quick', 'Recovery', 'High protein'],
    prepTime: 8,
    ingredients: [
      '250g Greek yogurt',
      '1/2 banana',
      '1/2 cup mixed berries',
      '30g granola',
      '1 tsp honey',
      '1 tbsp chia seeds',
    ],
    steps: [
      'Add Greek yogurt to a bowl.',
      'Slice the banana and add it on top.',
      'Add berries, granola, chia seeds, and honey.',
      'Mix gently or eat layered.',
    ],
  },
  {
    id: 'meal-3',
    name: 'Chicken Quinoa Plate',
    mealType: 'Dinner',
    calories: 710,
    protein: 55,
    carbs: 68,
    fat: 22,
    image: '/images/chicken-quinoa.jfif',
    imageAlt: 'Grilled chicken with quinoa, roasted vegetables, and greens',
    tags: ['Balanced', 'Lean protein', 'Meal prep'],
    prepTime: 30,
    ingredients: [
      '170g grilled chicken breast',
      '140g cooked quinoa',
      '1 cup roasted vegetables',
      '1 cup spinach',
      '1 tbsp olive oil',
      '1 tbsp tahini lemon sauce',
    ],
    steps: [
      'Cook the quinoa according to package instructions.',
      'Season and grill the chicken breast.',
      'Roast vegetables with olive oil until tender.',
      'Plate the quinoa, spinach, vegetables, and chicken.',
      'Drizzle with tahini lemon sauce and serve.',
    ],
  },
];

const nutritionHabits: NutritionHabit[] = [
  {
    id: 'habit-1',
    label: 'Drink 2.5L water',
    completed: false,
  },
  {
    id: 'habit-2',
    label: 'Eat 30g fiber',
    completed: false,
  },
  {
    id: 'habit-3',
    label: 'Include protein in every meal',
    completed: true,
  },
];

const NutritionPage = () => {
  return (
    <main className='flex min-w-0 flex-col gap-4'>
      <PageHeader
        eyebrow='Fuel'
        title='Nutrition'
        description="Fuel plan based on today's training and calorie target."
      />
      <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]'>
        <section className='flex flex-col gap-4'>
          <NutritionSummary summary={nutritionSummary} />
          <MealRecommendations meals={mealRecommendations} />
        </section>
        <aside className='space-y-4'>
          <NutritionHabits habits={nutritionHabits} />
          <section className='rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.10)] backdrop-blur'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a1f2b]'>
              Meal logic
            </p>
            <p className='mt-3 text-sm leading-7 text-[#665e56]'>
              The meal cards can later pull from the active user&apos;s calorie
              target, workout load, and recovery needs.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default NutritionPage;

