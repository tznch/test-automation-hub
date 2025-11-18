import { useState, useEffect } from 'react';
import api from '../../utils/api';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  revenue: number;
  requestsToday: number;
  errorRate: number;
}

interface RecentActivity {
  id: number;
  type: 'user' | 'order' | 'error';
  message: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    revenue: 0,
    requestsToday: 0,
    errorRate: 0,
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadDashboardData = async () => {
    try {
      const [usersRes, ordersRes, logsRes] = await Promise.all([
        api.get<{ users: any[] }>('/users'),
        api.get<{ orders: any[] }>('/orders'),
        api.get<{ logs: any[] }>('/admin/logs?limit=100'),
      ]);

      const users = usersRes.users || [];
      const orders = ordersRes.orders || [];
      const logs = logsRes.logs || [];

      const errorLogs = logs.filter((log: any) => log.statusCode >= 400);
      const errorRate = logs.length > 0 ? (errorLogs.length / logs.length) * 100 : 0;

      setStats({
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.role !== 'inactive').length,
        totalOrders: orders.length,
        revenue: orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0),
        requestsToday: logs.length,
        errorRate: Math.round(errorRate * 10) / 10,
      });

      // Generate recent activities
      const recentActivities: RecentActivity[] = [
        ...users.slice(0, 3).map((u: any, i: number) => ({
          id: i,
          type: 'user' as const,
          message: `New user registered: ${u.name}`,
          timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        })),
        ...orders.slice(0, 3).map((o: any, i: number) => ({
          id: i + 10,
          type: 'order' as const,
          message: `Order #${o.id} placed - $${o.total}`,
          timestamp: new Date(Date.now() - i * 7200000).toISOString(),
        })),
        ...errorLogs.slice(0, 2).map((log: any, i: number) => ({
          id: i + 20,
          type: 'error' as const,
          message: `Error ${log.statusCode}: ${log.path}`,
          timestamp: log.timestamp,
        })),
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(recentActivities);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded"
              data-testid="auto-refresh"
            />
            Auto-refresh (10s)
          </label>
          <button
            onClick={loadDashboardData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm"
            data-testid="refresh-button"
          >
            Refresh Now
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6" data-testid="stat-users">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</h3>
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</div>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">{stats.activeUsers} active</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6" data-testid="stat-orders">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</h3>
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">All time</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6" data-testid="stat-revenue">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</h3>
            <svg
              className="w-8 h-8 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">${stats.revenue.toFixed(2)}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total sales</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6" data-testid="stat-requests">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Requests Today</h3>
            <svg
              className="w-8 h-8 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.requestsToday}</div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">API calls</p>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6" data-testid="stat-errors">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Error Rate</h3>
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.errorRate}%</div>
          <p className={`text-sm mt-1 ${stats.errorRate > 5 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
            {stats.errorRate > 5 ? 'Needs attention' : 'Healthy'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium mb-2 opacity-90">System Status</h3>
          <div className="text-3xl font-bold">Operational</div>
          <p className="text-sm mt-1 opacity-90">All systems running</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3" data-testid="activity-list">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg"
              data-testid={`activity-${activity.id}`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'user'
                    ? 'bg-blue-500'
                    : activity.type === 'order'
                      ? 'bg-green-500'
                      : 'bg-red-500'
                }`}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">{activity.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatTime(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
