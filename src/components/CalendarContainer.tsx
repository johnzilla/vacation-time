import React, { useState, useEffect } from 'react';
import { CalendarViewToggle } from './CalendarViewToggle';
import { Calendar } from './Calendar';
import { QuarterCalendar } from './QuarterCalendar';
import { YearCalendar } from './YearCalendar';
import { TouchSwipe } from './TouchSwipe';
import { Holiday } from '../types';

type CalendarView = 'month' | 'quarter' | 'year';

interface CalendarContainerProps {
  selectedDates: Date[];
  holidays: Holiday[];
  onDateSelect: (date: Date) => void;
  highlightedPeriod?: { start: Date; end: Date };
  navigateToDate?: Date;
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  selectedDates,
  holidays,
  onDateSelect,
  highlightedPeriod,
  navigateToDate
}) => {
  const [currentView, setCurrentView] = useState<CalendarView>('month');

  // Auto-switch to appropriate view based on highlighted period
  useEffect(() => {
    if (highlightedPeriod) {
      const start = highlightedPeriod.start;
      const end = highlightedPeriod.end;
      const daysDifference = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      // If vacation spans more than 2 months, show year view
      if (start.getMonth() !== end.getMonth() && 
          (end.getMonth() - start.getMonth() > 1 || end.getFullYear() !== start.getFullYear())) {
        setCurrentView('year');
      }
      // If vacation spans 2 months or is longer than 2 weeks, show quarter view
      else if (start.getMonth() !== end.getMonth() || daysDifference > 14) {
        setCurrentView('quarter');
      }
      // Otherwise, month view is fine
      else {
        setCurrentView('month');
      }
    }
  }, [highlightedPeriod]);

  const renderCalendar = () => {
    const calendarComponent = (() => {
      switch (currentView) {
        case 'month':
        return (
          <Calendar
            selectedDates={selectedDates}
            holidays={holidays}
            onDateSelect={onDateSelect}
            highlightedPeriod={highlightedPeriod}
            navigateToDate={navigateToDate}
          />
        );
      case 'quarter':
        return (
          <QuarterCalendar
            selectedDates={selectedDates}
            holidays={holidays}
            onDateSelect={onDateSelect}
            highlightedPeriod={highlightedPeriod}
            navigateToDate={navigateToDate}
          />
        );
      case 'year':
        return (
          <YearCalendar
            selectedDates={selectedDates}
            holidays={holidays}
            onDateSelect={onDateSelect}
            highlightedPeriod={highlightedPeriod}
            navigateToDate={navigateToDate}
          />
        );
      default:
        return null;
      }
    })();

    return (
      <TouchSwipe>
        {calendarComponent}
      </TouchSwipe>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <CalendarViewToggle
          currentView={currentView}
          onViewChange={setCurrentView}
        />
      </div>
      
      {renderCalendar()}
    </div>
  );
};
