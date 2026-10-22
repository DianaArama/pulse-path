import type { MealRecommendation } from '@/types/nutrition';

const MealPanel = ({ id, meal }: { id: string; meal: MealRecommendation }) => {
  return (
    <div id={id} className='flex flex-col pt-4 text-[#1e1a17]'>
      <div className='flex flex-row'>
        <p className='pb-2 text-sm text-[#6d665f]'>
          Tags:
          {meal.tags.map((tag) => (
          <span key={tag} className='px-1 text-[#7a1f2b]'>
              [{tag}]
            </span>
          ))}
        </p>
      </div>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        <div className='flex flex-col rounded-2xl bg-[#f7f2ea] p-3'>
          <p className='text-xs uppercase tracking-[0.22em] text-[#7a1f2b]'>Calories</p>
          <span className='mt-1 text-sm font-semibold'>{meal.calories} kcal</span>
        </div>
        <div className='flex flex-col rounded-2xl bg-[#f7f2ea] p-3'>
          <p className='text-xs uppercase tracking-[0.22em] text-[#7a1f2b]'>Protein</p>
          <span className='mt-1 text-sm font-semibold'>{meal.protein} g</span>
        </div>
        <div className='flex flex-col rounded-2xl bg-[#f7f2ea] p-3'>
          <p className='text-xs uppercase tracking-[0.22em] text-[#7a1f2b]'>Carbs</p>
          <span className='mt-1 text-sm font-semibold'>{meal.carbs} g</span>
        </div>
        <div className='flex flex-col rounded-2xl bg-[#f7f2ea] p-3'>
          <p className='text-xs uppercase tracking-[0.22em] text-[#7a1f2b]'>Fat</p>
          <span className='mt-1 text-sm font-semibold'>{meal.fat} g</span>
        </div>
      </div>
      <div>
        <h4 className='font-semibold text-[#1e1a17]'>Ingredients</h4>
        <ul className='list-disc space-y-1 pl-5 text-[#6d665f]'>
          {meal.ingredients.map((ingredient) => (
            <li key={ingredient}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className='font-semibold text-[#1e1a17]'>Recipe</h4>
        <ol className='list-decimal space-y-1 pl-5 text-[#6d665f]'>
          {meal.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default MealPanel;
