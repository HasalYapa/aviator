'use client';

import { useState, useEffect } from 'react';
import { addNotification } from '@/lib/services/notificationsService';

interface NotificationSetting {
  id: string;
  name: string;
  enabled: boolean;
}

export default function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: 'high-confidence', name: 'High Confidence Alerts', enabled: true },
    { id: 'streak', name: 'Streak Notifications', enabled: true },
    { id: 'pattern', name: 'Pattern Alerts', enabled: false },
    { id: 'volatility', name: 'Volatility Changes', enabled: false },
    { id: 'daily-summary', name: 'Daily Summary', enabled: true }
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prevSettings => {
      const updatedSettings = prevSettings.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      );

      // Find the setting that was toggled
      const toggledSetting = updatedSettings.find(s => s.id === id);

      // Add a notification about the change
      if (toggledSetting) {
        const action = toggledSetting.enabled ? 'enabled' : 'disabled';
        addNotification(`${toggledSetting.name} ${action}`);
      }

      return updatedSettings;
    });
  };

  return (
    <div className="space-y-4">
      {settings.map(setting => (
        <div key={setting.id} className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">{setting.name}</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={setting.enabled}
              onChange={() => toggleSetting(setting.id)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      ))}

      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300">
          Save Preferences
        </button>
      </div>
    </div>
  );
}
