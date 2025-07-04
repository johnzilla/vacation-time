import { Holiday } from '../types';

export const US_GOVERNMENT_HOLIDAYS_2024: Holiday[] = [
  { date: '2024-01-01', name: "New Year's Day", type: 'government' },
  { date: '2024-01-15', name: 'Martin Luther King Jr. Day', type: 'government' },
  { date: '2024-02-19', name: "Presidents' Day", type: 'government' },
  { date: '2024-05-27', name: 'Memorial Day', type: 'government' },
  { date: '2024-06-19', name: 'Juneteenth', type: 'government' },
  { date: '2024-07-04', name: 'Independence Day', type: 'government' },
  { date: '2024-09-02', name: 'Labor Day', type: 'government' },
  { date: '2024-10-14', name: 'Columbus Day', type: 'government' },
  { date: '2024-11-11', name: 'Veterans Day', type: 'government' },
  { date: '2024-11-28', name: 'Thanksgiving Day', type: 'government' },
  { date: '2024-11-29', name: 'Day after Thanksgiving', type: 'government' },
  { date: '2024-12-25', name: 'Christmas Day', type: 'government' },
];

export const US_GOVERNMENT_HOLIDAYS_2025: Holiday[] = [
  { date: '2025-01-01', name: "New Year's Day", type: 'government' },
  { date: '2025-01-20', name: 'Martin Luther King Jr. Day', type: 'government' },
  { date: '2025-02-17', name: "Presidents' Day", type: 'government' },
  { date: '2025-05-26', name: 'Memorial Day', type: 'government' },
  { date: '2025-06-19', name: 'Juneteenth', type: 'government' },
  { date: '2025-07-04', name: 'Independence Day', type: 'government' },
  { date: '2025-09-01', name: 'Labor Day', type: 'government' },
  { date: '2025-10-13', name: 'Columbus Day', type: 'government' },
  { date: '2025-11-11', name: 'Veterans Day', type: 'government' },
  { date: '2025-11-27', name: 'Thanksgiving Day', type: 'government' },
  { date: '2025-11-28', name: 'Day after Thanksgiving', type: 'government' },
  { date: '2025-12-25', name: 'Christmas Day', type: 'government' },
];

export const DEFAULT_COMPANY_HOLIDAYS_2024: Holiday[] = [
  { date: '2024-07-05', name: 'Company Summer Break', type: 'company' },
  { date: '2024-12-24', name: 'Christmas Eve', type: 'company' },
  { date: '2024-12-26', name: 'Boxing Day', type: 'company' },
  { date: '2024-12-27', name: 'Year-end Break', type: 'company' },
  { date: '2024-12-30', name: 'New Year Eve Break', type: 'company' },
  { date: '2024-12-31', name: "New Year's Eve", type: 'company' },
];

export const DEFAULT_COMPANY_HOLIDAYS_2025: Holiday[] = [
  { date: '2025-07-05', name: 'Company Summer Break', type: 'company' },
  { date: '2025-12-24', name: 'Christmas Eve', type: 'company' },
  { date: '2025-12-26', name: 'Boxing Day', type: 'company' },
  { date: '2025-12-27', name: 'Year-end Break', type: 'company' },
  { date: '2025-12-30', name: 'New Year Eve Break', type: 'company' },
  { date: '2025-12-31', name: "New Year's Eve", type: 'company' },
];

// Helper function to get holidays for current year
export const getCurrentYearHolidays = (year: number = new Date().getFullYear()): Holiday[] => {
  const governmentHolidays = year === 2024 ? US_GOVERNMENT_HOLIDAYS_2024 : US_GOVERNMENT_HOLIDAYS_2025;
  const companyHolidays = year === 2024 ? DEFAULT_COMPANY_HOLIDAYS_2024 : DEFAULT_COMPANY_HOLIDAYS_2025;
  return [...governmentHolidays, ...companyHolidays];
};