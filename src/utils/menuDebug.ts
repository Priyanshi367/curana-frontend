// Debug utilities for menu system

import { MenuItem } from '@/types/menu';

/**
 * Log menu tree structure to console
 */
export function logMenuTree(items: MenuItem[], level = 0) {
  items.forEach((item) => {
    const indent = '  '.repeat(level);
    const roles = item.visible_roles?.map((vr) => vr.role).join(', ') || 'all';
    console.log(
      `${indent}├─ ${item.title} (${item.url}) [${roles}] order:${item.order ?? 'null'}`
    );
    if (item.children && item.children.length > 0) {
      logMenuTree(item.children, level + 1);
    }
  });
}

/**
 * Log menu filtering process
 */
export function logMenuFiltering(
  originalCount: number,
  afterVisibility: number,
  afterRole: number,
  userRole: string
) {
  console.group('🔍 Menu Filtering');
  console.log(`Original items: ${originalCount}`);
  console.log(`After visibility filter: ${afterVisibility}`);
  console.log(`After role filter (${userRole}): ${afterRole}`);
  console.groupEnd();
}

/**
 * Validate menu structure
 */
export function validateMenuStructure(items: MenuItem[]): string[] {
  const errors: string[] = [];

  const validate = (items: MenuItem[], path = '') => {
    items.forEach((item) => {
      const currentPath = path ? `${path} > ${item.title}` : item.title;

      // Check required fields
      if (!item.title) {
        errors.push(`${currentPath}: Missing title`);
      }
      if (!item.url) {
        errors.push(`${currentPath}: Missing url`);
      }
      if (!item.icon) {
        errors.push(`${currentPath}: Missing icon`);
      }

      // Check URL format
      if (item.url && !item.url.startsWith('/')) {
        errors.push(`${currentPath}: URL should start with / (got: ${item.url})`);
      }

      // Validate children
      if (item.children && item.children.length > 0) {
        validate(item.children, currentPath);
      }
    });
  };

  validate(items);
  return errors;
}

/**
 * Get menu statistics
 */
export function getMenuStats(items: MenuItem[]) {
  let totalItems = 0;
  let visibleItems = 0;
  let hiddenItems = 0;
  let itemsWithChildren = 0;
  const roleDistribution: Record<string, number> = {};

  const count = (items: MenuItem[]) => {
    items.forEach((item) => {
      totalItems++;
      if (item.visible) visibleItems++;
      else hiddenItems++;
      if (item.children && item.children.length > 0) {
        itemsWithChildren++;
        count(item.children);
      }

      // Count role distribution
      if (!item.visible_roles || item.visible_roles.length === 0) {
        roleDistribution['all'] = (roleDistribution['all'] || 0) + 1;
      } else {
        item.visible_roles.forEach((vr) => {
          roleDistribution[vr.role] = (roleDistribution[vr.role] || 0) + 1;
        });
      }
    });
  };

  count(items);

  return {
    totalItems,
    visibleItems,
    hiddenItems,
    itemsWithChildren,
    roleDistribution,
  };
}
