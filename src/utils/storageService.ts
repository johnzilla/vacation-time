import { SavedVacationPlan, VacationGoal, UserSettings } from '../types';

const STORAGE_KEYS = {
  SAVED_PLANS: 'vacation-optimizer-saved-plans',
  USER_SETTINGS: 'vacation-optimizer-user-settings',
  VACATION_GOALS: 'vacation-optimizer-vacation-goals',
} as const;

export const storageService = {
  // Saved Vacation Plans
  getSavedPlans(): SavedVacationPlan[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SAVED_PLANS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading saved plans:', error);
      return [];
    }
  },

  savePlan(plan: SavedVacationPlan): void {
    try {
      const existingPlans = this.getSavedPlans();
      const updatedPlans = [...existingPlans.filter(p => p.id !== plan.id), plan];
      localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  },

  deletePlan(planId: string): void {
    try {
      const existingPlans = this.getSavedPlans();
      const updatedPlans = existingPlans.filter(p => p.id !== planId);
      localStorage.setItem(STORAGE_KEYS.SAVED_PLANS, JSON.stringify(updatedPlans));
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  },

  // User Settings
  getUserSettings(): Partial<UserSettings> | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading user settings:', error);
      return null;
    }
  },

  saveUserSettings(settings: Partial<UserSettings>): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving user settings:', error);
    }
  },

  // Vacation Goals
  getVacationGoals(): VacationGoal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.VACATION_GOALS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading vacation goals:', error);
      return [];
    }
  },

  saveVacationGoal(goal: VacationGoal): void {
    try {
      const existingGoals = this.getVacationGoals();
      const updatedGoals = [...existingGoals.filter(g => g.id !== goal.id), goal];
      localStorage.setItem(STORAGE_KEYS.VACATION_GOALS, JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error saving vacation goal:', error);
    }
  },

  deleteVacationGoal(goalId: string): void {
    try {
      const existingGoals = this.getVacationGoals();
      const updatedGoals = existingGoals.filter(g => g.id !== goalId);
      localStorage.setItem(STORAGE_KEYS.VACATION_GOALS, JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error deleting vacation goal:', error);
    }
  },

  // Clear all data
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
};
