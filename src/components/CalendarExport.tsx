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

import React, { useState } from 'react';
import { VacationPlan } from '../types';
import { downloadICalFile, generateGoogleCalendarUrl, generateOutlookUrl } from '../utils/calendarExport';
import { Download, Calendar, ExternalLink, CheckCircle } from 'lucide-react';

interface CalendarExportProps {
  plan: VacationPlan;
  className?: string;
}

export const CalendarExport: React.FC<CalendarExportProps> = ({ plan, className = '' }) => {
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  const handleICalDownload = () => {
    try {
      downloadICalFile(plan);
      setExportStatus('iCal file downloaded successfully!');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Error downloading iCal file:', error);
      setExportStatus('Error downloading file. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const handleGoogleCalendar = () => {
    try {
      const url = generateGoogleCalendarUrl(plan);
      window.open(url, '_blank', 'noopener,noreferrer');
      setExportStatus('Opened Google Calendar!');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Error opening Google Calendar:', error);
      setExportStatus('Error opening Google Calendar. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const handleOutlookCalendar = () => {
    try {
      const url = generateOutlookUrl(plan);
      window.open(url, '_blank', 'noopener,noreferrer');
      setExportStatus('Opened Outlook Calendar!');
      setTimeout(() => setExportStatus(null), 3000);
    } catch (error) {
      console.error('Error opening Outlook Calendar:', error);
      setExportStatus('Error opening Outlook Calendar. Please try again.');
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  if (!showExportOptions) {
    return (
      <div className={className}>
        <button
          onClick={() => setShowExportOptions(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
        >
          <Calendar className="w-4 h-4" />
          Export to Calendar
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Export Status */}
      {exportStatus && (
        <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">{exportStatus}</span>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800">Export Vacation Plan</h4>
          <button
            onClick={() => setShowExportOptions(false)}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Cancel
          </button>
        </div>
        
        <div className="space-y-3">
          {/* iCal Download */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Download className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Download iCal File</div>
                <div className="text-sm text-gray-600">Works with most calendar apps</div>
              </div>
            </div>
            <button
              onClick={handleICalDownload}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              Download
            </button>
          </div>

          {/* Google Calendar */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ExternalLink className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Google Calendar</div>
                <div className="text-sm text-gray-600">Open directly in Google Calendar</div>
              </div>
            </div>
            <button
              onClick={handleGoogleCalendar}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
            >
              Open
            </button>
          </div>

          {/* Outlook Calendar */}
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ExternalLink className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="font-medium text-gray-800">Outlook Calendar</div>
                <div className="text-sm text-gray-600">Open directly in Outlook.com</div>
              </div>
            </div>
            <button
              onClick={handleOutlookCalendar}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
            >
              Open
            </button>
          </div>
        </div>

        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-800">
            <strong>Tip:</strong> The iCal file can be imported into Apple Calendar, Outlook desktop, 
            Thunderbird, and most other calendar applications.
          </div>
        </div>
      </div>
    </div>
  );
};
