import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllChallenges, getChallengesByLevel } from '../challenges/registry';
import { getChallengeProgress } from '../challenges/progress';
import type { ChallengeLevel } from '../challenges/types';

export default function ChallengesPage() {
  const [selectedLevel, setSelectedLevel] = useState<ChallengeLevel | 'all'>('all');

  const allChallenges = getAllChallenges();
  const filteredChallenges =
    selectedLevel === 'all' ? allChallenges : getChallengesByLevel(selectedLevel);

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

  const stats = {
    total: allChallenges.length,
    beginner: getChallengesByLevel('beginner').length,
    intermediate: getChallengesByLevel('intermediate').length,
    senior: getChallengesByLevel('senior').length,
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Challenges</h1>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          {stats.total} challenges to practice your testing skills
        </p>
      </div>

      {/* Stats - Now Clickable Filters */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => setSelectedLevel('all')}
          className={`rounded-lg shadow-lg p-4 text-center border-2 transition-all ${
            selectedLevel === 'all'
              ? 'bg-indigo-600 border-indigo-400'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-indigo-500'
          }`}
        >
          <div
            className={`text-2xl font-bold ${selectedLevel === 'all' ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}
          >
            {stats.total}
          </div>
          <div
            className={`text-sm ${selectedLevel === 'all' ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Total
          </div>
        </button>
        <button
          onClick={() => setSelectedLevel('beginner')}
          className={`rounded-lg shadow-lg p-4 text-center border-2 transition-all ${
            selectedLevel === 'beginner'
              ? 'bg-green-600 border-green-400'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-green-500'
          }`}
        >
          <div
            className={`text-2xl font-bold ${selectedLevel === 'beginner' ? 'text-white' : 'text-green-600 dark:text-green-400'}`}
          >
            {stats.beginner}
          </div>
          <div
            className={`text-sm ${selectedLevel === 'beginner' ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Beginner
          </div>
        </button>
        <button
          onClick={() => setSelectedLevel('intermediate')}
          className={`rounded-lg shadow-lg p-4 text-center border-2 transition-all ${
            selectedLevel === 'intermediate'
              ? 'bg-yellow-600 border-yellow-400'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-yellow-500'
          }`}
        >
          <div
            className={`text-2xl font-bold ${selectedLevel === 'intermediate' ? 'text-white' : 'text-yellow-600 dark:text-yellow-400'}`}
          >
            {stats.intermediate}
          </div>
          <div
            className={`text-sm ${selectedLevel === 'intermediate' ? 'text-yellow-100' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Intermediate
          </div>
        </button>
        <button
          onClick={() => setSelectedLevel('senior')}
          className={`rounded-lg shadow-lg p-4 text-center border-2 transition-all ${
            selectedLevel === 'senior'
              ? 'bg-red-600 border-red-400'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:border-red-500'
          }`}
        >
          <div
            className={`text-2xl font-bold ${selectedLevel === 'senior' ? 'text-white' : 'text-red-600 dark:text-red-400'}`}
          >
            {stats.senior}
          </div>
          <div
            className={`text-sm ${selectedLevel === 'senior' ? 'text-red-100' : 'text-gray-600 dark:text-gray-400'}`}
          >
            Senior
          </div>
        </button>
      </div>

      {/* Challenge Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map((challenge) => {
          const progress = getChallengeProgress(challenge.id);
          return (
            <Link
              key={challenge.id}
              to={`/challenge/${challenge.id}`}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">{challenge.title}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded border ${
                    levelColors[challenge.level]
                  }`}
                >
                  {challenge.level}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{challenge.category}</p>
              <p className="text-sm text-gray-700 dark:text-gray-500 mb-4 line-clamp-2">{challenge.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 dark:text-gray-400">⏱️ ~{challenge.estimatedTime} min</span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    statusColors[progress.status]
                  }`}
                >
                  {progress.status === 'not-started' ? 'New' : progress.status.replace('-', ' ')}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
