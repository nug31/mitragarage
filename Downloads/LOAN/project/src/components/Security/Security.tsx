import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff, AlertTriangle, CheckCircle, Settings, Lock } from 'lucide-react';

export const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'logs'>('overview');
  const [showApiKey, setShowApiKey] = useState(false);
  
  const securityMetrics = {
    totalLogins: 1247,
    failedAttempts: 23,
    activeSessions: 45,
    lastSecurityScan: new Date('2024-01-25T08:00:00')
  };

  const securitySettings = {
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    requireStrongPasswords: true,
    emailNotifications: true
  };

  const recentSecurityEvents = [
    {
      id: '1',
      type: 'login_success',
      message: 'Successful login from 192.168.1.100',
      timestamp: new Date('2024-01-25T10:30:00'),
      severity: 'info'
    },
    {
      id: '2',
      type: 'failed_login',
      message: 'Failed login attempt from 192.168.1.200',
      timestamp: new Date('2024-01-25T10:15:00'),
      severity: 'warning'
    },
    {
      id: '3',
      type: 'password_change',
      message: 'Password changed for user john.doe@example.com',
      timestamp: new Date('2024-01-25T09:45:00'),
      severity: 'info'
    },
    {
      id: '4',
      type: 'suspicious_activity',
      message: 'Multiple failed login attempts detected',
      timestamp: new Date('2024-01-25T09:30:00'),
      severity: 'error'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'info': return <CheckCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'error': return <AlertTriangle size={16} />;
      default: return <Shield size={16} />;
    }
  };

  const SecurityOverview = () => (
    <div className="space-y-6">
      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Logins</p>
              <p className="text-2xl font-bold text-blue-600">{securityMetrics.totalLogins}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Shield className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Attempts</p>
              <p className="text-2xl font-bold text-red-600">{securityMetrics.failedAttempts}</p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-green-600">{securityMetrics.activeSessions}</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <Eye className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Scan</p>
              <p className="text-sm font-bold text-gray-900">
                {securityMetrics.lastSecurityScan.toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Settings className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Security Health */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Health Check</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-800 font-medium">Two-Factor Authentication</span>
            </div>
            <span className="text-green-600 text-sm">Enabled</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-800 font-medium">SSL Certificate</span>
            </div>
            <span className="text-green-600 text-sm">Valid</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="text-yellow-600" size={20} />
              <span className="text-yellow-800 font-medium">Password Policy</span>
            </div>
            <span className="text-yellow-600 text-sm">Needs Review</span>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={20} />
              <span className="text-green-800 font-medium">Database Encryption</span>
            </div>
            <span className="text-green-600 text-sm">Active</span>
          </div>
        </div>
      </div>

      {/* Recent Security Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Security Events</h3>
        <div className="space-y-3">
          {recentSecurityEvents.map((event) => (
            <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${getSeverityColor(event.severity)}`}>
                {getSeverityIcon(event.severity)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{event.message}</p>
                <p className="text-xs text-gray-500">{event.timestamp.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Require 2FA for all user accounts</p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Strong Password Requirements</label>
              <p className="text-sm text-gray-500">Enforce complex password rules</p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.requireStrongPasswords ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.requireStrongPasswords ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
            <input
              type="number"
              value={securitySettings.passwordExpiry}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
            <input
              type="number"
              value={securitySettings.maxLoginAttempts}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Security</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
            <div className="flex items-center space-x-2">
              <input
                type={showApiKey ? 'text' : 'password'}
                value="sk_live_1234567890abcdef"
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showApiKey ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Regenerate
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Rate Limiting</label>
              <p className="text-sm text-gray-500">Limit API requests per minute</p>
            </div>
            <input
              type="number"
              value="100"
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Email Security Alerts</label>
              <p className="text-sm text-gray-500">Send email notifications for security events</p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                securitySettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  securitySettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Settings
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <Lock size={20} />
          <span>Run Security Scan</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'overview', label: 'Security Overview' },
            { key: 'settings', label: 'Security Settings' },
            { key: 'logs', label: 'Security Logs' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <SecurityOverview />}
      {activeTab === 'settings' && <SecuritySettings />}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Logs</h3>
          <p className="text-gray-600">Detailed security logs would be displayed here with filtering and search capabilities.</p>
        </div>
      )}
    </div>
  );
};