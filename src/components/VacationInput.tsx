import React, { useState } from 'react';
import { Calendar, Plus, Minus, Globe } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { CountryCode } from '../data/countryHolidays';

interface VacationInputProps {
  availableVacationDays: number;
  usedVacationDays: number;
  selectedCountry: CountryCode;
  targetConsecutiveDays: number;
  onVacationDaysChange: (available: number, used: number) => void;
  onCountryChange: (country: CountryCode) => void;
  onTargetDaysChange: (days: number) => void;
}

export const VacationInput: React.FC<VacationInputProps> = ({
  availableVacationDays,
  usedVacationDays,
  selectedCountry,
  targetConsecutiveDays,
  onVacationDaysChange,
  onCountryChange,
  onTargetDaysChange
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
  
  const adjustTargetDays = (amount: number) => {
    const newTarget = Math.max(1, Math.min(remainingDays, targetConsecutiveDays + amount));
    onTargetDaysChange(newTarget);
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
        {/* Country Selection */}
        <div className="bg-gray-50 rounded-xl p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <Globe className="inline w-4 h-4 mr-2" />
            Country/Region Holidays
          </label>
          <CountrySelector
            selectedCountry={selectedCountry}
            onCountryChange={onCountryChange}
          />
        </div>
        
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
        
        {/* Target Consecutive Days */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <label className="block text-sm font-semibold text-blue-800 mb-3">
            Target Vacation Length (Days in a Row)
          </label>
          
          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[3, 5, 7, 10, 14].map((days) => (
              <button
                key={days}
                onClick={() => onTargetDaysChange(days)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  targetConsecutiveDays === days
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-600 hover:bg-blue-100'
                }`}
              >
                {days} days
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustTargetDays(-1)}
                className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow text-blue-600 hover:text-blue-800"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-2xl font-bold text-blue-800 min-w-[3rem] text-center">
                {targetConsecutiveDays}
              </span>
              <button
                onClick={() => adjustTargetDays(1)}
                className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow text-blue-600 hover:text-blue-800"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <span className="text-sm text-blue-600">days off</span>
          </div>
          <div className="mt-2">
            <p className="text-xs text-blue-700">
              Find vacations that give you at least {targetConsecutiveDays} consecutive days off
            </p>
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