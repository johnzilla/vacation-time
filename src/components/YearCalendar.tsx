import React, { useState } from 'react';
import { Holiday } from '../types';
import { parseDate, isWeekend, isSameDay } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface YearCalendarProps {
  selectedDates: Date[];
  holidays: Holiday[];
  onDateSelect: (date: Date) => void;
  highlightedPeriod?: { start: Date; end: Date };
}

export const YearCalendar: React.FC<YearCalendarProps> = ({
  selectedDates,
  holidays,
  onDateSelect,
  highlightedPeriod
}) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
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
  
  const renderMonth = (monthIndex: number) => {
    const firstDay = new Date(currentYear, monthIndex, 1);
    const lastDay = new Date(currentYear, monthIndex + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const today = new Date();
    
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, monthIndex, day);
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
            h-8 w-8 rounded text-xs font-medium transition-all duration-200 relative
            ${isPast 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'hover:bg-blue-50 hover:scale-110'
            }
            ${weekend ? 'text-blue-600' : 'text-gray-700'}
            ${holiday ? 'bg-green-100 text-green-800 border border-green-300' : ''}
            ${selected ? 'bg-blue-500 text-white shadow-lg' : ''}
            ${highlighted && !selected ? 'bg-blue-200 text-blue-800' : ''}
          `}
          title={holiday ? holiday.name : ''}
        >
          {day}
          {holiday && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
          )}
        </button>
      );
    }
    
    return (
      <div key={monthIndex} className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
          {monthNames[monthIndex]}
        </h3>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 h-6 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentYear(currentYear - 1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800">{currentYear}</h2>
        
        <button
          onClick={() => setCurrentYear(currentYear + 1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
      </div>
      
      <div className="flex items-center justify-center gap-6 text-sm mt-6">
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
  );
};
