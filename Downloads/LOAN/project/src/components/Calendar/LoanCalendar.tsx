import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Package, User } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export const LoanCalendar: React.FC = () => {
  const { loans, getItemById } = useData();
  const { user, isAdmin } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getLoansForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return loans.filter(loan => {
      const startDate = loan.startDate.toDateString();
      const endDate = loan.endDate.toDateString();
      return startDate === dateStr || endDate === dateStr || 
             (loan.startDate <= date && loan.endDate >= date);
    });
  };

  const renderCalendarDay = (day: number, isCurrentMonth: boolean) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayLoans = getLoansForDate(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const userLoans = isAdmin ? dayLoans : dayLoans.filter(loan => loan.userId === user?.id);

    return (
      <div
        key={day}
        className={`min-h-24 p-2 border border-gray-200 ${
          !isCurrentMonth ? 'bg-gray-50 text-gray-400' : 'bg-white'
        } ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
      >
        <div className="flex items-center justify-between mb-1">
          <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </span>
          {userLoans.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-600 px-1 rounded">
              {userLoans.length}
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          {userLoans.slice(0, 2).map(loan => {
            const item = getItemById(loan.itemId);
            const isStartDate = loan.startDate.toDateString() === date.toDateString();
            const isEndDate = loan.endDate.toDateString() === date.toDateString();
            
            return (
              <div
                key={loan.id}
                className={`text-xs p-1 rounded truncate ${
                  loan.status === 'active' ? 'bg-green-100 text-green-700' :
                  loan.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  loan.status === 'overdue' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}
                title={`${item?.name} - ${loan.status}`}
              >
                {isStartDate && '▶ '}
                {isEndDate && '◀ '}
                {item?.name}
              </div>
            );
          })}
          {userLoans.length > 2 && (
            <div className="text-xs text-gray-500">
              +{userLoans.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(renderCalendarDay(daysInPrevMonth - i, false));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(renderCalendarDay(day, true));
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(renderCalendarDay(day, false));
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Loan Calendar</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                viewMode === 'month' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                viewMode === 'week' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {renderCalendar()}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
            <span className="text-sm text-gray-700">Active Loans</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span className="text-sm text-gray-700">Pending Requests</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
            <span className="text-sm text-gray-700">Overdue Items</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
            <span className="text-sm text-gray-700">Today</span>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {loans
            .filter(loan => {
              const today = new Date();
              const endDate = loan.endDate;
              return endDate >= today && endDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            })
            .slice(0, 5)
            .map(loan => {
              const item = getItemById(loan.itemId);
              const daysUntil = Math.ceil((loan.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={loan.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    daysUntil <= 1 ? 'bg-red-100 text-red-600' :
                    daysUntil <= 3 ? 'bg-yellow-100 text-yellow-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <Clock size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item?.name}</p>
                    <p className="text-sm text-gray-600">
                      Due {loan.endDate.toLocaleDateString()} ({daysUntil} days)
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <User size={14} />
                      <span>User #{loan.userId}</span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};