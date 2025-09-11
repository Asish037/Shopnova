import { useContext } from 'react';
import { CartContext } from '../Context/CartContext';

/**
 * Custom hook for authentication functionality
 * @returns {Object} Authentication state and methods
 */
export const useAuth = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useAuth must be used within a CartProvider');
  }

  const { user, token, login, logout, setAuthToken } = context;

  return {
    // State
    user,
    token,
    isAuthenticated: !!(user && token),
    
    // Methods
    login,
    logout,
    setAuthToken,
    
    // Helper methods
    hasToken: !!token,
    hasUser: !!user,
    getUserId: () => user?.id || user?.user_id,
    getUserPhone: () => user?.phone,
    getUserName: () => user?.name || user?.username,
  };
};
