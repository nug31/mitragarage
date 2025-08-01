// API Configuration for different environments

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Base URLs
export const API_CONFIG = {
  // Development (local)
  development: {
    baseURL: 'http://localhost:3001',
    apiURL: 'http://localhost:3001/api'
  },
  
  // Production (Railway backend)
  production: {
    baseURL: import.meta.env.VITE_API_URL || 'https://mitragarage-production.up.railway.app',
    apiURL: import.meta.env.VITE_API_BASE_URL || 'https://mitragarage-production.up.railway.app/api'
  }
};

// Current environment configuration
export const currentConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: `${currentConfig.apiURL}/auth/login`,
    register: `${currentConfig.apiURL}/auth/register`,
    users: `${currentConfig.apiURL}/auth/users`,
    logout: `${currentConfig.apiURL}/auth/logout`
  },
  
  // Bookings
  bookings: {
    base: `${currentConfig.apiURL}/bookings`,
    today: `${currentConfig.apiURL}/bookings/today`,
    byId: (id: string) => `${currentConfig.apiURL}/bookings/${id}`
  },
  
  // Vehicle History
  vehicleHistory: {
    base: `${currentConfig.apiURL}/vehicle-history`,
    byVehicle: (vehicleNumber: string) => `${currentConfig.apiURL}/vehicle-history/vehicle/${vehicleNumber}`,
    autoMove: `${currentConfig.apiURL}/vehicle-history/auto-move`
  },
  
  // Inventory
  inventory: {
    base: `${currentConfig.apiURL}/inventory`,
    byId: (id: string) => `${currentConfig.apiURL}/inventory/${id}`
  },
  
  // Testimonials
  testimonials: {
    base: `${currentConfig.apiURL}/testimonials`,
    byId: (id: string) => `${currentConfig.apiURL}/testimonials/${id}`
  },
  
  // Database Management
  database: {
    init: `${currentConfig.apiURL}/database/init`,
    clear: `${currentConfig.apiURL}/database/clear`,
    seed: `${currentConfig.apiURL}/database/seed`,
    status: `${currentConfig.apiURL}/database/status`
  },
  
  // Health Check
  health: `${currentConfig.baseURL}/health`
};

// HTTP Client configuration
export const httpConfig = {
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Demo mode flag
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || isProduction;

// Demo data
export const DEMO_DATA = {
  users: [
    { id: 1, username: 'admin', role: 'admin', email: 'admin@mitragarage.com' },
    { id: 2, username: 'customer_new', role: 'customer', email: 'customer@example.com' }
  ],
  bookings: [
    {
      id: 1,
      customer_name: 'John Doe',
      customer_phone: '081234567892',
      vehicle_brand: 'Toyota',
      vehicle_model: 'Avanza',
      license_plate: 'B 1234 ABC',
      vehicleKilometer: '45000',
      service_type: 'Service Rutin',
      booking_date: '2025-08-02',
      status: 'pending'
    }
  ],
  inventory: [
    { id: 1, name: 'Oli Mesin 10W-40', category: 'Oli', quantity: 50, price: 75000 },
    { id: 2, name: 'Ban Michelin 185/65R15', category: 'Ban', quantity: 20, price: 850000 }
  ],
  testimonials: [
    { id: 1, customer_name: 'Jane Smith', rating: 5, comment: 'Pelayanan sangat memuaskan!' }
  ],
  vehicle_history: []
};

// API request helper with demo mode fallback
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  // In demo mode, return mock data for certain endpoints
  if (DEMO_MODE) {
    console.log('🎭 Demo mode: intercepting API call to', url);

    // Login endpoint
    if (url.includes('/auth/login') && options.method === 'POST') {
      const body = JSON.parse(options.body as string);
      if (body.username === 'admin' && body.password === 'admin123') {
        return {
          message: 'Login successful',
          user: DEMO_DATA.users[0],
          token: 'demo-token-admin'
        };
      }
      if (body.username === 'customer_new' && body.password === 'customer123') {
        return {
          message: 'Login successful',
          user: DEMO_DATA.users[1],
          token: 'demo-token-customer'
        };
      }
      throw new Error('Invalid credentials');
    }

    // Other GET endpoints
    if (options.method !== 'POST' && options.method !== 'PUT' && options.method !== 'DELETE') {
      if (url.includes('/bookings')) return DEMO_DATA.bookings;
      if (url.includes('/inventory')) return DEMO_DATA.inventory;
      if (url.includes('/testimonials')) return DEMO_DATA.testimonials;
      if (url.includes('/vehicle-history')) return DEMO_DATA.vehicle_history;
      if (url.includes('/auth/users')) return DEMO_DATA.users;
      if (url.includes('/health')) return { status: 'OK', service: 'Demo Mode' };
    }

    // For POST/PUT/DELETE in demo mode, just return success
    if (options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE') {
      return { success: true, message: 'Demo mode: operation simulated' };
    }
  }

  // Normal API request
  const config = {
    ...httpConfig,
    ...options,
    headers: {
      ...httpConfig.headers,
      ...getAuthHeaders(),
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }

    return await response.text();
  } catch (error) {
    console.error('API request failed:', error);

    // Fallback to demo mode if API fails in production
    if (isProduction) {
      console.log('🎭 Falling back to demo mode due to API failure');
      return apiRequest(url, { ...options, headers: { ...options.headers, 'X-Demo-Fallback': 'true' } });
    }

    throw error;
  }
};

// Environment info for debugging
export const ENV_INFO = {
  isDevelopment,
  isProduction,
  demoMode: DEMO_MODE,
  currentConfig,
  nodeEnv: import.meta.env.MODE,
  apiUrl: currentConfig.apiURL,
  baseUrl: currentConfig.baseURL
};

console.log('🔧 API Configuration:', ENV_INFO);
if (DEMO_MODE) {
  console.log('🎭 Demo mode is ENABLED - using mock data');
}
