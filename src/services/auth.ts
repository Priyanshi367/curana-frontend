// src/services/auth.ts
import axios from 'axios';
import { User, UserRole } from '@/types/menu';

const API_URL = import.meta.env.VITE_STRAPI_API_URL || 'http://localhost:1337/api';

export type LoginResponse = {
  jwt: string;
  user: User;
};

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'auth_user';
export const USER_ROLE_KEY = 'user_role';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
}

export function getUserRole(): UserRole | null {
  const role = localStorage.getItem(USER_ROLE_KEY);
  return role as UserRole | null;
}

export function setUserRole(role: UserRole) {
  localStorage.setItem(USER_ROLE_KEY, role);
}

export function getStoredUser(): User | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setStoredUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const res = await axios.post(`${API_URL}/auth/local`, {
    identifier: email,
    password,
  });
  const data: LoginResponse = res.data;
  setToken(data.jwt);
  
  console.log(data,'ddddddd')
  // Fetch full user with role
  const userWithRole = await getMe(data.jwt);
  setStoredUser(userWithRole);
  
  console.log(userWithRole,'userWithRoleuserWithRole')
  // Extract role type (provider, health_plan_user, corporate)
  const roleType = userWithRole.role?.type || 'provider';
  setUserRole(roleType as UserRole);
  
  return { ...data, user: userWithRole };
}

export async function getMe(token?: string): Promise<User> {
  const authToken = token || getToken();
  if (!authToken) throw new Error('Not authenticated');
  
  const res = await axios.get(`${API_URL}/users/me?populate=*`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return res.data;
}


export async function logout() {
  clearToken();
}
