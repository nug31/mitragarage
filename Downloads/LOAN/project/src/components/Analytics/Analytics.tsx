import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Package, Users, Clock, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export const Analytics: React.FC = () => {
  const { dashboardStats, loans, items, categories } = useData();
  const [dateRange, setDateRange] = useState('30');

  const loansByStatus = {
    active: loans.filter(l => l.status === 'active').length,
    pending: loans.filter(l => l.status === 'pending').length,
    overdue: loans.filter(l => l.status === 'overdue').length,
    returned: loans.filter(l => l.status === 'returned').length,
  };

  const topCategories = categories
    .sort((a, b) => b.itemCount - a.itemCount)
    .slice(0, 5);

  const utilizationRate = items.reduce((acc, item) => {
    const utilization = ((item.quantity - item.availableQuantity) / item.quantity) * 100;
    return acc + utilization;
  }, 0) / items.length;

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp size={14} className="mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ChartCard: React.FC<{
    title: string;
    children: React.ReactNode;
  }> = ({ title, children }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Items"
          value={dashboardStats.totalItems}
          change="+12% from last month"
          icon={<Package className="text-white" size={24} />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Active Loans"
          value={dashboardStats.activeLoans}
          change="+8% from last month"
          icon={<Clock className="text-white" size={24} />}
          color="bg-green-500"
        />
        <MetricCard
          title="Utilization Rate"
          value={`${utilizationRate.toFixed(1)}%`}
          change="+5% from last month"
          icon={<BarChart3 className="text-white" size={24} />}
          color="bg-purple-500"
        />
        <MetricCard
          title="Overdue Items"
          value={dashboardStats.overdueItems}
          change="-15% from last month"
          icon={<AlertTriangle className="text-white" size={24} />}
          color="bg-red-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Loan Status Distribution">
          <div className="space-y-4">
            {Object.entries(loansByStatus).map(([status, count]) => {
              const percentage = (count / loans.length) * 100;
              const colors = {
                active: 'bg-green-500',
                pending: 'bg-yellow-500',
                overdue: 'bg-red-500',
                returned: 'bg-blue-500'
              };
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${colors[status as keyof typeof colors]}`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[status as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title="Top Categories by Item Count">
          <div className="space-y-4">
            {topCategories.map((category, index) => {
              const maxCount = Math.max(...topCategories.map(c => c.itemCount));
              const percentage = (category.itemCount / maxCount) * 100;
              
              return (
                <div key={category.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-700">#{index + 1}</span>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{category.itemCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Loan Trends (Last 7 Days)">
          <div className="h-64 flex items-end justify-between space-x-2">
            {dashboardStats.loanTrends.map((trend, index) => {
              const maxCount = Math.max(...dashboardStats.loanTrends.map(t => t.count));
              const height = (trend.count / maxCount) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="mt-2 text-xs text-gray-600 text-center">
                    {new Date(trend.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className="text-xs font-medium text-gray-900">{trend.count}</div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        <ChartCard title="Item Condition Distribution">
          <div className="space-y-4">
            {['excellent', 'good', 'fair', 'poor'].map(condition => {
              const count = items.filter(item => item.condition === condition).length;
              const percentage = (count / items.length) * 100;
              const colors = {
                excellent: 'bg-green-500',
                good: 'bg-blue-500',
                fair: 'bg-yellow-500',
                poor: 'bg-red-500'
              };
              
              return (
                <div key={condition} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${colors[condition as keyof typeof colors]}`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{condition}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${colors[condition as keyof typeof colors]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>

      {/* Summary Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Item Performance Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Loans
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.slice(0, 10).map((item) => {
                const itemLoans = loans.filter(loan => loan.itemId === item.id);
                const utilization = ((item.quantity - item.availableQuantity) / item.quantity) * 100;
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={item.images[0] || '/placeholder-image.jpg'}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded mr-3"
                        />
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {itemLoans.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="h-2 rounded-full bg-blue-500"
                            style={{ width: `${utilization}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{utilization.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.value}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};