import React from 'react';
import { VacationPlan } from '../types';
import { TrendingUp, Calendar, Clock, Star, Target } from 'lucide-react';

interface VacationRecommendationsProps {
  recommendations: VacationPlan[];
  targetConsecutiveDays?: number;
  onPlanSelect: (plan: VacationPlan) => void;
}

export const VacationRecommendations: React.FC<VacationRecommendationsProps> = ({
  recommendations,
  targetConsecutiveDays = 7,
  onPlanSelect
}) => {
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startFormat = start.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    const endFormat = end.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    return `${startFormat} - ${endFormat}`;
  };
  
  const getEfficiencyColor = (efficiency: number): string => {
    if (efficiency >= 2.5) return 'text-green-600 bg-green-100';
    if (efficiency >= 2.0) return 'text-blue-600 bg-blue-100';
    if (efficiency >= 1.5) return 'text-orange-600 bg-orange-100';
    return 'text-gray-600 bg-gray-100';
  };
  
  const getEfficiencyLabel = (efficiency: number): string => {
    if (efficiency >= 2.5) return 'Excellent';
    if (efficiency >= 2.0) return 'Great';
    if (efficiency >= 1.5) return 'Good';
    return 'Fair';
  };
  
  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Recommendations Available
          </h3>
          <p className="text-gray-500">
            Set your available vacation days to get personalized recommendations.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Smart Recommendations</h2>
      </div>
      
      <div className="space-y-4">
        {recommendations.slice(0, 5).map((plan, index) => (
          <div
            key={`${plan.startDate}-${plan.endDate}`}
            className="group bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => onPlanSelect(plan)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {index === 0 && (
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-xs font-semibold">TOP PICK</span>
                  </div>
                )}
                {plan.totalDays >= targetConsecutiveDays && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Target className="w-4 h-4" />
                    <span className="text-xs font-semibold">TARGET MET</span>
                  </div>
                )}
                <span className="text-lg font-bold text-gray-800">
                  {formatDateRange(plan.startDate, plan.endDate)}
                </span>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getEfficiencyColor(plan.efficiency)}`}>
                {getEfficiencyLabel(plan.efficiency)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{plan.totalDays}</div>
                <div className="text-xs text-gray-500">Total Days Off</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{plan.vacationDaysUsed}</div>
                <div className="text-xs text-gray-500">Vacation Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{plan.weekendDays + plan.holidayDays}</div>
                <div className="text-xs text-gray-500">Free Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{plan.efficiency.toFixed(1)}x</div>
                <div className="text-xs text-gray-500">Efficiency</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <span>🎯 {plan.weekendDays} weekends</span>
                <span>🎉 {plan.holidayDays} holidays</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700">
                <Clock className="w-4 h-4" />
                <span className="font-medium">View Details</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-1 bg-blue-100 rounded-lg">
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">How Efficiency Works</h4>
            <p className="text-sm text-blue-700">
              Efficiency shows how many total days off you get per vacation day used. 
              Higher efficiency means more bang for your vacation buck!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};