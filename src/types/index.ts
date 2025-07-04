/*
 * Copyright 2025 John Turner
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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