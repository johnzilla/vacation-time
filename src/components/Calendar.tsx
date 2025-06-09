import React from 'react';
import { Holiday } from '../types';
import { parseDate, isWeekend, isSameDay } from '../utils/dateUtils';

interface CalendarProps {
  selectedDates: Date[];
  holidays: Holiday[];
  onDateSelect: (date: Date) => void;
  highlightedPeriod?: { start: Date; end: Date };
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDates,
  holidays,
  onDateSelect,
  highlightedPeriod
}) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const isHoliday = (date: Date): Holiday | undefined => {
    return holidays.find(holiday => isSameDay(parseDate(holiday.date), date));
  };
  
  const isSelected = (date: Date): boolean => {
    return selectedDates.some(selectedDate => isSameDay(selectedDate, date));
  };
  
  const isInHighlightedPeriod = (date: Date): boolean => {
    if (!highlightedPeriod) return false;
    return date >= highlightedPeriod.start && date <= highlightedPeriod.end;
  };
  
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const weekend = isWeekend(date);
      const holiday = isHoliday(date);
      const selected = isSelected(date);
      const highlighted = isInHighlightedPeriod(date);
      const isPast = date < today;
      
      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          disabled={isPast}
          className={`
            h-12 w-full rounded-lg text-sm font-medium transition-all duration-200 relative
            ${isPast 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'hover:bg-blue-50 hover:scale-105'
            }
            ${weekend ? 'text-blue-600' : 'text-gray-700'}
            ${holiday ? 'bg-green-100 text-green-800 border border-green-300' : ''}
            ${selected ? 'bg-blue-500 text-white shadow-lg' : ''}
            ${highlighted && !selected ? 'bg-blue-200 text-blue-800' : ''}
          `}
          title={holiday ? holiday.name : ''}
        >
          <span className="relative z-10">{day}</span>
          {holiday && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500 rounded-full" />
          )}
          {weekend && !holiday && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-300 rounded-full" />
          )}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-blue-300 rounded-full" />
            <span className="text-gray-600">Weekends</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1 bg-green-500 rounded-full" />
            <span className="text-gray-600">Holidays</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-gray-600">Selected</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {renderCalendarDays()}
      </div>
    </div>
  );
};