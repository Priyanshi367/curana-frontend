// Service to fetch menu items from Strapi API
import { MenuResponse, MenuItem, MenuItemData } from '@/types/menu';
import { getToken } from './auth';
import { buildMenuTree, filterMenuByRole, getVisibleMenuItems } from '@/utils/menuUtils';

const API_URL = import.meta.env.VITE_STRAPI_API_URL;

/**
 * Fetch all menu items from Strapi
 */
export const fetchMenuItems = async (): Promise<MenuResponse> => {
  try {
    const token = getToken();
    const headers: HeadersInit = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/menus?populate=*`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch menu items: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw error;
  }
};

/**
 * Fetch and process menu items for a specific user role
 */
export const fetchMenuForRole = async (userRole: string): Promise<MenuItem[]> => {
  const response = await fetchMenuItems();
  
  // Build tree structure
  const tree = buildMenuTree(response.data);
  
  // Filter by visibility
  const visibleItems = getVisibleMenuItems(tree);
  
  // Filter by user role
  const roleFilteredItems = filterMenuByRole(visibleItems, userRole as any);
  
  return roleFilteredItems;
};
