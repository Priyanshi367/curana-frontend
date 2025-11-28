// Menu types for Strapi v4 dynamic menu system

export type UserRole = 'provider' | 'health_plan_user' | 'corporate' | 'admin' | 'all';

export interface VisibleRole {
  id: number;
  role: UserRole;
}

export interface MenuItemData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  url: string;
  icon: string;
  visible: boolean;
  order: number | null;
  visible_roles: VisibleRole[];
  menus: MenuItemData[]; // Children from populate
  parent: {
    id: number;
    documentId: string;
    title: string;
    url: string;
  } | null;
}

export interface MenuResponse {
  data: MenuItemData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface MenuItem {
  id: number;
  documentId: string;
  title: string;
  url: string;
  icon: string;
  visible: boolean;
  order: number | null;
  visible_roles: VisibleRole[];
  parent: {
    id: number;
    documentId: string;
    title: string;
    url: string;
  } | null;
  children?: MenuItem[];
}

export interface User {
  id: number;
  email: string;
  username?: string;
  role?: {
    id: number;
    name: string;
    type: string;
  };
}
