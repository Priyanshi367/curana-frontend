// Hook to fetch and manage dynamic menu items based on user role

import { useState, useEffect, useRef } from 'react';
import { MenuItem } from '@/types/menu';
import { fetchMenuForRole } from '@/services/menuService';
import { getUserRole } from '@/services/auth';
import { logMenuTree, getMenuStats } from '@/utils/menuDebug';

// Cache object to store menu items by role
const menuCache: Record<string, { items: MenuItem[]; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

export function useDynamicMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const loadingRef = useRef(false);

  useEffect(() => {
    const loadMenu = async () => {
      // Prevent multiple simultaneous loads
      if (loadingRef.current) return;
      
      try {
        loadingRef.current = true;
        setLoading(true);
        setError(null);
        
        const userRole = getUserRole();
        if (!userRole) {
          throw new Error('User role not found. Please log in again.');
        }

        // Check if we have a recent cached version (skip cache if refreshTrigger changed)
        const cachedMenu = menuCache[userRole];
        const now = Date.now();
        
        if (refreshTrigger === 0 && cachedMenu && (now - cachedMenu.timestamp) < CACHE_DURATION) {
          console.log('📦 Using cached menu for role:', userRole);
          setMenuItems(cachedMenu.items);
          return;
        }

        console.log(`🔐 Loading menu for role: ${userRole}`);
        const items = await fetchMenuForRole(userRole);
        
        // Cache the results
        menuCache[userRole] = {
          items,
          timestamp: now
        };
        
        // Debug logging
        console.group('📋 Menu Loaded');
        console.log('Items:', items);
        logMenuTree(items);
        const stats = getMenuStats(items);
        console.log('Stats:', stats);
        console.groupEnd();
        
        setMenuItems(items);
      } catch (err: any) {
        console.error('❌ Error loading menu:', err);
        setError(err.message || 'Failed to load menu');
        setMenuItems([]);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    };

    loadMenu();
  }, [refreshTrigger]);

  // Function to manually refresh the menu
  const refreshMenu = () => {
    const userRole = getUserRole();
    if (userRole && menuCache[userRole]) {
      delete menuCache[userRole];
    }
    setRefreshTrigger(prev => prev + 1);
  };

  return { menuItems, loading, error, refreshMenu };
}
