import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Item, Loan, Category, Notification, DashboardStats } from '../types';

interface DataContextType {
  items: Item[];
  loans: Loan[];
  categories: Category[];
  notifications: Notification[];
  dashboardStats: DashboardStats;
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  requestLoan: (loan: Omit<Loan, 'id' | 'requestedAt'>) => void;
  approveLoan: (loanId: string) => void;
  rejectLoan: (loanId: string) => void;
  returnItem: (loanId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  searchItems: (query: string) => Item[];
  getItemById: (id: string) => Item | undefined;
  getLoanById: (id: string) => Loan | undefined;
  getUserLoans: (userId: string) => Loan[];
  getOverdueLoans: () => Loan[];
  requestExtension: (loanId: string, newEndDate: Date) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalItems: 0,
    activeLoans: 0,
    pendingRequests: 0,
    overdueItems: 0,
    totalUsers: 0,
    categoryBreakdown: [],
    loanTrends: []
  });

  useEffect(() => {
    // Initialize mock data
    const mockCategories: Category[] = [
      { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets', icon: 'Laptop', color: '#3b82f6', itemCount: 25 },
      { id: '2', name: 'Tools', description: 'Hand tools and equipment', icon: 'Wrench', color: '#10b981', itemCount: 18 },
      { id: '3', name: 'Books', description: 'Books and publications', icon: 'Book', color: '#f59e0b', itemCount: 42 },
      { id: '4', name: 'Furniture', description: 'Office and home furniture', icon: 'Home', color: '#8b5cf6', itemCount: 12 },
      { id: '5', name: 'Sports', description: 'Sports equipment and gear', icon: 'Trophy', color: '#ef4444', itemCount: 15 }
    ];

    const mockItems: Item[] = [
      {
        id: '1',
        name: 'MacBook Pro 16"',
        description: 'High-performance laptop for development work',
        category: 'Electronics',
        tags: ['laptop', 'apple', 'development'],
        condition: 'excellent',
        quantity: 5,
        availableQuantity: 3,
        images: ['https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800'],
        qrCode: 'QR001',
        location: 'IT Room A',
        value: 2500,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        isActive: true
      },
      {
        id: '2',
        name: 'Drill Set Professional',
        description: 'Complete drill set with various bits',
        category: 'Tools',
        tags: ['drill', 'construction', 'professional'],
        condition: 'good',
        quantity: 3,
        availableQuantity: 2,
        images: ['https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg?auto=compress&cs=tinysrgb&w=800'],
        qrCode: 'QR002',
        location: 'Tool Storage',
        value: 150,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        isActive: true
      },
      {
        id: '3',
        name: 'JavaScript: The Good Parts',
        description: 'Essential JavaScript programming book',
        category: 'Books',
        tags: ['javascript', 'programming', 'development'],
        condition: 'good',
        quantity: 2,
        availableQuantity: 1,
        images: ['https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800'],
        qrCode: 'QR003',
        location: 'Library',
        value: 35,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
        isActive: true
      },
      {
        id: '4',
        name: 'Ergonomic Office Chair',
        description: 'Adjustable office chair with lumbar support',
        category: 'Furniture',
        tags: ['chair', 'office', 'ergonomic'],
        condition: 'excellent',
        quantity: 8,
        availableQuantity: 5,
        images: ['https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&w=800'],
        qrCode: 'QR004',
        location: 'Office Storage',
        value: 400,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
        isActive: true
      },
      {
        id: '5',
        name: 'Tennis Racket Set',
        description: 'Professional tennis racket with carrying case',
        category: 'Sports',
        tags: ['tennis', 'sports', 'recreation'],
        condition: 'good',
        quantity: 6,
        availableQuantity: 4,
        images: ['https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800'],
        qrCode: 'QR005',
        location: 'Sports Equipment',
        value: 120,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03'),
        isActive: true
      }
    ];

    const mockLoans: Loan[] = [
      {
        id: '1',
        itemId: '1',
        userId: '1',
        quantity: 1,
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-01-27'),
        status: 'active',
        notes: 'For project development',
        approvedBy: 'admin',
        approvedAt: new Date('2024-01-19'),
        requestedAt: new Date('2024-01-18'),
        remindersSent: 1
      },
      {
        id: '2',
        itemId: '2',
        userId: '2',
        quantity: 1,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-01-22'),
        status: 'overdue',
        notes: 'Home renovation project',
        approvedBy: 'admin',
        approvedAt: new Date('2024-01-14'),
        requestedAt: new Date('2024-01-13'),
        remindersSent: 2
      },
      {
        id: '3',
        itemId: '3',
        userId: '3',
        quantity: 1,
        startDate: new Date('2024-01-25'),
        endDate: new Date('2024-02-01'),
        status: 'pending',
        notes: 'Learning JavaScript',
        requestedAt: new Date('2024-01-24'),
        remindersSent: 0
      }
    ];

    const mockNotifications: Notification[] = [
      {
        id: '1',
        userId: '1',
        type: 'loan_due',
        title: 'Loan Due Tomorrow',
        message: 'MacBook Pro 16" is due for return tomorrow',
        isRead: false,
        createdAt: new Date(),
        relatedId: '1'
      },
      {
        id: '2',
        userId: '2',
        type: 'loan_approved',
        title: 'Loan Approved',
        message: 'Your loan request for Drill Set Professional has been approved',
        isRead: false,
        createdAt: new Date(),
        relatedId: '2'
      }
    ];

    setCategories(mockCategories);
    setItems(mockItems);
    setLoans(mockLoans);
    setNotifications(mockNotifications);
    
    // Calculate dashboard stats
    const stats: DashboardStats = {
      totalItems: mockItems.length,
      activeLoans: mockLoans.filter(l => l.status === 'active').length,
      pendingRequests: mockLoans.filter(l => l.status === 'pending').length,
      overdueItems: mockLoans.filter(l => l.status === 'overdue').length,
      totalUsers: 25,
      categoryBreakdown: mockCategories.map(c => ({ category: c.name, count: c.itemCount })),
      loanTrends: [
        { date: '2024-01-15', count: 12 },
        { date: '2024-01-16', count: 8 },
        { date: '2024-01-17', count: 15 },
        { date: '2024-01-18', count: 22 },
        { date: '2024-01-19', count: 18 },
        { date: '2024-01-20', count: 25 },
        { date: '2024-01-21', count: 20 }
      ]
    };
    setDashboardStats(stats);
  }, []);

  const addItem = (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newItem: Item = {
      ...itemData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, itemData: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...itemData, updatedAt: new Date() } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const requestLoan = (loanData: Omit<Loan, 'id' | 'requestedAt'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString(),
      requestedAt: new Date(),
      status: 'pending',
      remindersSent: 0
    };
    setLoans(prev => [...prev, newLoan]);
  };

  const approveLoan = (loanId: string) => {
    setLoans(prev => prev.map(loan => 
      loan.id === loanId ? { 
        ...loan, 
        status: 'active', 
        approvedAt: new Date(),
        approvedBy: 'admin' 
      } : loan
    ));
  };

  const rejectLoan = (loanId: string) => {
    setLoans(prev => prev.map(loan => 
      loan.id === loanId ? { ...loan, status: 'cancelled' } : loan
    ));
  };

  const returnItem = (loanId: string) => {
    setLoans(prev => prev.map(loan => 
      loan.id === loanId ? { 
        ...loan, 
        status: 'returned', 
        actualReturnDate: new Date() 
      } : loan
    ));
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const searchItems = (query: string): Item[] => {
    if (!query.trim()) return items;
    
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getItemById = (id: string): Item | undefined => {
    return items.find(item => item.id === id);
  };

  const getLoanById = (id: string): Loan | undefined => {
    return loans.find(loan => loan.id === id);
  };

  const getUserLoans = (userId: string): Loan[] => {
    return loans.filter(loan => loan.userId === userId);
  };

  const getOverdueLoans = (): Loan[] => {
    return loans.filter(loan => loan.status === 'overdue');
  };

  const requestExtension = (loanId: string, newEndDate: Date) => {
    setLoans(prev => prev.map(loan => 
      loan.id === loanId ? { 
        ...loan, 
        extensionRequested: true,
        extensionEndDate: newEndDate,
        status: 'pending'
      } : loan
    ));
  };

  const value: DataContextType = {
    items,
    loans,
    categories,
    notifications,
    dashboardStats,
    addItem,
    updateItem,
    deleteItem,
    requestLoan,
    approveLoan,
    rejectLoan,
    returnItem,
    markNotificationRead,
    searchItems,
    getItemById,
    getLoanById,
    getUserLoans,
    getOverdueLoans,
    requestExtension
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};