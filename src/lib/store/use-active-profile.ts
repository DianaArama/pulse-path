import { profiles } from '@/data/profile';
import type { GoalSettings, UserProfileRecord } from '@/types/profile';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface ActiveProfileState {
  activeProfile: UserProfileRecord | undefined;
  setActiveProfile: (id: string) => void;
  setGoals: (goals: Partial<GoalSettings>) => void;
}

export const useActiveProfile = create<ActiveProfileState>()(
  persist(
    immer((set) => ({
      activeProfile: undefined,
      setActiveProfile(id: string) {
        set({
          activeProfile: profiles.find((profile) => profile.id === id),
        });
      },
      setGoals(goals: Partial<GoalSettings>) {
        set((state) => {
          if (!state.activeProfile) {
            return state;
          }

          return {
            ...state,
            activeProfile: {
              ...state.activeProfile,
              goalSettings: {
                ...state.activeProfile.goalSettings,
                ...goals,
              },
            },
          };
        });
      },
    })),
    { name: 'active-profile' },
  ),
);
