import React from 'react';
import { FinderCriteria } from '../../hooks/useDiscFinder';
import { Zap, Activity, Target, Award } from 'lucide-react';
import { cn } from '../../utils';

interface FinderFormProps {
  criteria: FinderCriteria;
  onChange: (criteria: FinderCriteria) => void;
}

export function FinderForm({ criteria, onChange }: FinderFormProps) {
  const handleChange = (field: keyof FinderCriteria, value: any) => {
    onChange({ ...criteria, [field]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-8">
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <Zap className="w-4 h-4 mr-2 text-indigo-600" />
          Arm Speed (Estimated MPH)
        </label>
        <input
          type="range"
          min="20"
          max="70"
          step="5"
          value={criteria.armSpeed}
          onChange={(e) => handleChange('armSpeed', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>Soft (20)</span>
          <span className="text-indigo-600 font-bold">{criteria.armSpeed} MPH</span>
          <span>Power (70+)</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <Activity className="w-4 h-4 mr-2 text-indigo-600" />
          Desired Stability
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['understable', 'stable', 'overstable'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleChange('stability', s)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold border transition-all uppercase tracking-wider",
                criteria.stability === s
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <Target className="w-4 h-4 mr-2 text-indigo-600" />
          Natural Shot Shape
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['straight', 'hyzer', 'anhyzer'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleChange('shotShape', s)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold border transition-all uppercase tracking-wider",
                criteria.shotShape === s
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 flex items-center">
          <Award className="w-4 h-4 mr-2 text-indigo-600" />
          Experience Level
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['beginner', 'intermediate', 'advanced'] as const).map((s) => (
            <button
              key={s}
              onClick={() => handleChange('experience', s)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-bold border transition-all uppercase tracking-wider",
                criteria.experience === s
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                  : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
