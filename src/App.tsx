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

import { useState, useEffect } from 'react';
import { CalendarContainer } from './components/CalendarContainer';
import { VacationInput } from './components/VacationInput';
import { VacationRecommendations } from './components/VacationRecommendations';
import { MobileDrawer } from './components/MobileDrawer';
import { getCountryHolidays, CountryCode } from './data/countryHolidays';
import { findOptimalVacationPeriods } from './utils/vacationOptimizer';
import { parseDate } from './utils/dateUtils';
import { Holiday, VacationPlan } from './types';
import { Plane, Target, Calendar as CalendarIcon } from 'lucide-react';

function App() {
  const [availableVacationDays, setAvailableVacationDays] = useState(20);
  const [usedVacationDays, setUsedVacationDays] = useState(5);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('US');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [recommendations, setRecommendations] = useState<VacationPlan[]>([]);
  const [highlightedPeriod, setHighlightedPeriod] = useState<{ start: Date; end: Date } | undefined>();
  
  const allHolidays: Holiday[] = getCountryHolidays(selectedCountry);
  
  useEffect(() => {
    const remainingDays = availableVacationDays - usedVacationDays;
    if (remainingDays > 0) {
      const newRecommendations = findOptimalVacationPeriods(remainingDays, allHolidays);
      setRecommendations(newRecommendations);
    } else {
      setRecommendations([]);
    }
  }, [availableVacationDays, usedVacationDays, selectedCountry]);
  
  const handleVacationDaysChange = (available: number, used: number) => {
    setAvailableVacationDays(available);
    setUsedVacationDays(used);
  };
  
  const handleDateSelect = (date: Date) => {
    setSelectedDates(prev => {
      const isSelected = prev.some(selectedDate => 
        selectedDate.toDateString() === date.toDateString()
      );
      
      if (isSelected) {
        return prev.filter(selectedDate => 
          selectedDate.toDateString() !== date.toDateString()
        );
      } else {
        return [...prev, date];
      }
    });
  };
  
  const handlePlanSelect = (plan: VacationPlan) => {
    const startDate = parseDate(plan.startDate);
    const endDate = parseDate(plan.endDate);
    
    setHighlightedPeriod({ start: startDate, end: endDate });
    
    // Generate all dates in the range and select them
    const dates: Date[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    setSelectedDates(dates);
  };
  
  const clearHighlight = () => {
    setHighlightedPeriod(undefined);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Plane className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vacation Optimizer</h1>
                <p className="text-sm text-gray-600">Maximize your time off with smart planning</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Smart Recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                <span>Holiday Integration</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input and Recommendations */}
          <div className="lg:col-span-1 space-y-8">
            {/* Desktop layout */}
            <div className="hidden lg:block space-y-8">
              <VacationInput
                availableVacationDays={availableVacationDays}
                usedVacationDays={usedVacationDays}
                selectedCountry={selectedCountry}
                onVacationDaysChange={handleVacationDaysChange}
                onCountryChange={setSelectedCountry}
              />
              
              <VacationRecommendations
                recommendations={recommendations}
                onPlanSelect={handlePlanSelect}
              />
            </div>
            
            {/* Mobile layout with drawers */}
            <div className="lg:hidden space-y-4">
              <MobileDrawer title="Vacation Settings" defaultOpen={true}>
                <VacationInput
                  availableVacationDays={availableVacationDays}
                  usedVacationDays={usedVacationDays}
                  selectedCountry={selectedCountry}
                  onVacationDaysChange={handleVacationDaysChange}
                  onCountryChange={setSelectedCountry}
                />
              </MobileDrawer>
              
              <MobileDrawer title="Smart Recommendations">
                <VacationRecommendations
                  recommendations={recommendations}
                  onPlanSelect={handlePlanSelect}
                />
              </MobileDrawer>
            </div>
          </div>
          
          {/* Right Column - Calendar */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {highlightedPeriod && (
                <div className="bg-white rounded-2xl shadow-xl p-4 border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Viewing Recommended Period
                      </h3>
                      <p className="text-sm text-gray-600">
                        {highlightedPeriod.start.toLocaleDateString()} - {highlightedPeriod.end.toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={clearHighlight}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
              
              <CalendarContainer
                selectedDates={selectedDates}
                holidays={allHolidays}
                onDateSelect={handleDateSelect}
                highlightedPeriod={highlightedPeriod}
              />
              
              {selectedDates.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Selected Vacation Days ({selectedDates.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedDates
                      .sort((a, b) => a.getTime() - b.getTime())
                      .map((date, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {date.toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Plan smarter, vacation better. Maximize your time off with intelligent scheduling.
            </p>
            <p className="text-xs text-gray-500">
              © 2025 John Turner. Licensed under the Apache License, Version 2.0.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;