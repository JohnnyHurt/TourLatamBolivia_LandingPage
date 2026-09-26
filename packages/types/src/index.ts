export type Role = 'ADMIN' | 'EDITOR';

export type SponsorTier =
  | 'TITLE'
  | 'GOLD'
  | 'SILVER'
  | 'BRONZE'
  | 'MEDIA_PARTNER'
  | 'COMMUNITY_PARTNER';

export type AgendaType =
  | 'KEYNOTE'
  | 'PANEL'
  | 'WORKSHOP'
  | 'BREAK'
  | 'NETWORKING'
  | 'OTHER';

export type SectionType =
  | 'HERO'
  | 'EVENT_INFO'
  | 'ABOUT'
  | 'FOCUS_AREAS'
  | 'SPEAKERS'
  | 'AGENDA'
  | 'PRICING'
  | 'SPONSORS'
  | 'TESTIMONIALS'
  | 'FAQ'
  | 'CTA'
  | 'CUSTOM';

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventSettingsDTO {
  id: string;
  eventName: string;
  organizerName: string;
  tagline?: string;
  startDate: string;
  endDate: string;
  city: string;
  venue: string;
  address?: string;
  modality: string; // Hybrid / In-Person / Virtual
  registrationUrl: string;
  contactEmail?: string;
  contactPhone?: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroBackgroundUrl?: string;
  heroVideoUrl?: string;
  heroOverlayOpacity?: number;
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutDescription?: string;
  aboutImageUrl?: string;
  aboutVideoUrl?: string;
  gaTrackingId?: string;
  gtmId?: string;
  metaPixelId?: string;
  socialLinks?: SocialLinkDTO[];
  updatedAt: string;
}

export interface PageSectionDTO {
  id: string;
  sectionType: SectionType;
  title?: string;
  subtitle?: string;
  content?: Record<string, any>;
  displayOrder: number;
  isVisible: boolean;
  updatedAt: string;
}

export interface FocusAreaDTO {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  image?: string;
  accentColor?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SpeakerDTO {
  id: string;
  slug: string;
  name: string;
  position: string;
  company: string;
  country: string;
  photo: string;
  shortBio: string;
  fullBio: string;
  specialties: string[];
  linkedinUrl?: string;
  websiteUrl?: string;
  videoUrl?: string;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sessions?: AgendaItemDTO[];
}

export interface AgendaItemDTO {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  description?: string;
  type: AgendaType;
  speakerId?: string;
  speaker?: SpeakerDTO;
  room?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TicketTypeDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  priceBs?: number | null;
  originalPrice?: number;
  currency: string;
  startDate?: string;
  endDate?: string;
  features: string[];
  registrationUrl?: string;
  badgeText?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface SponsorDTO {
  id: string;
  name: string;
  slug: string;
  logo: string;
  website?: string;
  description?: string;
  tier: SponsorTier;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TestimonialDTO {
  id: string;
  name: string;
  position: string;
  company: string;
  photo?: string;
  quote: string;
  videoUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FAQDTO {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaDTO {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  url: string;
  storageKey: string;
  uploadedBy?: string;
  createdAt: string;
}

export interface SocialLinkDTO {
  id: string;
  platform: string;
  url: string;
  displayOrder: number;
  isActive: boolean;
}

export interface AuditLogDTO {
  id: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  timestamp: string;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
