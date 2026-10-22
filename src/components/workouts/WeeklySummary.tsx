import type { Workout } from '@/types/workout';
import SurfaceCard from '../ui/SurfaceCard';
import SummaryStat from '../ui/SummaryStat';

const WeeklySummary = ({ workouts }: { workouts: Workout[] }) => {
  const totalDuration = workouts.reduce(
    (sum, workout) => sum + workout.duration,
    0,
  );
  const totalCalories = workouts.reduce(
    (sum, workout) => sum + workout.calories,
    0,
  );
  const totalWorkouts = workouts.length;

  return (
    <SurfaceCard>
      <p className='text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a1f2b]'>
        Weekly summary
      </p>
      <div className='mt-4 grid gap-3 sm:grid-cols-3'>
        <SummaryStat stat={`${totalDuration} mins`} label='Minutes' />
        <SummaryStat stat={`${totalCalories} kcal`} label='Calories' />
        <SummaryStat stat={`${totalWorkouts}`} label='Workouts' />
      </div>
    </SurfaceCard>
  );
};

export default WeeklySummary;

