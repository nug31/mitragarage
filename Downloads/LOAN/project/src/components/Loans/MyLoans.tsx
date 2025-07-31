import React, { useState } from 'react';
import { Calendar, Clock, Package, AlertTriangle, CheckCircle, X, RotateCcw, Eye, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Loan } from '../../types';
import { useTranslation } from 'react-i18next';

export const MyLoans: React.FC = () => {
  const { user } = useAuth();
  const { getUserLoans, getItemById, returnItem, requestExtension } = useData();
  const [activeTab, setActiveTab] = useState<'active' | 'pending' | 'history'>('active');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const { t } = useTranslation();

  const userLoans = getUserLoans(user?.id || '');
  const activeLoans = userLoans.filter(loan => loan.status === 'active');
  const pendingLoans = userLoans.filter(loan => loan.status === 'pending');
  const historyLoans = userLoans.filter(loan => ['returned', 'cancelled'].includes(loan.status));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'overdue': return <AlertTriangle size={16} />;
      case 'returned': return <Package size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return <Package size={16} />;
    }
  };

  const getDaysUntilDue = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleReturn = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowReturnModal(true);
  };

  const handleExtension = (loan: Loan) => {
    setSelectedLoan(loan);
    setShowExtensionModal(true);
  };

  const confirmReturn = () => {
    if (selectedLoan) {
      returnItem(selectedLoan.id);
      setShowReturnModal(false);
      setSelectedLoan(null);
    }
  };

  const confirmExtension = () => {
    if (selectedLoan) {
      requestExtension(selectedLoan.id, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setShowExtensionModal(false);
      setSelectedLoan(null);
    }
  };

  const LoanCard: React.FC<{ loan: Loan }> = ({ loan }) => {
    const item = getItemById(loan.itemId);
    const daysUntilDue = getDaysUntilDue(loan.endDate);
    
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={item?.images[0] || '/placeholder-image.jpg'}
              alt={item?.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{item?.name}</h3>
              <p className="text-sm text-gray-600">{item?.category}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(loan.status)}`}>
                  {getStatusIcon(loan.status)}
                  <span className="capitalize">{loan.status}</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Quantity: {loan.quantity}</p>
            <p className="text-sm text-gray-500">
              Due: {loan.endDate.toLocaleDateString()}
            </p>
            {loan.status === 'active' && (
              <p className={`text-sm font-medium ${
                daysUntilDue <= 0 ? 'text-red-600' : ''
              }`}>
                {daysUntilDue <= 0 ? 'Overdue' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Requested: {loan.requestedAt.toLocaleDateString()}</p>
              {loan.notes && <p>Notes: {loan.notes}</p>}
            </div>
            
            <div className="flex space-x-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Eye size={16} />
              </button>
              
              {loan.status === 'active' && (
                <>
                  <button
                    onClick={() => handleExtension(loan)}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-md hover:bg-yellow-700 transition-colors flex items-center space-x-1"
                  >
                    <RotateCcw size={14} />
                    <span>Extend</span>
                  </button>
                  <button
                    onClick={() => handleReturn(loan)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                  >
                    Return
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const currentLoans = activeTab === 'active' ? activeLoans : 
                     activeTab === 'pending' ? pendingLoans : historyLoans;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('My Loans')}</h1>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download size={20} />
          <span>{t('Export Report')}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { key: 'active', label: t('Active Loans'), count: activeLoans.length },
            { key: 'pending', label: t('Pending'), count: pendingLoans.length },
            { key: 'history', label: t('History'), count: historyLoans.length }
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
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Loans List */}
      {currentLoans.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('No ' + activeTab + ' loans found')}
          </h3>
          <p className="text-gray-600">
            {activeTab === 'active' && t("You don't have any active loans at the moment.")}
            {activeTab === 'pending' && t("You don't have any pending loan requests.")}
            {activeTab === 'history' && t("You haven't completed any loans yet.")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentLoans.map(loan => (
            <LoanCard key={loan.id} loan={loan} />
          ))}
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Return</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to return "{getItemById(selectedLoan.itemId)?.name}"?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowReturnModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReturn}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extension Modal */}
      {showExtensionModal && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Extension</h3>
            <p className="text-gray-600 mb-6">
              Request a 7-day extension for "{getItemById(selectedLoan.itemId)?.name}"?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowExtensionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmExtension}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Request Extension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};