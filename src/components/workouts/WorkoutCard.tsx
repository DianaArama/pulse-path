import type { Workout } from '@/types/workout';

const intensityRingStyles = {
  Low: 'border-[#6a1b75] bg-[#f6e7e8]',
  Medium: 'border-[#d1a54a] bg-[#fbf3dd]',
  High: 'border-[#4f6f35] bg-[#e4edd8]',
};

const WorkoutCard = ({ workout }: { workout: Workout }) => {
  return (
    <div className='rounded-[28px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.08)] backdrop-blur'>
      <p className='text-[10px] font-semibold uppercase tracking-[0.26em] text-[#6a1b75]'>
        {workout.day}
      </p>
      <div className='mt-2 flex items-start justify-between gap-4'>
        <h2 className='text-lg font-semibold text-[#1e1a17]'>{workout.name}</h2>
        <span
          title={`${workout.intensity} intensity`}
          aria-label={`${workout.intensity} intensity`}
          className={`h-4 w-4 rounded-full border-2 ${intensityRingStyles[workout.intensity]}`}
        />
      </div>
      <div className='mt-4 grid gap-4 sm:grid-cols-[180px_1fr]'>
        <div className='rounded-[20px] bg-[#fbf3dd] p-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#d77e2c]'>
            Duration / burn
          </p>
          <p className='mt-2 text-sm font-semibold text-[#1e1a17]'>
            {workout.duration} min
          </p>
          <p className='text-sm text-[#6d665f]'>{workout.calories} kcal</p>
        </div>
        <div className='rounded-[20px] bg-[#f6e7e8] p-4'>
          <p className='text-xs font-semibold uppercase tracking-[0.24em] text-[#6a1b75]'>
            Exercises
          </p>
          <ul className='mt-2 space-y-1 text-sm text-[#4f4942]'>
            {workout.exercises.map((exercise) => (
              <li key={exercise} className='rounded-full bg-white px-3 py-2 shadow-sm'>
                {exercise}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WorkoutCard;
