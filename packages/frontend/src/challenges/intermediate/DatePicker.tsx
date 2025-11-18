import { useState } from 'react';

export default function DatePicker() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(newDate);
    setIsOpen(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isSelectedDate = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Date Picker</h2>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
        <div className="relative">
          <input
            type="text"
            value={formatDate(selectedDate)}
            onClick={() => setIsOpen(!isOpen)}
            readOnly
            placeholder="Choose a date..."
            className="w-full px-4 py-3 pr-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            data-testid="date-input"
          />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Calendar Dropdown */}
        {isOpen && (
          <div
            className="absolute w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 p-4"
            data-testid="calendar"
          >
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                data-testid="prev-month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="font-semibold text-gray-900 dark:text-white" data-testid="current-month">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </div>

              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                data-testid="next-month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {generateCalendarDays().map((day, index) => (
                <div key={index} className="aspect-square">
                  {day ? (
                    <button
                      onClick={() => handleDateSelect(day)}
                      className={`w-full h-full rounded flex items-center justify-center text-sm transition ${
                        isSelectedDate(day)
                          ? 'bg-indigo-600 text-white font-semibold'
                          : isToday(day)
                            ? 'bg-indigo-100 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-300 font-semibold'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                      data-testid={`day-${day}`}
                    >
                      {day}
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>

            {/* Today Button */}
            <button
              onClick={() => {
                const today = new Date();
                setCurrentMonth(today);
                setSelectedDate(today);
                setIsOpen(false);
              }}
              className="w-full mt-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded font-medium"
              data-testid="today-button"
            >
              Today
            </button>
          </div>
        )}
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">Selected Date</h3>
          <p className="text-green-800 dark:text-green-400" data-testid="selected-date">
            {formatDate(selectedDate)}
          </p>
          <button
            onClick={() => setSelectedDate(null)}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            data-testid="clear-date"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
}
