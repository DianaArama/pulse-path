import PageHeader from '@/components/ui/PageHeader';
import type {
  RecommendedReset,
  RecoveryTip,
  StressCheckInOptions,
  StressHabit,
} from '@/types/stress';
import RecommendedResetCard from '@/components/stress/RecommendedResetCard';
import RecoveryTipsCard from '@/components/stress/RecoveryTipsCard';
import StressCheckInCard from '@/components/stress/StressCheckInCard';
import StressHabitsCard from '@/components/stress/StressHabitsCard';

const stressCheckInOptions: StressCheckInOptions = {
  stressLevels: ['Low', 'Moderate', 'High'],
  energyLevels: ['Low', 'Good', 'Strong'],
  sleepQuality: ['Poor', 'Okay', 'Great'],
};
const recommendedReset: RecommendedReset = {
  title: 'Evening Recovery Reset',
  duration: 15,
  intensity: 'Gentle',
  steps: [
    'Do 5 minutes of box breathing',
    'Take a 10 minute easy walk',
    'Stretch neck, shoulders, and hips',
    'Dim lights and avoid phone scrolling',
  ],
};
const stressHabits: StressHabit[] = [
  {
    id: 'stress-habit-1',
    label: '5 minutes breathing',
    completed: false,
  },
  {
    id: 'stress-habit-2',
    label: '10 minute walk outside',
    completed: false,
  },
  {
    id: 'stress-habit-3',
    label: 'No phone 30 minutes before bed',
    completed: false,
  },
  {
    id: 'stress-habit-4',
    label: 'Stretch shoulders and neck',
    completed: true,
  },
];
const recoveryTips: RecoveryTip[] = [
  {
    id: 'tip-1',
    title: 'Box Breathing',
    description: 'Inhale for 4 seconds, hold for 4, exhale for 4, hold for 4.',
    duration: 5,
  },
  {
    id: 'tip-2',
    title: 'Light Walk',
    description: 'Keep the pace easy and focus on nasal breathing.',
    duration: 10,
  },
  {
    id: 'tip-3',
    title: 'Sleep Wind-down',
    description:
      'Lower lights, reduce screen stimulation, and prepare tomorrow&apos;s plan.',
    duration: 20,
  },
];

const StressPage = () => {
  return (
    <main className='min-w-0'>
      <PageHeader
        eyebrow='Recovery'
        title='Stress'
        description='Recovery tools for today.'
      />

      <section className='mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]'>
        <div className='space-y-4'>
          <StressCheckInCard checkInOptions={stressCheckInOptions} />
          <StressHabitsCard initialHabits={stressHabits} />
        </div>
        <aside className='space-y-4'>
          <RecommendedResetCard recommendedReset={recommendedReset} />
          <RecoveryTipsCard tips={recoveryTips} />
        </aside>
      </section>
    </main>
  );
};

export default StressPage;

