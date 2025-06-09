import React, { useState } from 'react';
import { Calendar, Plus, Minus } from 'lucide-react';

interface VacationInputProps {
  availableVacationDays: number;
  usedVacationDays: number;
  onVacationDaysChange: (available: number, used: number) => void;
}

export const VacationInput: React.FC<VacationInputProps> = ({
  availableVacationDays,
  usedVacationDays,
  onVacationDaysChange
}) => {
  const remainingDays = availableVacationDays - usedVacationDays;
  
  const adjustVacationDays = (amount: number) => {
    const newAvailable = Math.max(0, Math.min(50, availableVacationDays + amount));
    onVacationDaysChange(newAvailable, usedVacationDays);
  };
  
  const adjustUsedDays = (amount: number) => {
    const newUsed = Math.max(0, Math.min(availableVacationDays, usedVacationDays + amount));
    onVacationDaysChange(availableVacationDays, newUsed);
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Vacation Days</h2>
      </div>
      
      <div className="space-y-6">
        {/* Total Available Days */}
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Total Vacation Days Available
          </label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustVacationDays(-1)}
                className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-800"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-2xl font-bold text-gray-800 min-w-[3rem] text-center">
                {availableVacationDays}
              </span>
              <button
                onClick={() => adjustVacationDays(1)}
                className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500">days per year</span>
          </div>
        </div>
        
        {/* Used Days */}
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Vacation Days Already Used
          </label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustUsedDays(-1)}
                className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-800"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-2xl font-bold text-red-600 min-w-[3rem] text-center">
                {usedVacationDays}
              </span>
              <button
                onClick={() => adjustUsedDays(1)}
                className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow text-gray-600 hover:text-gray-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-gray-500">days used</span>
          </div>
        </div>
        
        {/* Remaining Days Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-700">
              Remaining Days
            </span>
            <span className="text-3xl font-bold text-green-600">
              {remainingDays}
            </span>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(remainingDays / availableVacationDays) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0 days</span>
              <span>{availableVacationDays} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};