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

import { VacationPlan } from '../types';
import { parseDate } from './dateUtils';

/**
 * Formats a date for iCal format (YYYYMMDD)
 */
const formatICalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Formats a datetime for iCal format (YYYYMMDDTHHMMSSZ)
 */
const formatICalDateTime = (date: Date): string => {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

/**
 * Generates a unique identifier for the event
 */
const generateUID = (startDate: string, endDate: string): string => {
  const timestamp = Date.now();
  return `vacation-${startDate}-${endDate}-${timestamp}@vacation-optimizer.app`;
};

/**
 * Escapes special characters for iCal text fields
 */
const escapeICalText = (text: string): string => {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
};

/**
 * Generates iCal content for a vacation plan
 */
export const generateICalContent = (plan: VacationPlan): string => {
  const startDate = parseDate(plan.startDate);
  const endDate = parseDate(plan.endDate);
  
  // For all-day events, we need to add 1 day to the end date in iCal format
  const iCalEndDate = new Date(endDate);
  iCalEndDate.setDate(iCalEndDate.getDate() + 1);
  
  const now = new Date();
  const uid = generateUID(plan.startDate, plan.endDate);
  
  const title = `Vacation - ${plan.totalDays} days off`;
  const description = `Optimized vacation period using ${plan.vacationDaysUsed} vacation days for ${plan.totalDays} total days off. Efficiency: ${plan.efficiency.toFixed(1)}x\\n\\nIncludes ${plan.weekendDays} weekend days and ${plan.holidayDays} holiday days.\\n\\nGenerated by Vacation Optimizer`;
  
  const iCalContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vacation Optimizer//Vacation Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;VALUE=DATE:${formatICalDate(startDate)}`,
    `DTEND;VALUE=DATE:${formatICalDate(iCalEndDate)}`,
    `DTSTAMP:${formatICalDateTime(now)}`,
    `CREATED:${formatICalDateTime(now)}`,
    `LAST-MODIFIED:${formatICalDateTime(now)}`,
    `SUMMARY:${escapeICalText(title)}`,
    `DESCRIPTION:${escapeICalText(description)}`,
    'STATUS:TENTATIVE',
    'TRANSP:TRANSPARENT',
    'CATEGORIES:VACATION,PERSONAL',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return iCalContent;
};

/**
 * Downloads an iCal file for the vacation plan
 */
export const downloadICalFile = (plan: VacationPlan): void => {
  const iCalContent = generateICalContent(plan);
  const blob = new Blob([iCalContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `vacation-${plan.startDate}-to-${plan.endDate}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the object URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Generates a Google Calendar URL for the vacation plan
 */
export const generateGoogleCalendarUrl = (plan: VacationPlan): string => {
  const startDate = parseDate(plan.startDate);
  const endDate = parseDate(plan.endDate);
  
  // Google Calendar expects end date to be exclusive (next day)
  const googleEndDate = new Date(endDate);
  googleEndDate.setDate(googleEndDate.getDate() + 1);
  
  const title = `Vacation - ${plan.totalDays} days off`;
  const details = `Optimized vacation period using ${plan.vacationDaysUsed} vacation days for ${plan.totalDays} total days off. Efficiency: ${plan.efficiency.toFixed(1)}x\n\nIncludes ${plan.weekendDays} weekend days and ${plan.holidayDays} holiday days.\n\nGenerated by Vacation Optimizer`;
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatICalDate(startDate)}/${formatICalDate(googleEndDate)}`,
    details: details,
    ctz: 'UTC'
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generates an Outlook.com URL for the vacation plan
 */
export const generateOutlookUrl = (plan: VacationPlan): string => {
  const startDate = parseDate(plan.startDate);
  const endDate = parseDate(plan.endDate);
  
  const title = `Vacation - ${plan.totalDays} days off`;
  const body = `Optimized vacation period using ${plan.vacationDaysUsed} vacation days for ${plan.totalDays} total days off. Efficiency: ${plan.efficiency.toFixed(1)}x\n\nIncludes ${plan.weekendDays} weekend days and ${plan.holidayDays} holiday days.\n\nGenerated by Vacation Optimizer`;
  
  const params = new URLSearchParams({
    subject: title,
    body: body,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    allday: 'true'
  });
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};
