// src/services/events.ts
import { getToken } from './auth';
import { UserRole } from '@/types/menu';

const API_URL = import.meta.env.VITE_STRAPI_API_URL;

interface EventData {
  id: number;
  documentId: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  date: string;
  location: string;
  eventtype: string;
  role?: Array<{
    id: number;
    role: string;
  }>;
}

export interface EventResponse {
  data: EventData[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Fetch all events from Strapi
 */
export const fetchEvents = async (): Promise<EventResponse> => {
  try {
    const token = getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/events?populate=*`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Fetch and process events for a specific user role
 */
// In events.ts, update the fetchEventsForRole function
export const fetchEventsForRole = async (userRole: UserRole): Promise<EventData[]> => {
  try {
    const response = await fetchEvents();
    
    if (!response.data) {
      console.warn('No events data found in response');
      return [];
    }

    // Add null checks for role data
    return response.data.filter((event) => {
      // If event has no roles data, show to everyone
      if (!event?.role?.length) {
        return true;
      }
      
      // Check if user's role is in the event's allowed roles
      return event.role.some(
        (r: any) => r?.role === userRole || r?.role === 'all'
      );
    });
  } catch (error) {
    console.error('Error processing events:', error);
    throw error;
  }
};

/**
 * Format event date for display
 */
export const formatEventDate = (dateString: string) => {
  if (!dateString) return { month: '', day: '', time: '' };
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { month: '', day: '', time: '' };
  
  return {
    month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
    day: date.getDate().toString().padStart(2, '0'),
    time: date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  };
};