import { useParams, Link, Navigate } from 'react-router-dom';
import { useState, useEffect, Suspense } from 'react';
import { getChallengeById } from '../challenges/registry';
import { getChallengeProgress, markChallengeCompleted } from '../challenges/progress';
import type { Challenge } from '../challenges/types';

// Dynamically import challenge components using import.meta.glob
const challengeModules = import.meta.glob('../challenges/**/*.tsx');

const loadChallengeComponent = async (componentPath: string) => {
  const path = componentPath.replace('./', '');
  // Construct the full path to match the glob keys
  const fullPath = `../challenges/${path}.tsx`;

  const loader = challengeModules[fullPath];

  if (!loader) {
    console.error(`Challenge component not found: ${fullPath}`);
    return {
      default: () => (
        <div className="text-center py-12">
          <p className="text-gray-600">Challenge component not found.</p>
          <p className="text-sm text-gray-500 mt-2">Path: {path}</p>
        </div>
      ),
    };
  }

  return loader() as Promise<{ default: React.ComponentType }>;
};

export default function ChallengePage() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [progress, setProgress] = useState(getChallengeProgress(id || ''));
  const [ChallengeComponent, setChallengeComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    if (id) {
      const found = getChallengeById(id);
      setChallenge(found || null);
      setProgress(getChallengeProgress(id));

      if (found) {
        loadChallengeComponent(found.componentPath).then((module) => {
          setChallengeComponent(() => module.default);
        });
      }
    }
  }, [id]);

  const handleMarkCompleted = () => {
    if (id) {
      markChallengeCompleted(id);
      setProgress(getChallengeProgress(id));
    }
  };

  // Don't redirect immediately - wait for challenge to load
  if (!id) {
    return <Navigate to="/challenges" replace />;
  }

  // Show loading state while challenge is being fetched
  if (!challenge) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300">Loading challenge...</p>
        </div>
      </div>
    );
  }

  const levelColors = {
    beginner: 'bg-green-900 text-green-300 border-green-600',
    intermediate: 'bg-yellow-900 text-yellow-300 border-yellow-600',
    senior: 'bg-red-900 text-red-300 border-red-600',
  };

  const statusColors = {
    'not-started': 'bg-gray-700 text-gray-300',
    'in-progress': 'bg-blue-900 text-blue-300',
    completed: 'bg-green-900 text-green-300',
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/challenges"
          className="text-indigo-400 hover:text-indigo-300 font-medium mb-4 inline-block"
        >
          ← Back to Challenges
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{challenge.title}</h1>
              <span
                className={`px-3 py-1 text-sm font-medium rounded border ${levelColors[challenge.level]
                  }`}
              >
                {challenge.level}
              </span>
              <span
                className={`px-3 py-1 text-sm font-medium rounded ${statusColors[progress.status]}`}
              >
                {progress.status.replace('-', ' ')}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{challenge.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span>📁 {challenge.category}</span>
              <span>⏱️ ~{challenge.estimatedTime} min</span>
              <span>🔄 {progress.attempts} attempts</span>
            </div>
          </div>

          {progress.status !== 'completed' && (
            <button
              onClick={handleMarkCompleted}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition"
            >
              Mark as Completed
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Objectives */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🎯 Objectives</h2>
            <ul className="space-y-2">
              {challenge.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-indigo-400 font-bold mt-0.5">•</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Hints */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowHints(!showHints)}
              className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 dark:text-white mb-3"
            >
              <span>💡 Hints</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{showHints ? '▼' : '▶'}</span>
            </button>
            {showHints && (
              <ul className="space-y-2">
                {challenge.hints.map((hint, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 dark:text-gray-300 bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-30 p-2 rounded"
                  >
                    {index + 1}. {hint}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* API Endpoints */}
          {challenge.apiEndpoints && challenge.apiEndpoints.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">🔌 API Endpoints</h2>
              <ul className="space-y-1">
                {challenge.apiEndpoints.map((endpoint, index) => (
                  <li
                    key={index}
                    className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 p-2 rounded"
                  >
                    {endpoint}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 min-h-[600px] border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Challenge Application</h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              {ChallengeComponent ? (
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
                        <p className="mt-4 text-gray-700 dark:text-gray-300">Loading challenge...</p>
                      </div>
                    </div>
                  }
                >
                  <ChallengeComponent />
                </Suspense>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
                    <p className="mt-4 text-gray-700 dark:text-gray-300">Loading challenge...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
