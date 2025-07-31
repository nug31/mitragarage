import React from 'react';
import { 
  Package, 
  Users, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { dashboardStats, loans, getUserLoans, getOverdueLoans } = useData();
  const { t } = useTranslation();

  const userLoans = getUserLoans(user?.id || '');
  const overdueLoans = getOverdueLoans();
  const activeUserLoans = userLoans.filter(loan => loan.status === 'active');
  const pendingUserLoans = userLoans.filter(loan => loan.status === 'pending');

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string;
    change?: string;
  }> = ({ title, value, icon, color, change }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{t(title)}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp size={14} className="mr-1" />
              {t(change)}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const RecentActivity: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Recent Activity')}</h3>
      <div className="space-y-4">
        {loans.slice(0, 5).map((loan, index) => (
          <div key={loan.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
            <div className={`p-2 rounded-full ${
              loan.status === 'active' ? 'bg-green-100 text-green-600' :
              loan.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
              loan.status === 'overdue' ? 'bg-red-100 text-red-600' :
              'bg-gray-100 text-gray-600'
            }`}>
              {loan.status === 'active' ? <CheckCircle size={16} /> :
               loan.status === 'pending' ? <Clock size={16} /> :
               loan.status === 'overdue' ? <AlertTriangle size={16} /> :
               <Package size={16} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {t('Loan')} {loan.status === 'pending' ? t('requested') : 
                       loan.status === 'active' ? t('approved') :
                       loan.status === 'overdue' ? t('overdue') : t('returned')}
              </p>
              <p className="text-sm text-gray-600">
                {loan.requestedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const QuickActions: React.FC = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Quick Actions')}</h3>
      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
          <Package size={20} />
          <span className="text-sm font-medium">{t('Browse Items')}</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors">
          <FileText size={20} />
          <span className="text-sm font-medium">{t('Request Loan')}</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
          <Calendar size={20} />
          <span className="text-sm font-medium">{t('View Calendar')}</span>
        </button>
        <button className="flex items-center justify-center space-x-2 p-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors">
          <Users size={20} />
          <span className="text-sm font-medium">{t('My Profile')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('Welcome back')}, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            {t("Here's what's happening with your loans and items today.")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            {/* Tanggal bisa diterjemahkan manual jika ingin */}
            {new Date().toLocaleDateString(i18n.language === 'id' ? 'id-ID' : 'en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin ? (
          <>
            <StatCard
              title="Total Items"
              value={dashboardStats.totalItems}
              icon={<Package className="text-white" size={24} />}
              color="bg-blue-500"
              change="+12% from last month"
            />
            <StatCard
              title="Active Loans"
              value={dashboardStats.activeLoans}
              icon={<FileText className="text-white" size={24} />}
              color="bg-green-500"
              change="+8% from last month"
            />
            <StatCard
              title="Pending Requests"
              value={dashboardStats.pendingRequests}
              icon={<Clock className="text-white" size={24} />}
              color="bg-yellow-500"
            />
            <StatCard
              title="Overdue Items"
              value={dashboardStats.overdueItems}
              icon={<AlertTriangle className="text-white" size={24} />}
              color="bg-red-500"
            />
          </>
        ) : (
          <>
            <StatCard
              title="My Active Loans"
              value={activeUserLoans.length}
              icon={<FileText className="text-white" size={24} />}
              color="bg-green-500"
            />
            <StatCard
              title="Pending Requests"
              value={pendingUserLoans.length}
              icon={<Clock className="text-white" size={24} />}
              color="bg-yellow-500"
            />
            <StatCard
              title="Items Due Soon"
              value={activeUserLoans.filter(loan => {
                const daysUntilDue = Math.ceil(
                  (loan.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                );
                return daysUntilDue <= 3;
              }).length}
              icon={<AlertTriangle className="text-white" size={24} />}
              color="bg-orange-500"
            />
            <StatCard
              title="Total Loans"
              value={userLoans.length}
              icon={<Package className="text-white" size={24} />}
              color="bg-blue-500"
            />
          </>
        )}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('Loan Trends')}</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="mx-auto text-gray-400 mb-2" size={48} />
              <p className="text-gray-600">Chart visualization would go here</p>
              <p className="text-sm text-gray-500 mt-1">
                Showing daily loan activity for the past week
              </p>
            </div>
          </div>
        </div>

        <RecentActivity />
      </div>

      {/* Quick Actions and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions />
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notices</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-blue-900">System Maintenance</p>
                <p className="text-sm text-blue-700">
                  Scheduled maintenance this weekend from 2-4 AM
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-green-900">New Items Added</p>
                <p className="text-sm text-green-700">
                  5 new laptops and 3 projectors now available
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-yellow-900">Policy Update</p>
                <p className="text-sm text-yellow-700">
                  Updated loan duration limits - check your profile
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};