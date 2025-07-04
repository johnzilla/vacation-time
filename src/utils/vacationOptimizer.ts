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

import { Holiday, VacationPlan } from '../types';
import { 
  parseDate, 
  getDaysBetween, 
  getWeekdaysBetween, 
  getWeekendsBetween, 
  addDays,
  formatDate 
} from './dateUtils';

export const calculateVacationEfficiency = (
  startDate: Date,
  endDate: Date,
  holidays: Holiday[]
): VacationPlan => {
  const totalDays = getDaysBetween(startDate, endDate);
  const weekendDays = getWeekendsBetween(startDate, endDate);
  
  // Count holidays that fall within the vacation period
  const holidayDays = holidays.filter(holiday => {
    const holidayDate = parseDate(holiday.date);
    return holidayDate >= startDate && holidayDate <= endDate;
  }).length;
  
  const vacationDaysUsed = getWeekdaysBetween(startDate, endDate) - holidayDays;
  const efficiency = vacationDaysUsed > 0 ? totalDays / vacationDaysUsed : 0;
  
  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    totalDays,
    vacationDaysUsed: Math.max(0, vacationDaysUsed),
    weekendDays,
    holidayDays,
    efficiency
  };
};

export const findOptimalVacationPeriods = (
  availableVacationDays: number,
  holidays: Holiday[],
  year: number = new Date().getFullYear()
): VacationPlan[] => {
  const plans: VacationPlan[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  // Generate vacation plans around holidays
  holidays.forEach(holiday => {
    const holidayDate = parseDate(holiday.date);
    
    // Try different vacation lengths around this holiday
    for (let vacationLength = 3; vacationLength <= Math.min(availableVacationDays, 10); vacationLength++) {
      // Try starting vacation before the holiday
      for (let daysBefore = 1; daysBefore <= 5; daysBefore++) {
        const vacationStart = addDays(holidayDate, -daysBefore);
        const vacationEnd = addDays(vacationStart, vacationLength - 1);
        
        if (vacationStart >= startDate && vacationEnd <= endDate) {
          const plan = calculateVacationEfficiency(vacationStart, vacationEnd, holidays);
          if (plan.vacationDaysUsed <= availableVacationDays) {
            plans.push(plan);
          }
        }
      }
      
      // Try starting vacation after the holiday
      for (let daysAfter = 0; daysAfter <= 3; daysAfter++) {
        const vacationStart = addDays(holidayDate, daysAfter);
        const vacationEnd = addDays(vacationStart, vacationLength - 1);
        
        if (vacationStart >= startDate && vacationEnd <= endDate) {
          const plan = calculateVacationEfficiency(vacationStart, vacationEnd, holidays);
          if (plan.vacationDaysUsed <= availableVacationDays) {
            plans.push(plan);
          }
        }
      }
    }
  });
  
  // Remove duplicates and sort by efficiency
  const uniquePlans = plans.filter((plan, index, self) => 
    index === self.findIndex(p => p.startDate === plan.startDate && p.endDate === plan.endDate)
  );
  
  return uniquePlans
    .sort((a, b) => b.efficiency - a.efficiency)
    .slice(0, 10); // Return top 10 recommendations
};