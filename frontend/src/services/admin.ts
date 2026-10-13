import { api } from '../lib/api';
import type { AdminUser, AdminUserDetails, Booking, Patient } from '../types';

export interface AdminPatientFilters {
  search?: string;
  condition?: string;
  status?: string;
  risk?: string;
  owner?: string;
  [key: string]: string | undefined;
}

export interface AdminBookingFilters {
  search?: string;
  status?: string;
  owner?: string;
  [key: string]: string | undefined;
}

function buildQuery(filters: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `?${query}` : '';
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const raw = await api.get<AdminUser[]>('/admin/users');
  return Array.isArray(raw) ? raw : [];
}

export async function fetchAdminUserDetails(email: string): Promise<AdminUserDetails> {
  const raw = await api.get<AdminUserDetails>(`/admin/users/${encodeURIComponent(email)}/details`);
  return {
    patients: Array.isArray(raw?.patients) ? raw.patients : [],
    bookings: Array.isArray(raw?.bookings) ? raw.bookings : [],
  };
}

export async function fetchAllPatients(filters: AdminPatientFilters = {}): Promise<Patient[]> {
  const raw = await api.get<Patient[]>(`/admin/patients${buildQuery(filters)}`);
  return Array.isArray(raw) ? raw : [];
}

export async function fetchAllBookings(filters: AdminBookingFilters = {}): Promise<Booking[]> {
  const raw = await api.get<Booking[]>(`/admin/bookings${buildQuery(filters)}`);
  return Array.isArray(raw) ? raw : [];
}
