import { useState, useEffect } from 'react';
import api from '../../utils/api';

interface Flag {
  id: number;
  name: string;
  enabled: boolean;
  description: string;
}

export default function FeatureFlags() {
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFeatures, setActiveFeatures] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const response = await api.get<{ flags: Flag[] }>('/flags');
      const flagsData = response.flags || [];
      setFlags(flagsData);

      const enabled = new Set(flagsData.filter((f) => f.enabled).map((f) => f.name));
      setActiveFeatures(enabled);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load flags:', error);
      setLoading(false);
    }
  };

  const toggleFlag = async (flag: Flag) => {
    try {
      await api.put(`/flags/${flag.id}`, { enabled: !flag.enabled });

      const newEnabled = !flag.enabled;
      setFlags(flags.map((f) => (f.id === flag.id ? { ...f, enabled: newEnabled } : f)));

      const newActive = new Set(activeFeatures);
      if (newEnabled) {
        newActive.add(flag.name);
      } else {
        newActive.delete(flag.name);
      }
      setActiveFeatures(newActive);
    } catch (error) {
      console.error('Failed to toggle flag:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Feature Flags</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Flags List */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Flags</h3>
          <div className="space-y-3" data-testid="flags-list">
            {flags.map((flag) => (
              <div
                key={flag.id}
                className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition"
                data-testid={`flag-${flag.id}`}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{flag.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{flag.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flag.enabled}
                    onChange={() => toggleFlag(flag)}
                    className="sr-only peer"
                    data-testid={`toggle-${flag.id}`}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Features Demo */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Preview</h3>
          <div className="space-y-4">
            {activeFeatures.has('dark_mode') && (
              <div
                className="bg-gray-900 text-white p-4 rounded-lg"
                data-testid="feature-dark-mode"
              >
                <h4 className="font-semibold mb-2">🌙 Dark Mode Enabled</h4>
                <p className="text-sm text-gray-300">This section uses dark theme styling.</p>
              </div>
            )}

            {activeFeatures.has('new_dashboard') && (
              <div
                className="bg-blue-50 border border-blue-200 p-4 rounded-lg"
                data-testid="feature-new-dashboard"
              >
                <h4 className="font-semibold text-blue-900 mb-2">📊 New Dashboard</h4>
                <p className="text-sm text-blue-800">Enhanced analytics and metrics.</p>
              </div>
            )}

            {activeFeatures.has('beta_features') && (
              <div
                className="bg-purple-50 border border-purple-200 p-4 rounded-lg"
                data-testid="feature-beta"
              >
                <h4 className="font-semibold text-purple-900 mb-2">🚀 Beta Features</h4>
                <p className="text-sm text-purple-800">Experimental functionality enabled.</p>
              </div>
            )}

            {activeFeatures.has('advanced_search') && (
              <div
                className="bg-green-50 border border-green-200 p-4 rounded-lg"
                data-testid="feature-search"
              >
                <h4 className="font-semibold text-green-900 mb-2">🔍 Advanced Search</h4>
                <p className="text-sm text-green-800">Enhanced search capabilities active.</p>
              </div>
            )}

            {activeFeatures.size === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No features enabled. Toggle flags to see them in action!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* A/B Testing Simulation */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">A/B Testing Variants</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Control (Variant A)</h4>
            <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded">
              Standard Button
            </button>
          </div>
          <div className="border border-indigo-300 dark:border-indigo-600 rounded-lg p-4 bg-indigo-50 dark:bg-indigo-900/20">
            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
              Test (Variant B) {activeFeatures.has('beta_features') && '✓'}
            </h4>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded shadow-lg">
              Enhanced Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
