import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CountryCode, getCountryNames } from '../data/countryHolidays';

interface CountrySelectorProps {
  selectedCountry: CountryCode;
  onCountryChange: (country: CountryCode) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onCountryChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const countries = getCountryNames();
  const selectedCountryData = countries.find(c => c.code === selectedCountry);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 transition-colors min-w-48"
      >
        <span className="text-xl">{selectedCountryData?.flag}</span>
        <span className="flex-1 text-left font-medium text-gray-700">
          {selectedCountryData?.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => {
                  onCountryChange(country.code);
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl">{country.flag}</span>
                <span className="flex-1 font-medium text-gray-700">{country.name}</span>
                {selectedCountry === country.code && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
