import { useState } from 'react';

export default function AnalyticsCharts() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('pageviews');

  const metrics = {
    pageviews: [120, 180, 250, 190, 280, 320, 380],
    users: [45, 62, 78, 65, 95, 110, 125],
    revenue: [1200, 1800, 2200, 1900, 2600, 3100, 3500],
    conversions: [12, 18, 22, 19, 26, 31, 35],
  };

  const data = metrics[selectedMetric as keyof typeof metrics];
  const max = Math.max(...data);

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              data-testid={`range-${range}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {Object.keys(metrics).map((metric) => {
          const values = metrics[metric as keyof typeof metrics];
          const current = values[values.length - 1];
          const previous = values[values.length - 2];
          const change = ((current - previous) / previous) * 100;

          return (
            <div
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className={`bg-white dark:bg-gray-800 border-2 rounded-lg p-4 cursor-pointer transition ${
                selectedMetric === metric
                  ? 'border-indigo-600 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              data-testid={`metric-${metric}`}
            >
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-1">{metric}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{current.toLocaleString()}</p>
              <p
                className={`text-xs font-medium ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
              </p>
            </div>
          );
        })}
      </div>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 capitalize">
          {selectedMetric} Trend
        </h3>
        <div className="h-64 flex items-end justify-between gap-4" data-testid="chart">
          {data.map((value, index) => {
            const height = (value / max) * 100;
            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
              >
                <div className="w-full flex flex-col items-center justify-end h-full">
                  <span className="text-xs text-gray-600 dark:text-gray-400 mb-1">{value}</span>
                  <div
                    className="w-full bg-indigo-600 rounded-t transition-all hover:bg-indigo-700"
                    style={{ height: `${height}%` }}
                    data-testid={`bar-${index}`}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{labels[index]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Table */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Pages</h3>
          <div className="space-y-2">
            {[
              { page: '/home', views: 1234 },
              { page: '/products', views: 987 },
              { page: '/about', views: 654 },
              { page: '/contact', views: 432 },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
              >
                <span className="text-sm text-gray-900 dark:text-white">{item.page}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.views} views</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {[
              { source: 'Direct', percent: 40, color: 'bg-blue-500' },
              { source: 'Organic Search', percent: 30, color: 'bg-green-500' },
              { source: 'Social Media', percent: 20, color: 'bg-purple-500' },
              { source: 'Referral', percent: 10, color: 'bg-orange-500' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-900 dark:text-white">{item.source}</span>
                  <span className="text-gray-600 dark:text-gray-400">{item.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
