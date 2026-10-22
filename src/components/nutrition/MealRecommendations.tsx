import type { MealRecommendation } from '@/types/nutrition';
import MealCard from './MealCard';
import SurfaceCard from '../ui/SurfaceCard';

const MealRecommendations = ({ meals }: { meals: MealRecommendation[] }) => {
  return (
    <SurfaceCard>
      <p className='text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a1f2b]'>
        Meal recommendations
      </p>
      <div className='mt-4 grid gap-4'>
        {meals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}
      </div>
    </SurfaceCard>
  );
};

export default MealRecommendations;

