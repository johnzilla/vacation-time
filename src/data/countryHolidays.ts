import { Holiday } from '../types';

export const COUNTRY_HOLIDAYS = {
  US: {
    name: 'United States',
    flag: '🇺🇸',
    holidays: [
      { date: '2025-01-01', name: "New Year's Day", type: 'government' as const },
      { date: '2025-01-20', name: 'Martin Luther King Jr. Day', type: 'government' as const },
      { date: '2025-02-17', name: "Presidents' Day", type: 'government' as const },
      { date: '2025-05-26', name: 'Memorial Day', type: 'government' as const },
      { date: '2025-06-19', name: 'Juneteenth', type: 'government' as const },
      { date: '2025-07-04', name: 'Independence Day', type: 'government' as const },
      { date: '2025-09-01', name: 'Labor Day', type: 'government' as const },
      { date: '2025-10-13', name: 'Columbus Day', type: 'government' as const },
      { date: '2025-11-11', name: 'Veterans Day', type: 'government' as const },
      { date: '2025-11-27', name: 'Thanksgiving Day', type: 'government' as const },
      { date: '2025-11-28', name: 'Day after Thanksgiving', type: 'government' as const },
      { date: '2025-12-25', name: 'Christmas Day', type: 'government' as const },
    ]
  },
  CA: {
    name: 'Canada',
    flag: '🇨🇦',
    holidays: [
      { date: '2025-01-01', name: "New Year's Day", type: 'government' as const },
      { date: '2025-02-17', name: 'Family Day', type: 'government' as const },
      { date: '2025-04-18', name: 'Good Friday', type: 'government' as const },
      { date: '2025-05-19', name: 'Victoria Day', type: 'government' as const },
      { date: '2025-07-01', name: 'Canada Day', type: 'government' as const },
      { date: '2025-09-01', name: 'Labour Day', type: 'government' as const },
      { date: '2025-10-13', name: 'Thanksgiving Day', type: 'government' as const },
      { date: '2025-11-11', name: 'Remembrance Day', type: 'government' as const },
      { date: '2025-12-25', name: 'Christmas Day', type: 'government' as const },
      { date: '2025-12-26', name: 'Boxing Day', type: 'government' as const },
    ]
  },
  UK: {
    name: 'United Kingdom',
    flag: '🇬🇧',
    holidays: [
      { date: '2025-01-01', name: "New Year's Day", type: 'government' as const },
      { date: '2025-04-18', name: 'Good Friday', type: 'government' as const },
      { date: '2025-04-21', name: 'Easter Monday', type: 'government' as const },
      { date: '2025-05-05', name: 'Early May Bank Holiday', type: 'government' as const },
      { date: '2025-05-26', name: 'Spring Bank Holiday', type: 'government' as const },
      { date: '2025-08-25', name: 'Summer Bank Holiday', type: 'government' as const },
      { date: '2025-12-25', name: 'Christmas Day', type: 'government' as const },
      { date: '2025-12-26', name: 'Boxing Day', type: 'government' as const },
    ]
  },
  AU: {
    name: 'Australia',
    flag: '🇦🇺',
    holidays: [
      { date: '2025-01-01', name: "New Year's Day", type: 'government' as const },
      { date: '2025-01-27', name: 'Australia Day', type: 'government' as const },
      { date: '2025-04-18', name: 'Good Friday', type: 'government' as const },
      { date: '2025-04-19', name: 'Easter Saturday', type: 'government' as const },
      { date: '2025-04-21', name: 'Easter Monday', type: 'government' as const },
      { date: '2025-04-25', name: 'ANZAC Day', type: 'government' as const },
      { date: '2025-06-09', name: "King's Birthday", type: 'government' as const },
      { date: '2025-12-25', name: 'Christmas Day', type: 'government' as const },
      { date: '2025-12-26', name: 'Boxing Day', type: 'government' as const },
    ]
  },
  DE: {
    name: 'Germany',
    flag: '🇩🇪',
    holidays: [
      { date: '2025-01-01', name: 'Neujahr', type: 'government' as const },
      { date: '2025-04-18', name: 'Karfreitag', type: 'government' as const },
      { date: '2025-04-21', name: 'Ostermontag', type: 'government' as const },
      { date: '2025-05-01', name: 'Tag der Arbeit', type: 'government' as const },
      { date: '2025-05-29', name: 'Christi Himmelfahrt', type: 'government' as const },
      { date: '2025-06-09', name: 'Pfingstmontag', type: 'government' as const },
      { date: '2025-10-03', name: 'Tag der Deutschen Einheit', type: 'government' as const },
      { date: '2025-12-25', name: 'Weihnachtstag', type: 'government' as const },
      { date: '2025-12-26', name: 'Zweiter Weihnachtstag', type: 'government' as const },
    ]
  },
  FR: {
    name: 'France',
    flag: '🇫🇷',
    holidays: [
      { date: '2025-01-01', name: 'Jour de l\'An', type: 'government' as const },
      { date: '2025-04-21', name: 'Lundi de Pâques', type: 'government' as const },
      { date: '2025-05-01', name: 'Fête du Travail', type: 'government' as const },
      { date: '2025-05-08', name: 'Fête de la Victoire', type: 'government' as const },
      { date: '2025-05-29', name: 'Ascension', type: 'government' as const },
      { date: '2025-06-09', name: 'Lundi de Pentecôte', type: 'government' as const },
      { date: '2025-07-14', name: 'Fête Nationale', type: 'government' as const },
      { date: '2025-08-15', name: 'Assomption', type: 'government' as const },
      { date: '2025-11-01', name: 'Toussaint', type: 'government' as const },
      { date: '2025-11-11', name: 'Armistice', type: 'government' as const },
      { date: '2025-12-25', name: 'Noël', type: 'government' as const },
    ]
  },
  JP: {
    name: 'Japan',
    flag: '🇯🇵',
    holidays: [
      { date: '2025-01-01', name: 'New Year\'s Day', type: 'government' as const },
      { date: '2025-01-13', name: 'Coming of Age Day', type: 'government' as const },
      { date: '2025-02-11', name: 'National Foundation Day', type: 'government' as const },
      { date: '2025-02-23', name: 'Emperor\'s Birthday', type: 'government' as const },
      { date: '2025-03-20', name: 'Vernal Equinox Day', type: 'government' as const },
      { date: '2025-04-29', name: 'Showa Day', type: 'government' as const },
      { date: '2025-05-03', name: 'Constitution Memorial Day', type: 'government' as const },
      { date: '2025-05-04', name: 'Greenery Day', type: 'government' as const },
      { date: '2025-05-05', name: 'Children\'s Day', type: 'government' as const },
      { date: '2025-07-21', name: 'Marine Day', type: 'government' as const },
      { date: '2025-08-11', name: 'Mountain Day', type: 'government' as const },
      { date: '2025-09-15', name: 'Respect for the Aged Day', type: 'government' as const },
      { date: '2025-09-23', name: 'Autumnal Equinox Day', type: 'government' as const },
      { date: '2025-10-13', name: 'Sports Day', type: 'government' as const },
      { date: '2025-11-03', name: 'Culture Day', type: 'government' as const },
      { date: '2025-11-23', name: 'Labour Thanksgiving Day', type: 'government' as const },
    ]
  },
};

export type CountryCode = keyof typeof COUNTRY_HOLIDAYS;

export const getCountryHolidays = (countryCode: CountryCode): Holiday[] => {
  return COUNTRY_HOLIDAYS[countryCode]?.holidays || [];
};

export const getCountryNames = (): Array<{ code: CountryCode; name: string; flag: string }> => {
  return Object.entries(COUNTRY_HOLIDAYS).map(([code, data]) => ({
    code: code as CountryCode,
    name: data.name,
    flag: data.flag,
  }));
};
