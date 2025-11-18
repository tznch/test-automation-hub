import { useState } from 'react';

interface TableRow {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  joinDate: string;
}

const initialData: TableRow[] = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'User',
    status: 'active',
    joinDate: '2024-02-20',
  },
  {
    id: 3,
    name: 'Carol White',
    email: 'carol@example.com',
    role: 'Moderator',
    status: 'inactive',
    joinDate: '2024-03-10',
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    role: 'User',
    status: 'active',
    joinDate: '2024-04-05',
  },
  {
    id: 5,
    name: 'Eve Davis',
    email: 'eve@example.com',
    role: 'Admin',
    status: 'active',
    joinDate: '2024-05-12',
  },
  {
    id: 6,
    name: 'Frank Miller',
    email: 'frank@example.com',
    role: 'User',
    status: 'inactive',
    joinDate: '2024-06-18',
  },
  {
    id: 7,
    name: 'Grace Lee',
    email: 'grace@example.com',
    role: 'Moderator',
    status: 'active',
    joinDate: '2024-07-22',
  },
  {
    id: 8,
    name: 'Henry Wilson',
    email: 'henry@example.com',
    role: 'User',
    status: 'active',
    joinDate: '2024-08-30',
  },
];

type SortField = 'name' | 'email' | 'role' | 'status' | 'joinDate';
type SortOrder = 'asc' | 'desc';

export default function DataTable() {
  const [data] = useState<TableRow[]>(initialData);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const getSortedData = () => {
    let filtered = [...data];

    // Apply filters
    if (filterRole !== 'all') {
      filtered = filtered.filter((row) => row.role === filterRole);
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter((row) => row.status === filterStatus);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (row) =>
          row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          row.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const modifier = sortOrder === 'asc' ? 1 : -1;
      return aVal > bVal ? modifier : aVal < bVal ? -modifier : 0;
    });

    return filtered;
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    const sortedData = getSortedData();
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedData.map((row) => row.id));
    }
  };

  const sortedData = getSortedData();
  const allSelected = sortedData.length > 0 && selectedRows.length === sortedData.length;

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Management</h2>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="search-input"
        />

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="role-filter"
        >
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Moderator">Moderator</option>
          <option value="User">User</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          data-testid="status-filter"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Selected Count */}
      {selectedRows.length > 0 && (
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-md flex items-center justify-between">
          <span className="text-indigo-900 dark:text-indigo-300 font-medium">
            {selectedRows.length} row{selectedRows.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => setSelectedRows([])}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            data-testid="clear-selection"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" data-testid="data-table">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAllRows}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    data-testid="select-all"
                  />
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  data-testid="header-name"
                >
                  <div className="flex items-center gap-2">
                    Name
                    {sortField === 'name' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('email')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  data-testid="header-email"
                >
                  <div className="flex items-center gap-2">
                    Email
                    {sortField === 'email' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('role')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  data-testid="header-role"
                >
                  <div className="flex items-center gap-2">
                    Role
                    {sortField === 'role' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  data-testid="header-status"
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortField === 'status' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('joinDate')}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  data-testid="header-joinDate"
                >
                  <div className="flex items-center gap-2">
                    Join Date
                    {sortField === 'joinDate' && <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sortedData.map((row) => (
                <tr
                  key={row.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    selectedRows.includes(row.id) ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                  }`}
                  data-testid={`row-${row.id}`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => toggleRowSelection(row.id)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      data-testid={`select-${row.id}`}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{row.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.role === 'Admin'
                          ? 'bg-purple-100 text-purple-800'
                          : row.role === 'Moderator'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {row.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{row.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {sortedData.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">No results found</div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {sortedData.length} of {data.length} users
      </div>
    </div>
  );
}
