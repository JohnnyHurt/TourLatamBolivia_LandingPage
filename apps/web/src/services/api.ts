import {
  ApiResponse,
  EventSettingsDTO,
  PageSectionDTO,
  FocusAreaDTO,
  SpeakerDTO,
  SponsorDTO,
  AgendaItemDTO,
  TicketTypeDTO,
  FAQDTO,
  TestimonialDTO,
  MediaDTO,
  AuditLogDTO,
  UserDTO,
  AuthResponse,
} from '@tourlatam/types';

function getApiBase(): string {
  const rawUrl = ((import.meta.env.VITE_API_URL as string) || '').trim();
  if (!rawUrl) return '/api';

  // Strip trailing slashes
  const cleanUrl = rawUrl.replace(/\/+$/, '');

  // If the user specified e.g. "https://api.onrender.com" without "/api", append "/api"
  if (!cleanUrl.endsWith('/api')) {
    return `${cleanUrl}/api`;
  }
  return cleanUrl;
}

const API_BASE = getApiBase();

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('tourlatam_admin_token');

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.error || data.message || 'Error executing request');
  }

  return data.data;
}

export const api = {
  // Public Endpoints
  getEventInfo: () => fetcher<EventSettingsDTO>('/public/event-info'),
  getPageSections: () => fetcher<PageSectionDTO[]>('/public/page-sections'),
  getFocusAreas: () => fetcher<FocusAreaDTO[]>('/public/focus-areas'),
  getSpeakers: () => fetcher<SpeakerDTO[]>('/public/speakers'),
  getSpeakerBySlug: (slug: string) => fetcher<SpeakerDTO>(`/public/speakers/${slug}`),
  getSponsors: () => fetcher<SponsorDTO[]>('/public/sponsors'),
  getAgenda: () => fetcher<AgendaItemDTO[]>('/public/agenda'),
  getTickets: () => fetcher<TicketTypeDTO[]>('/public/tickets'),
  getFAQs: () => fetcher<FAQDTO[]>('/public/faqs'),
  getTestimonials: () => fetcher<TestimonialDTO[]>('/public/testimonials'),

  // Auth
  login: (credentials: { email: string; password: string }) =>
    fetcher<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  logout: () => fetcher<{ message: string }>('/auth/logout', { method: 'POST' }),
  getCurrentUser: () => fetcher<UserDTO>('/auth/me'),

  // Admin CMS CRUD
  updateEventSettings: (data: Partial<EventSettingsDTO>) =>
    fetcher<EventSettingsDTO>('/admin/event-settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  reorderSections: (items: { id: string; displayOrder: number; isVisible: boolean }[]) =>
    fetcher<{ message: string }>('/admin/page-sections/reorder', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),

  // Speakers CMS
  createSpeaker: (data: Partial<SpeakerDTO>) =>
    fetcher<SpeakerDTO>('/admin/speakers', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSpeaker: (id: string, data: Partial<SpeakerDTO>) =>
    fetcher<SpeakerDTO>(`/admin/speakers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSpeaker: (id: string) =>
    fetcher<{ message: string }>(`/admin/speakers/${id}`, { method: 'DELETE' }),

  // Sponsors CMS
  createSponsor: (data: Partial<SponsorDTO>) =>
    fetcher<SponsorDTO>('/admin/sponsors', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSponsor: (id: string, data: Partial<SponsorDTO>) =>
    fetcher<SponsorDTO>(`/admin/sponsors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSponsor: (id: string) =>
    fetcher<{ message: string }>(`/admin/sponsors/${id}`, { method: 'DELETE' }),

  // Tickets CMS
  createTicket: (data: Partial<TicketTypeDTO>) =>
    fetcher<TicketTypeDTO>('/admin/tickets', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTicket: (id: string, data: Partial<TicketTypeDTO>) =>
    fetcher<TicketTypeDTO>(`/admin/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTicket: (id: string) =>
    fetcher<{ message: string }>(`/admin/tickets/${id}`, { method: 'DELETE' }),

  // Agenda CMS
  createAgendaItem: (data: Partial<AgendaItemDTO>) =>
    fetcher<AgendaItemDTO>('/admin/agenda', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAgendaItem: (id: string, data: Partial<AgendaItemDTO>) =>
    fetcher<AgendaItemDTO>(`/admin/agenda/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteAgendaItem: (id: string) =>
    fetcher<{ message: string }>(`/admin/agenda/${id}`, { method: 'DELETE' }),

  // Media Library
  getMedia: () => fetcher<MediaDTO[]>('/admin/media'),
  uploadMedia: (formData: FormData) =>
    fetcher<MediaDTO>('/admin/media/upload', {
      method: 'POST',
      body: formData,
    }),
  deleteMedia: (id: string) =>
    fetcher<{ message: string }>(`/admin/media/${id}`, { method: 'DELETE' }),

  // Users & RBAC (Admin Only)
  getUsers: () => fetcher<UserDTO[]>('/admin/users'),
  createUser: (data: { name: string; email: string; password: string; role: string }) =>
    fetcher<UserDTO>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getAuditLogs: (page = 1) =>
    fetcher<{ total: number; page: number; limit: number; totalPages: number; logs: AuditLogDTO[] }>(
      `/admin/audit-logs?page=${page}`
    ),
};
