import React, { useState, useEffect } from 'react';
import { Holiday } from '../types';
import { parseDate, isWeekend, isSameDay } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface QuarterCalendarProps {
  selectedDates: Date[];
  holidays: Holiday[];
  onDateSelect: (date: Date) => void;
  highlightedPeriod?: { start: Date; end: Date };
  navigateToDate?: Date;
}

export const QuarterCalendar: React.FC<QuarterCalendarProps> = ({
  selectedDates,
  holidays,
  onDateSelect,
  highlightedPeriod,
  navigateToDate
}) => {
  const [currentYear, setCurrentYear] = useState(navigateToDate?.getFullYear() ?? new Date().getFullYear());
  const [currentQuarter, setCurrentQuarter] = useState(
    navigateToDate ? Math.floor(navigateToDate.getMonth() / 3) : Math.floor(new Date().getMonth() / 3)
  );
  
  // Navigate to specific date when highlightedPeriod changes
  useEffect(() => {
    if (highlightedPeriod) {
      const startQuarter = Math.floor(highlightedPeriod.start.getMonth() / 3);
      setCurrentQuarter(startQuarter);
      setCurrentYear(highlightedPeriod.start.getFullYear());
    }
  }, [highlightedPeriod]);
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const quarterNames = ['Q1', 'Q2', 'Q3', 'Q4'];
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
  
  const getQuarterMonths = (quarter: number): number[] => {
    return [quarter * 3, quarter * 3 + 1, quarter * 3 + 2];
  };
  
  const navigateQuarter = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentQuarter === 0) {
        setCurrentQuarter(3);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentQuarter(currentQuarter - 1);
      }
    } else {
      if (currentQuarter === 3) {
        setCurrentQuarter(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentQuarter(currentQuarter + 1);
      }
    }
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
      days.push(<div key={`empty-${i}`} className="h-10" />);
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
            h-10 w-full rounded-lg text-sm font-medium transition-all duration-200 relative
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
          {day}
          {holiday && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full" />
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
  
  const quarterMonths = getQuarterMonths(currentQuarter);
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateQuarter('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800">
          {quarterNames[currentQuarter]} {currentYear}
        </h2>
        
        <button
          onClick={() => navigateQuarter('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quarterMonths.map(monthIndex => renderMonth(monthIndex))}
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
