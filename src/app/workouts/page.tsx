import PageHeader from '@/components/ui/PageHeader';
import WeeklySummary from '@/components/workouts/WeeklySummary';
import WorkoutDaySelector from '@/components/workouts/WorkoutDaySelector';
import type { Workout } from '@/types/workout';

const workouts: Workout[] = [
  {
    id: 'workout-1',
    name: 'Strength Lower Body',
    exercises: ['Goblet squat', 'Romanian deadlift', 'Walking lunges'],
    duration: 60,
    intensity: 'Medium',
    calories: 300,
    day: 'Monday',
  },
  {
    id: 'workout-2',
    name: 'Strength Upper Body',
    exercises: ['Push-ups', 'Dumbbell rows', 'Overhead press'],
    duration: 40,
    intensity: 'Medium',
    calories: 230,
    day: 'Tuesday',
  },
  {
    id: 'workout-3',
    name: 'Zone 2 Run',
    exercises: ['Running'],
    duration: 45,
    intensity: 'Low',
    calories: 200,
    day: 'Wednesday',
  },
  {
    id: 'workout-4',
    name: 'Pilates',
    exercises: ['Pilates mat exercises', 'Foam rolling', 'Stretching'],
    duration: 45,
    intensity: 'Low',
    calories: 200,
    day: 'Thursday',
  },
  {
    id: 'workout-5',
    name: 'Total Body Strength',
    exercises: ['Deadlifts', 'Bench press', 'Barbell rows'],
    duration: 50,
    intensity: 'High',
    calories: 350,
    day: 'Friday',
  },
  {
    id: 'workout-6',
    name: 'Mobility & Core',
    exercises: ['Cat-cow stretch', 'Bird-dog', 'Plank'],
    duration: 30,
    intensity: 'Low',
    calories: 150,
    day: 'Saturday',
  },
  {
    id: 'workout-7',
    name: 'Rest day',
    exercises: ['Light walking', 'Gentle stretching', 'Foam rolling'],
    duration: 30,
    intensity: 'Low',
    calories: 150,
    day: 'Sunday',
  },
];

const WorkoutsPage = () => {
  return (
    <main className='flex min-w-0 flex-col gap-4'>
      <PageHeader
        eyebrow='Training'
        title='Workouts'
        description='Your training plan for the week.'
      />
      <section className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]'>
        <div className='space-y-4'>
          <WeeklySummary workouts={workouts} />
          <WorkoutDaySelector workouts={workouts} />
        </div>
        <aside className='rounded-[30px] border border-[#e6d8ca] bg-white p-5 shadow-[0_16px_36px_rgba(126,74,35,0.10)] backdrop-blur'>
          <p className='text-[10px] font-semibold uppercase tracking-[0.28em] text-[#7a1f2b]'>
            Weekly intent
          </p>
          <div className='mt-4 space-y-3 text-sm text-[#665e56]'>
            <p>Build strength early in the week.</p>
            <p>Shift to low-intensity recovery sessions midweek.</p>
            <p>Keep the weekend flexible and sustainable.</p>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default WorkoutsPage;

