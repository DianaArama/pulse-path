export type WorkoutIntensity = 'Low' | 'Medium' | 'High';

export type WorkoutDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type Workout = {
  id: string;
  name: string;
  exercises: string[];
  duration: number;
  intensity: WorkoutIntensity;
  calories: number;
  day: WorkoutDay;
};
