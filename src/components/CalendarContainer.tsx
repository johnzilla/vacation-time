import React, { useState } from 'react';
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
}

export const CalendarContainer: React.FC<CalendarContainerProps> = ({
  selectedDates,
  holidays,
  onDateSelect,
  highlightedPeriod
}) => {
  const [currentView, setCurrentView] = useState<CalendarView>('month');

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
            />
          );
        case 'quarter':
          return (
            <QuarterCalendar
              selectedDates={selectedDates}
              holidays={holidays}
              onDateSelect={onDateSelect}
              highlightedPeriod={highlightedPeriod}
            />
          );
        case 'year':
          return (
            <YearCalendar
              selectedDates={selectedDates}
              holidays={holidays}
              onDateSelect={onDateSelect}
              highlightedPeriod={highlightedPeriod}
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
