// Menu utilities for filtering, building tree, and computing URLs

import { MenuItem, MenuItemData, UserRole } from '@/types/menu';

/**
 * Filter menu items by user role
 */
export function filterMenuByRole(items: MenuItem[], userRole: UserRole): MenuItem[] {
  return items
    .filter((item) => {
      // If no visible_roles specified or empty, show to everyone
      if (!item.visible_roles || item.visible_roles.length === 0) {
        return true;
      }
      
      // Check if 'all' is in visible_roles
      const hasAll = item.visible_roles.some((vr) => vr.role === 'all');
      if (hasAll) return true;
      
      // Check if user's role is in visible_roles
      return item.visible_roles.some((vr) => vr.role === userRole);
    })
    .map((item) => ({
      ...item,
      children: item.children ? filterMenuByRole(item.children, userRole) : undefined,
    }));
}

/**
 * Build hierarchical tree from flat menu items
 */
export function buildMenuTree(items: MenuItemData[]): MenuItem[] {
  const itemMap = new Map<number, MenuItem>();
  const rootItems: MenuItem[] = [];

  // First pass: create all items
  items.forEach((item) => {
    itemMap.set(item.id, {
      id: item.id,
      documentId: item.documentId,
      title: item.title,
      url: item.url,
      icon: item.icon,
      visible: item.visible,
      order: item.order,
      visible_roles: item.visible_roles,
      parent: item.parent,
      children: [],
    });
  });

  // Second pass: build tree structure
  items.forEach((item) => {
    const menuItem = itemMap.get(item.id);
    if (!menuItem) return;

    if (item.parent) {
      // Has parent - add to parent's children
      const parent = itemMap.get(item.parent.id);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(menuItem);
      } else {
        // Parent not found, treat as root
        rootItems.push(menuItem);
      }
    } else {
      // No parent - root item
      rootItems.push(menuItem);
    }
  });

  // Sort items by order
  const sortByOrder = (items: MenuItem[]) => {
    items.sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
    items.forEach((item) => {
      if (item.children && item.children.length > 0) {
        sortByOrder(item.children);
      }
    });
  };

  sortByOrder(rootItems);
  return rootItems;
}

/**
 * Compute full URL path from parent chain
 * If item has parent, join parent.url + item.url
 */
export function computeFullUrl(item: MenuItem): string {
  // If manual_url is set, use it (future enhancement)
  // For now, use the url field directly
  return item.url;
}

/**
 * Get only visible menu items
 */
export function getVisibleMenuItems(items: MenuItem[]): MenuItem[] {
  return items
    .filter((item) => item.visible)
    .map((item) => ({
      ...item,
      children: item.children ? getVisibleMenuItems(item.children) : undefined,
    }));
}

/**
 * Flatten menu tree to array (for search, etc.)
 */
export function flattenMenuTree(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];
  
  const flatten = (items: MenuItem[]) => {
    items.forEach((item) => {
      result.push(item);
      if (item.children && item.children.length > 0) {
        flatten(item.children);
      }
    });
  };
  
  flatten(items);
  return result;
}
