import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Initial state
const initialState = {
  notifications: []
};

// Actions
const ACTIONS = {
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL'
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
    case ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
};

// Create context
const NotificationContext = createContext();

// Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: NOTIFICATION_TYPES.INFO,
      title: '',
      message: '',
      duration: 5000, // 5 seconds default
      ...notification
    };

    dispatch({
      type: ACTIONS.ADD_NOTIFICATION,
      payload: newNotification
    });

    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    dispatch({
      type: ACTIONS.REMOVE_NOTIFICATION,
      payload: id
    });
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ALL });
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, title = 'Success') => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      title,
      message
    });
  }, [addNotification]);

  const showError = useCallback((message, title = 'Error') => {
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      title,
      message,
      duration: 7000 // Errors stay longer
    });
  }, [addNotification]);

  const showWarning = useCallback((message, title = 'Warning') => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      title,
      message
    });
  }, [addNotification]);

  const showInfo = useCallback((message, title = 'Info') => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      title,
      message
    });
  }, [addNotification]);

  const value = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;