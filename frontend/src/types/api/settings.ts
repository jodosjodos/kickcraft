export interface StoreSettings {
  id: string;
  key: string;
  storeName: string;
  storeEmail: string;
  phone: string;
  timezone: string;
  currency: string;
  language: string;
  updatedAt: string;
}

export interface UpdateStoreSettingsPayload {
  storeName?: string;
  storeEmail?: string;
  phone?: string;
  timezone?: string;
  currency?: string;
  language?: string;
}

export interface NotifPref {
  email: boolean;
  inApp: boolean;
}

export type NotificationPrefsMap = Record<string, NotifPref>;

export interface NotificationPrefs {
  id: string;
  adminId: string;
  prefs: NotificationPrefsMap;
}

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  twoFactorEnabled: boolean;
}

export interface CreateAdminPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface Session {
  id: string;
  userId: string;
  userAgent: string | null;
  ip: string | null;
  lastSeenAt: string | null;
  createdAt: string;
}

export interface TwoFASetup {
  secret: string;
  qrDataUrl: string;
}
