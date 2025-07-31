export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
  phoneNumber?: string;
  department?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  quantity: number;
  availableQuantity: number;
  images: string[];
  qrCode: string;
  location: string;
  value: number;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  maintenanceSchedule?: Date;
}

export interface Loan {
  id: string;
  itemId: string;
  userId: string;
  quantity: number;
  startDate: Date;
  endDate: Date;
  actualReturnDate?: Date;
  status: 'pending' | 'approved' | 'active' | 'overdue' | 'returned' | 'cancelled';
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  requestedAt: Date;
  remindersSent: number;
  extensionRequested?: boolean;
  extensionApproved?: boolean;
  extensionEndDate?: Date;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  itemCount: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'loan_due' | 'loan_approved' | 'loan_rejected' | 'item_returned' | 'maintenance_due';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedId?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: Date;
  ipAddress: string;
}

export interface DashboardStats {
  totalItems: number;
  activeLoans: number;
  pendingRequests: number;
  overdueItems: number;
  totalUsers: number;
  categoryBreakdown: { category: string; count: number }[];
  loanTrends: { date: string; count: number }[];
}