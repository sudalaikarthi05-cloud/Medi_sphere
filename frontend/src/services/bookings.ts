import { api } from '../lib/api';
import type { Booking, BookingFormData } from '../types';

export async function fetchBookings(): Promise<Booking[]> {
  const raw = await api.get<Booking[]>('/bookings');
  return Array.isArray(raw) ? raw : [];
}

export async function createBooking(data: BookingFormData): Promise<Booking> {
  return api.post<Booking>('/bookings', data);
}

export async function cancelBooking(id: string): Promise<void> {
  await api.delete<void>(`/bookings/${encodeURIComponent(id)}`);
}
