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
  year: number = new Date().getFullYear(),
  targetConsecutiveDays: number = 7
): VacationPlan[] => {
  const plans: VacationPlan[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);
  
  // Calculate the minimum vacation days needed to achieve target consecutive days
  const generatePlansAroundHolidays = () => {
    holidays.forEach(holiday => {
      const holidayDate = parseDate(holiday.date);
      
      // Try different vacation lengths that can achieve the target consecutive days
      const minVacationDays = Math.max(1, targetConsecutiveDays - 4); // Account for weekends + holiday
      const maxVacationDays = Math.min(availableVacationDays, targetConsecutiveDays);
      
      for (let vacationLength = minVacationDays; vacationLength <= maxVacationDays; vacationLength++) {
        // Try starting vacation before the holiday
        for (let daysBefore = 0; daysBefore <= 7; daysBefore++) {
          const vacationStart = addDays(holidayDate, -daysBefore - vacationLength + 1);
          const vacationEnd = addDays(holidayDate, -daysBefore);
          
          if (vacationStart >= startDate && vacationEnd <= endDate) {
            const plan = calculateVacationEfficiency(vacationStart, vacationEnd, holidays);
            if (plan.vacationDaysUsed <= availableVacationDays && plan.totalDays >= targetConsecutiveDays) {
              plans.push(plan);
            }
          }
        }
        
        // Try starting vacation after the holiday
        for (let daysAfter = 0; daysAfter <= 7; daysAfter++) {
          const vacationStart = addDays(holidayDate, daysAfter);
          const vacationEnd = addDays(vacationStart, vacationLength - 1);
          
          if (vacationStart >= startDate && vacationEnd <= endDate) {
            const plan = calculateVacationEfficiency(vacationStart, vacationEnd, holidays);
            if (plan.vacationDaysUsed <= availableVacationDays && plan.totalDays >= targetConsecutiveDays) {
              plans.push(plan);
            }
          }
        }
        
        // Try overlapping the holiday in the middle of vacation
        const halfVacation = Math.floor(vacationLength / 2);
        const vacationStart = addDays(holidayDate, -halfVacation);
        const vacationEnd = addDays(holidayDate, vacationLength - halfVacation - 1);
        
        if (vacationStart >= startDate && vacationEnd <= endDate) {
          const plan = calculateVacationEfficiency(vacationStart, vacationEnd, holidays);
          if (plan.vacationDaysUsed <= availableVacationDays && plan.totalDays >= targetConsecutiveDays) {
            plans.push(plan);
          }
        }
      }
    });
  };
  
  // Generate plans around holidays
  generatePlansAroundHolidays();
  
  // Generate standalone vacation periods (without relying on holidays)
  const generateStandalonePlans = () => {
    const current = new Date(startDate);
    while (current <= endDate) {
      // Try vacation periods that achieve target consecutive days with minimal vacation days
      for (let vacationDays = Math.max(1, targetConsecutiveDays - 4); vacationDays <= availableVacationDays; vacationDays++) {
        // Find the best position for this vacation length to achieve target consecutive days
        for (let startOffset = 0; startOffset <= 4; startOffset++) {
          const vacationStart = addDays(current, startOffset);
          const vacationEnd = addDays(vacationStart, vacationDays - 1);
          
          if (vacationEnd <= endDate) {
            const plan = calculateVacationEfficiency(vacationStart, vacationEnd, holidays);
            if (plan.vacationDaysUsed <= availableVacationDays && plan.totalDays >= targetConsecutiveDays) {
              plans.push(plan);
            }
          }
        }
      }
      
      // Move to next week
      current.setDate(current.getDate() + 7);
    }
  };
  
  // Only generate standalone plans if we need more options
  if (plans.length < 20) {
    generateStandalonePlans();
  }
  
  // Remove duplicates and sort by efficiency
  const uniquePlans = plans.filter((plan, index, self) => 
    index === self.findIndex(p => p.startDate === plan.startDate && p.endDate === plan.endDate)
  );
  
  return uniquePlans
    .sort((a, b) => {
      // Prioritize plans that meet the target consecutive days exactly or efficiently
      const aTargetMatch = a.totalDays >= targetConsecutiveDays ? 1 : 0;
      const bTargetMatch = b.totalDays >= targetConsecutiveDays ? 1 : 0;
      
      if (aTargetMatch !== bTargetMatch) {
        return bTargetMatch - aTargetMatch;
      }
      
      // Then sort by efficiency
      return b.efficiency - a.efficiency;
    })
    .slice(0, 10); // Return top 10 recommendations
};