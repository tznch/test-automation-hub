import { useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay, isToday } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  color: string;
  recurring?: 'none' | 'daily' | 'weekly' | 'monthly';
}

const colorOptions = [
  { value: 'bg-blue-500', label: 'Blue' },
  { value: 'bg-green-500', label: 'Green' },
  { value: 'bg-red-500', label: 'Red' },
  { value: 'bg-yellow-500', label: 'Yellow' },
  { value: 'bg-purple-500', label: 'Purple' },
  { value: 'bg-pink-500', label: 'Pink' },
];

export default function CalendarScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly sync with the team',
      start: new Date(2025, 10, 20, 10, 0),
      end: new Date(2025, 10, 20, 11, 0),
      color: 'bg-blue-500',
      recurring: 'weekly',
    },
    {
      id: '2',
      title: 'Project Deadline',
      description: 'Submit final deliverables',
      start: new Date(2025, 10, 25, 17, 0),
      end: new Date(2025, 10, 25, 18, 0),
      color: 'bg-red-500',
      recurring: 'none',
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    color: 'bg-blue-500',
    recurring: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const getDaysInView = () => {
    const days: Date[] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.start, date));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      color: 'bg-blue-500',
      recurring: 'none',
    });
    setShowModal(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedDate(event.start);
    setFormData({
      title: event.title,
      description: event.description,
      startTime: format(event.start, 'HH:mm'),
      endTime: format(event.end, 'HH:mm'),
      color: event.color,
      recurring: event.recurring || 'none',
    });
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    if (!selectedDate || !formData.title) return;

    const [startHour, startMinute] = formData.startTime.split(':').map(Number);
    const [endHour, endMinute] = formData.endTime.split(':').map(Number);

    const start = new Date(selectedDate);
    start.setHours(startHour, startMinute, 0);

    const end = new Date(selectedDate);
    end.setHours(endHour, endMinute, 0);

    if (editingEvent) {
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id
            ? {
                ...e,
                title: formData.title,
                description: formData.description,
                start,
                end,
                color: formData.color,
                recurring: formData.recurring,
              }
            : e
        )
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        start,
        end,
        color: formData.color,
        recurring: formData.recurring,
      };
      setEvents([...events, newEvent]);
    }

    setShowModal(false);
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setEvents(events.filter((e) => e.id !== editingEvent.id));
      setShowModal(false);
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const checkConflict = () => {
    if (!selectedDate) return false;

    const [startHour, startMinute] = formData.startTime.split(':').map(Number);
    const [endHour, endMinute] = formData.endTime.split(':').map(Number);

    const newStart = new Date(selectedDate);
    newStart.setHours(startHour, startMinute);

    const newEnd = new Date(selectedDate);
    newEnd.setHours(endHour, endMinute);

    return events.some((event) => {
      if (editingEvent && event.id === editingEvent.id) return false;
      if (!isSameDay(event.start, selectedDate)) return false;

      return (
        (newStart >= event.start && newStart < event.end) ||
        (newEnd > event.start && newEnd <= event.end) ||
        (newStart <= event.start && newEnd >= event.end)
      );
    });
  };

  const hasConflict = checkConflict();

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Calendar Scheduler</h1>
            <p className="text-gray-400">Create and manage events</p>
          </div>
          <button
            data-testid="today-button"
            onClick={goToToday}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition"
          >
            Today
          </button>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              data-testid="prev-button"
              onClick={previousMonth}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
            >
              ←
            </button>
            <h2 className="text-xl font-semibold text-white min-w-[200px] text-center" data-testid="current-month">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <button
              data-testid="next-button"
              onClick={nextMonth}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition"
            >
              →
            </button>
          </div>

          <div className="flex gap-2">
            <button
              data-testid="view-month"
              onClick={() => setView('month')}
              className={`px-4 py-2 rounded transition ${
                view === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Month
            </button>
            <button
              data-testid="view-week"
              onClick={() => setView('week')}
              className={`px-4 py-2 rounded transition ${
                view === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Week
            </button>
            <button
              data-testid="view-day"
              onClick={() => setView('day')}
              className={`px-4 py-2 rounded transition ${
                view === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Day
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 bg-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center text-sm font-semibold text-gray-300">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7" data-testid="calendar-grid">
            {getDaysInView().map((day, idx) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);

              return (
                <div
                  key={idx}
                  data-testid={`calendar-day-${format(day, 'yyyy-MM-dd')}`}
                  onClick={() => handleDateClick(day)}
                  className={`min-h-[120px] p-2 border border-gray-700 cursor-pointer hover:bg-gray-750 transition ${
                    !isCurrentMonth ? 'bg-gray-900' : 'bg-gray-800'
                  }`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${
                      isDayToday
                        ? 'bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center'
                        : isCurrentMonth
                        ? 'text-white'
                        : 'text-gray-600'
                    }`}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        data-testid={`event-${event.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                        className={`${event.color} text-white text-xs px-2 py-1 rounded truncate hover:opacity-80 transition`}
                      >
                        {format(event.start, 'HH:mm')} {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="event-modal">
              <h3 className="text-xl font-bold text-white mb-4">
                {editingEvent ? 'Edit Event' : 'Create Event'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    data-testid="event-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    data-testid="event-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                    <input
                      type="time"
                      data-testid="event-start-time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                    <input
                      type="time"
                      data-testid="event-end-time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                  <select
                    data-testid="event-color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Recurring</label>
                  <select
                    data-testid="event-recurring"
                    value={formData.recurring}
                    onChange={(e) => setFormData({ ...formData, recurring: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="none">None</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                {hasConflict && (
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded p-3" data-testid="conflict-warning">
                    <p className="text-sm text-yellow-400">
                      ⚠️ Warning: This event conflicts with another event at the same time.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  data-testid="save-event-button"
                  onClick={handleSaveEvent}
                  disabled={!formData.title}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 text-white rounded font-medium transition"
                >
                  {editingEvent ? 'Update' : 'Create'}
                </button>
                {editingEvent && (
                  <button
                    data-testid="delete-event-button"
                    onClick={handleDeleteEvent}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
                  >
                    Delete
                  </button>
                )}
                <button
                  data-testid="cancel-event-button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Testing Hints */}
        <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-600 rounded">
          <h3 className="text-sm font-semibold text-indigo-400 mb-2">🧪 Testing Hints</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• Click calendar days to create events</li>
            <li>• Click existing events to edit them</li>
            <li>• Navigate months with prev/next buttons</li>
            <li>• Switch views with view-month, view-week, view-day</li>
            <li>• Use today-button to jump to current date</li>
            <li>• Test conflict detection with overlapping times</li>
            <li>• Verify recurring event options</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

