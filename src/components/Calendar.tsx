import React, { useState, useEffect } from 'react';
import { Holiday } from '../types';
import { parseDate, isWeekend, isSameDay } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDates: Date[];
  holidays: Holiday[];
  onDateSelect: (date: Date) => void;
  highlightedPeriod?: { start: Date; end: Date };
  navigateToDate?: Date;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDates,
  holidays,
  onDateSelect,
  highlightedPeriod,
  navigateToDate
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(navigateToDate?.getMonth() ?? today.getMonth());
  const [currentYear, setCurrentYear] = useState(navigateToDate?.getFullYear() ?? today.getFullYear());
  
  // Navigate to specific date when highlightedPeriod changes
  useEffect(() => {
    if (highlightedPeriod) {
      setCurrentMonth(highlightedPeriod.start.getMonth());
      setCurrentYear(highlightedPeriod.start.getFullYear());
    }
  }, [highlightedPeriod]);
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };
  
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
  
  const getHighlightedPosition = (date: Date): 'start' | 'middle' | 'end' | 'single' | null => {
    if (!highlightedPeriod || !isInHighlightedPeriod(date)) return null;
    
    const { start, end } = highlightedPeriod;
    const isSameDay = (d1: Date, d2: Date) => d1.toDateString() === d2.toDateString();
    
    if (isSameDay(start, end)) return 'single';
    if (isSameDay(date, start)) return 'start';
    if (isSameDay(date, end)) return 'end';
    return 'middle';
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
      const highlightPosition = getHighlightedPosition(date);
      const isPast = date < today;
      
      // Enhanced styling for highlighted periods
      let highlightClasses = '';
      if (highlighted && !selected) {
        switch (highlightPosition) {
          case 'single':
            highlightClasses = 'bg-blue-200 text-blue-900 border-2 border-blue-400';
            break;
          case 'start':
            highlightClasses = 'bg-blue-200 text-blue-900 border-2 border-blue-400 rounded-l-lg';
            break;
          case 'end':
            highlightClasses = 'bg-blue-200 text-blue-900 border-2 border-blue-400 rounded-r-lg';
            break;
          case 'middle':
            highlightClasses = 'bg-blue-100 text-blue-900 border-y-2 border-blue-300';
            break;
        }
      }
      
      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          disabled={isPast}
          className={`
            h-12 w-full text-sm font-medium transition-all duration-200 relative
            ${isPast 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'hover:bg-blue-50 hover:scale-105'
            }
            ${weekend ? 'text-blue-600' : 'text-gray-700'}
            ${holiday ? 'bg-green-100 text-green-800 border border-green-300 rounded-lg' : ''}
            ${selected ? 'bg-blue-500 text-white shadow-lg rounded-lg z-10' : ''}
            ${highlightClasses}
          `}
          title={holiday ? holiday.name : highlightedPeriod && highlighted ? 'Vacation Period' : ''}
        >
          <span className="relative z-10">{day}</span>
          {holiday && !highlighted && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500 rounded-full" />
          )}
          {weekend && !holiday && !highlighted && (
            <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-300 rounded-full" />
          )}
        </button>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800">
          {monthNames[currentMonth]} {currentYear}
        </h2>
        
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-4 text-sm mb-4">
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