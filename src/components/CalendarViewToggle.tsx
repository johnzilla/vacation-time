import React from 'react';
import { Calendar, Grid3x3, CalendarDays } from 'lucide-react';

type CalendarView = 'month' | 'quarter' | 'year';

interface CalendarViewToggleProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export const CalendarViewToggle: React.FC<CalendarViewToggleProps> = ({
  currentView,
  onViewChange
}) => {
  const views: { key: CalendarView; label: string; icon: React.ReactNode }[] = [
    { key: 'month', label: 'Month', icon: <Calendar className="w-4 h-4" /> },
    { key: 'quarter', label: 'Quarter', icon: <Grid3x3 className="w-4 h-4" /> },
    { key: 'year', label: 'Year', icon: <CalendarDays className="w-4 h-4" /> },
  ];

  return (
    <div className="inline-flex rounded-lg bg-gray-100 p-1">
      {views.map((view) => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
            ${currentView === view.key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
            }
          `}
        >
          {view.icon}
          <span className="hidden sm:inline">{view.label}</span>
        </button>
      ))}
    </div>
  );
};
