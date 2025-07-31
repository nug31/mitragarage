import React from 'react';
import { 
  Home, 
  Package, 
  Users, 
  FileText, 
  Calendar,
  Settings,
  BarChart3,
  Shield,
  Activity
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen }) => {
  const { isAdmin } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, adminOnly: false },
    { id: 'catalog', label: 'Item Catalog', icon: Package, adminOnly: false },
    { id: 'my-loans', label: 'My Loans', icon: FileText, adminOnly: false },
    { id: 'calendar', label: 'Calendar', icon: Calendar, adminOnly: false },
    ...(isAdmin ? [
      { id: 'admin-items', label: 'Manage Items', icon: Package, adminOnly: true },
      { id: 'admin-loans', label: 'Manage Loans', icon: FileText, adminOnly: true },
      { id: 'admin-users', label: 'Manage Users', icon: Users, adminOnly: true },
      { id: 'analytics', label: 'Analytics', icon: BarChart3, adminOnly: true },
      { id: 'activity', label: 'Activity Logs', icon: Activity, adminOnly: true },
      { id: 'security', label: 'Security', icon: Shield, adminOnly: true },
    ] : []),
    { id: 'settings', label: 'Settings', icon: Settings, adminOnly: false },
  ];

  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-6">
          <nav className="px-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LMS</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Lending System</p>
              <p className="text-xs text-gray-500">v1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};