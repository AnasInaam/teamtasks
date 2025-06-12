// TODO: This Calendar page currently lacks real data integration.
// - Replace all mockEvents and related mock data with real data from Supabase.
// - Implement data fetching using hooks and display loading/error states.
// - Add backend-connected actions for adding/editing events, deadlines, etc.
// - Remove this comment after full backend integration.

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  type: 'meeting' | 'deadline' | 'reminder';
  attendees?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  project?: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Get calendar data
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Fetch all tasks (as events)
  const { tasks, isLoading, error } = useTasks({ page: 1, pageSize: 500 });

  // Convert tasks to events (only those with due dates)
  const events = (tasks || [])
    .filter(task => !!task.due_date)
    .map(task => ({
      id: task.id,
      title: task.title,
      date: task.due_date ? task.due_date.split('T')[0] : '', // always string
      time: task.due_date ? new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      duration: 0,
      type: 'deadline' as const,
      attendees: task.assignees?.map(a => ({
        id: a.user.id,
        name: a.user.name,
        avatar: a.user.avatar_url || undefined
      })) || [],
      project: task.project_id
    }));

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for a specific date
  const getEventsForDate = (day: number) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateString);
  };

  // Format month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get event type color
  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-500';
      case 'deadline':
        return 'bg-red-500';
      case 'reminder':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary-500 mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <CalendarIcon size={48} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Error loading calendar events</h3>
        <p className="text-gray-500 dark:text-gray-400">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your schedule and upcoming events
          </p>
        </div>
        
        <button className="btn btn-primary inline-flex whitespace-nowrap">
          <Plus size={18} className="mr-1" />
          New Event
        </button>
      </div>

      {/* Calendar Header */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={goToPreviousMonth}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft size={20} />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            
            <button
              onClick={goToNextMonth}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToToday}
              className="btn btn-secondary"
            >
              Today
            </button>
            
            <div className="flex rounded-md border border-gray-300 dark:border-gray-700 overflow-hidden">
              <button
                className={`px-3 py-1 text-sm ${
                  view === 'month' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setView('month')}
              >
                Month
              </button>
              <button
                className={`px-3 py-1 text-sm ${
                  view === 'week' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setView('week')}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 text-sm ${
                  view === 'day' 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
                onClick={() => setView('day')}
              >
                Day
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="bg-gray-50 dark:bg-gray-800 p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((day, index) => {
            const isToday = day && 
              year === today.getFullYear() && 
              month === today.getMonth() && 
              day === today.getDate();
            
            const events = day ? getEventsForDate(day) : [];
            
            return (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 min-h-[100px] p-2 ${
                  day ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : ''
                }`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${
                      isToday 
                        ? 'bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {day}
                    </div>
                    
                    <div className="space-y-1">
                      {events.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded text-white truncate ${getEventTypeColor(event.type as 'meeting' | 'deadline' | 'reminder')}`}
                          title={`${event.title} - ${event.time}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {events.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          +{events.length - 2} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          
          <div className="space-y-4">
            {events
              .filter(event => new Date(event.date) >= today)
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 5)
              .map((event) => (
                <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-2 ${getEventTypeColor(event.type as 'meeting' | 'deadline' | 'reminder')}`}></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <CalendarIcon size={14} className="mr-1" />
                      {new Date(event.date || '').toLocaleDateString()}
                      <Clock size={14} className="ml-3 mr-1" />
                      {event.time}
                      {event.duration > 0 && ` (${event.duration} min)`}
                    </div>
                    {event.project && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {event.project}
                      </p>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center mt-2">
                        <Users size={14} className="mr-2 text-gray-400" />
                        <div className="flex -space-x-2">
                          {event.attendees.slice(0, 3).map((attendee) => (
                            <img
                              key={attendee.id}
                              src={attendee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(attendee.name)}&background=random`}
                              alt={attendee.name}
                              title={attendee.name}
                              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                            />
                          ))}
                          {event.attendees.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-400 border-2 border-white dark:border-gray-800">
                              +{event.attendees.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Event Types Legend */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Event Types
          </h2>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Meetings</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Deadlines</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Reminders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;