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