import { apiService } from './apiClient';

// Users API endpoints
const USERS_ENDPOINTS = {
  getUsers: '/users',
  getUser: (id) => `/users/${id}`,
  createUser: '/users',
  updateUser: (id) => `/users/${id}`,
  deleteUser: (id) => `/users/${id}`
};

// Transform JSONPlaceholder user data to match our app structure
const transformUserData = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  // Map JSONPlaceholder data to our expected fields
  role: user.id <= 3 ? 'admin' : user.id <= 6 ? 'project_manager' : 'sales_agent',
  department: user.id <= 3 ? 'admin' : user.id <= 6 ? 'sales' : 'marketing',
  status: 'active',
  lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
  projects: user.id <= 3 ? ['Skyline Residences', 'Marina Heights'] : 
           user.id <= 6 ? ['Garden View Apartments'] : 
           ['Metro Plaza', 'Sunset Towers'],
  // Additional JSONPlaceholder fields
  username: user.username,
  website: user.website,
  company: user.company?.name || 'Real Estate Corp',
  address: user.address ? `${user.address.street}, ${user.address.city}` : 'N/A'
});

// Users API service
export const usersApi = {
  // Get all users
  getAllUsers: async () => {
    const response = await apiService.get(USERS_ENDPOINTS.getUsers);
    
    if (response.success) {
      return {
        ...response,
        data: response.data.map(transformUserData)
      };
    }
    
    return response;
  },

  // Get single user
  getUser: async (id) => {
    const response = await apiService.get(USERS_ENDPOINTS.getUser(id));
    
    if (response.success) {
      return {
        ...response,
        data: transformUserData(response.data)
      };
    }
    
    return response;
  },

  // Create new user
  createUser: async (userData) => {
    // TODO: Implement actual user creation when real API is available
    const response = await apiService.post(USERS_ENDPOINTS.createUser, userData);
    
    if (response.success) {
      return {
        ...response,
        data: transformUserData(response.data)
      };
    }
    
    return response;
  },

  // Update user
  updateUser: async (id, userData) => {
    // TODO: Implement actual user update when real API is available
    const response = await apiService.put(USERS_ENDPOINTS.updateUser(id), userData);
    
    if (response.success) {
      return {
        ...response,
        data: transformUserData(response.data)
      };
    }
    
    return response;
  },

  // Delete user
  deleteUser: async (id) => {
    // TODO: Implement actual user deletion when real API is available
    return await apiService.delete(USERS_ENDPOINTS.deleteUser(id));
  }
};

export default usersApi;