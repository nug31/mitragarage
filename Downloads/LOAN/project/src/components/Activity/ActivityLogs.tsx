import React, { useState } from 'react';
import { Search, Filter, Download, Eye, User, Package, FileText, Shield, Clock } from 'lucide-react';
import { ActivityLog } from '../../types';

export const ActivityLogs: React.FC = () => {
  const [logs] = useState<ActivityLog[]>([
    {
      id: '1',
      userId: '1',
      action: 'LOGIN',
      details: 'User logged in successfully',
      timestamp: new Date('2024-01-25T10:30:00'),
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      userId: '2',
      action: 'ITEM_CREATED',
      details: 'Created new item: MacBook Pro 16"',
      timestamp: new Date('2024-01-25T09:15:00'),
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      userId: '3',
      action: 'LOAN_REQUESTED',
      details: 'Requested loan for Drill Set Professional',
      timestamp: new Date('2024-01-25T08:45:00'),
      ipAddress: '192.168.1.102'
    },
    {
      id: '4',
      userId: '1',
      action: 'LOAN_APPROVED',
      details: 'Approved loan request #3',
      timestamp: new Date('2024-01-25T08:50:00'),
      ipAddress: '192.168.1.100'
    },
    {
      id: '5',
      userId: '2',
      action: 'ITEM_UPDATED',
      details: 'Updated item quantity for Tennis Racket Set',
      timestamp: new Date('2024-01-24T16:20:00'),
      ipAddress: '192.168.1.101'
    },
    {
      id: '6',
      userId: '4',
      action: 'USER_CREATED',
      details: 'Created new user account for jane.smith@example.com',
      timestamp: new Date('2024-01-24T14:30:00'),
      ipAddress: '192.168.1.103'
    },
    {
      id: '7',
      userId: '3',
      action: 'ITEM_RETURNED',
      details: 'Returned JavaScript: The Good Parts',
      timestamp: new Date('2024-01-24T11:15:00'),
      ipAddress: '192.168.1.102'
    },
    {
      id: '8',
      userId: '1',
      action: 'SETTINGS_UPDATED',
      details: 'Updated system notification settings',
      timestamp: new Date('2024-01-24T09:00:00'),
      ipAddress: '192.168.1.100'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.userId.includes(searchQuery) ||
                         log.ipAddress.includes(searchQuery);
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const logDate = new Date(log.timestamp);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (dateFilter) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
      }
    }
    
    return matchesSearch && matchesAction && matchesDate;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
      case 'LOGOUT':
        return <User size={16} className="text-blue-600" />;
      case 'ITEM_CREATED':
      case 'ITEM_UPDATED':
      case 'ITEM_DELETED':
      case 'ITEM_RETURNED':
        return <Package size={16} className="text-green-600" />;
      case 'LOAN_REQUESTED':
      case 'LOAN_APPROVED':
      case 'LOAN_REJECTED':
        return <FileText size={16} className="text-purple-600" />;
      case 'USER_CREATED':
      case 'USER_UPDATED':
      case 'USER_DELETED':
        return <User size={16} className="text-orange-600" />;
      case 'SETTINGS_UPDATED':
        return <Shield size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN':
      case 'LOGOUT':
        return 'bg-blue-100 text-blue-800';
      case 'ITEM_CREATED':
      case 'ITEM_UPDATED':
      case 'ITEM_RETURNED':
        return 'bg-green-100 text-green-800';
      case 'ITEM_DELETED':
        return 'bg-red-100 text-red-800';
      case 'LOAN_REQUESTED':
      case 'LOAN_APPROVED':
        return 'bg-purple-100 text-purple-800';
      case 'LOAN_REJECTED':
        return 'bg-red-100 text-red-800';
      case 'USER_CREATED':
      case 'USER_UPDATED':
        return 'bg-orange-100 text-orange-800';
      case 'USER_DELETED':
        return 'bg-red-100 text-red-800';
      case 'SETTINGS_UPDATED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download size={20} />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-blue-600">{logs.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Clock className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Activities</p>
              <p className="text-2xl font-bold text-green-600">
                {logs.filter(log => {
                  const today = new Date();
                  const logDate = new Date(log.timestamp);
                  return logDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Eye className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">User Actions</p>
              <p className="text-2xl font-bold text-purple-600">
                {logs.filter(log => log.action.includes('USER')).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <User className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Item Actions</p>
              <p className="text-2xl font-bold text-orange-600">
                {logs.filter(log => log.action.includes('ITEM')).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Package className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search activities, user IDs, or IP addresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            <option value="LOGIN">Login/Logout</option>
            <option value="ITEM_CREATED">Item Actions</option>
            <option value="LOAN_REQUESTED">Loan Actions</option>
            <option value="USER_CREATED">User Actions</option>
            <option value="SETTINGS_UPDATED">Settings</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Activity Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Activity Timeline ({filteredLogs.length} activities)
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredLogs.map((log) => (
            <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {getActionIcon(log.action)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}>
                        {formatAction(log.action)}
                      </span>
                      <span className="text-sm text-gray-500">User #{log.userId}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {log.timestamp.toLocaleString()}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-900 mb-2">{log.details}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>IP: {log.ipAddress}</span>
                    <span>ID: {log.id}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredLogs.length === 0 && (
          <div className="p-12 text-center">
            <Clock className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};