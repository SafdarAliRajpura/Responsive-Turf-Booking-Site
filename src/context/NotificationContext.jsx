import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiClient';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [latestToast, setLatestToast] = useState(null);

    const fetchNotifications = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await apiClient.get('/notifications');
            const notificationsArray = res.data.data || [];
            setNotifications(notificationsArray);
            const unread = notificationsArray.filter(n => !n.isRead).length;
            
            // If new unread notifications arrive, trigger a toast for the most recent one
            if (unread > unreadCount && notificationsArray[0]) {
                const newNotif = notificationsArray[0];
                if (!newNotif.isRead) {
                    setLatestToast(newNotif);
                    // Clear toast after 5 seconds
                    setTimeout(() => setLatestToast(null), 5000);
                }
            }
            
            setUnreadCount(unread);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    }, [unreadCount]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchNotifications();
            // Poll for notifications every 3 seconds for a high-end "live" feel
            const interval = setInterval(fetchNotifications, 3000);
            return () => clearInterval(interval);
        }
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await apiClient.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            await apiClient.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read:', err);
        }
    };

    const clearNotifications = async () => {
        try {
            await apiClient.delete('/notifications/clear-all');
            setNotifications([]);
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to clear notifications:', err);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            latestToast,
            setLatestToast,
            markAsRead,
            markAllRead,
            clearNotifications,
            refresh: fetchNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
