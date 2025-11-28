import axios from 'axios';
import { UserRole } from '@/types/menu';
import { getToken } from './auth';

const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337/api';

export interface RoleDefault {
  id: number;
  documentId: string;
  role: UserRole;
  menus: {
    id: number;
    documentId: string;
    title: string;
    url: string;
    icon: string;
    visible: boolean;
    order: number | null;
  };
}

export interface RoleDefaultsResponse {
  data: RoleDefault[];
}

export async function getRoleDefaultRoute(role: UserRole): Promise<string> {
  try {
    const token = getToken();
    const res = await axios.get<RoleDefaultsResponse>(`${API_URL}/api/role-defaults?populate=*`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    
    const roleDefault = res.data.data.find(rd => rd.role === role);
    console.log(roleDefault,'roleDefaultroleDefault')
    return roleDefault?.menus?.[0]?.url || '/dashboard';
  } catch (error) {
    console.error('Failed to fetch role defaults:', error);
    return '/dashboard';
  }
}
