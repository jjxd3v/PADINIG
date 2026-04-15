export type ApiAnnouncement = {
  id: string;
  title: string;
  message: string;
  category: string;
  status: string;
  deliveryMethod: string;
  scheduledDate?: string | null;
  publishedDate?: string | null;
  isEmergency: boolean;
  targetAudience: string;
  recipientsCount: number;
  createdAt: string;
  updatedAt: string;
};

// UI shape kept compatible with existing components
export type UiAnnouncement = {
  id: string;
  title: string;
  message: string;
  category: any;
  date: string;
  status: any;
  targetAudience: string[];
  deliveryMethod: any;
  recipientsCount?: number;
  isEmergency?: boolean;
};

function splitAudience(raw: string): string[] {
  const v = (raw || '').trim();
  if (!v) return ['All'];
  if (v.toUpperCase() === 'ALL') return ['All'];
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function mapStatus(status: string): 'Sent' | 'Pending' | 'Cancelled' | 'Draft' {
  const s = (status || '').toUpperCase();
  if (s === 'PUBLISHED') return 'Sent';
  if (s === 'PENDING') return 'Pending';
  if (s === 'CANCELLED') return 'Cancelled';
  return 'Draft';
}

function mapDelivery(method: string): 'SMS' | 'Web' | 'Both' {
  const m = (method || '').toUpperCase();
  if (m === 'SMS') return 'SMS';
  // Backend uses WEB for web platform.
  return 'Web';
}

export function toUiAnnouncement(a: ApiAnnouncement): UiAnnouncement {
  const date = a.publishedDate || a.scheduledDate || a.createdAt;
  return {
    id: a.id,
    title: a.title,
    message: a.message,
    category: a.category,
    date,
    status: mapStatus(a.status),
    targetAudience: splitAudience(a.targetAudience),
    deliveryMethod: mapDelivery(a.deliveryMethod),
    recipientsCount: a.recipientsCount,
    isEmergency: a.isEmergency,
  };
}

