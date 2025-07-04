export interface Holiday {
  date: string;
  name: string;
  type: 'government' | 'company';
}

export interface VacationPlan {
  startDate: string;
  endDate: string;
  totalDays: number;
  vacationDaysUsed: number;
  weekendDays: number;
  holidayDays: number;
  efficiency: number;
}

export interface UserSettings {
  availableVacationDays: number;
  usedVacationDays: number;
  companyHolidays: Holiday[];
}

export interface SavedVacationPlan {
  id: string;
  name: string;
  plan: VacationPlan;
  isBooked: boolean;
  createdAt: string;
  notes?: string;
}

export interface VacationGoal {
  id: string;
  title: string;
  description: string;
  targetDays: number;
  priority: 'low' | 'medium' | 'high';
  preferredMonths: number[];
  isFlexible: boolean;
}