/**
 * Helper utilities for menu ordering operations
 */

import { MenuItem } from '@/types/menu';

/**
 * Recalculate order values for menu items after reordering
 */
export function recalculateMenuOrder(items: MenuItem[]): MenuItem[] {
  return items.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
}

/**
 * Sort menu items by order field
 */
export function sortMenuByOrder(items: MenuItem[]): MenuItem[] {
  return [...items].sort((a, b) => {
    const orderA = a.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
}

/**
 * Separate parent and child menu items
 */
export function separateParentAndChildren(items: MenuItem[]): {
  parents: MenuItem[];
  children: MenuItem[];
} {
  const parents = items.filter((item) => !item.parent);
  const children = items.filter((item) => item.parent);
  
  return { parents, children };
}

/**
 * Get children for a specific parent menu item
 */
export function getChildrenForParent(
  parentId: number,
  allItems: MenuItem[]
): MenuItem[] {
  return allItems.filter((item) => item.parent?.id === parentId);
}

/**
 * Validate menu order consistency
 */
export function validateMenuOrder(items: MenuItem[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const orders = items.map((item) => item.order).filter((o) => o !== null);
  
  // Check for duplicate orders
  const uniqueOrders = new Set(orders);
  if (uniqueOrders.size !== orders.length) {
    errors.push('Duplicate order values found');
  }
  
  // Check for gaps in order sequence
  const sortedOrders = [...orders].sort((a, b) => (a ?? 0) - (b ?? 0));
  for (let i = 0; i < sortedOrders.length - 1; i++) {
    const current = sortedOrders[i] ?? 0;
    const next = sortedOrders[i + 1] ?? 0;
    if (next - current > 1) {
      errors.push(`Gap in order sequence between ${current} and ${next}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
