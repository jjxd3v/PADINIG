export type Category =
'General' |
'Health' |
'Disaster' |
'Event' |
'Government' |
'Emergency';
export type Status = 'Sent' | 'Pending' | 'Cancelled' | 'Draft';
export type DeliveryMethod = 'SMS' | 'Web' | 'Both';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: Category;
  date: string;
  status: Status;
  targetAudience: string[];
  deliveryMethod: DeliveryMethod;
  recipientsCount?: number;
  isEmergency?: boolean;
}

export interface Resident {
  id: string;
  name: string;
  contactNumber: string;
  purok: string;
  registrationDate: string;
  status: 'Active' | 'Inactive';
}

export const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return `Scheduled for ${date.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }

  if (diffInSeconds < 60) return 'Just now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
  return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
  return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getAnnouncements = (): Announcement[] => {
  const data = localStorage.getItem('padinig_announcements');
  return data ? JSON.parse(data) : [];
};

export const saveAnnouncements = (announcements: Announcement[]) => {
  localStorage.setItem('padinig_announcements', JSON.stringify(announcements));
};

export const checkAndUpdateScheduled = () => {
  const announcements = getAnnouncements();
  let updated = false;
  const now = new Date();

  const newAnnouncements = announcements.map((a) => {
    if (a.status === 'Pending' && new Date(a.date) <= now) {
      updated = true;
      return { ...a, status: 'Sent' as Status };
    }
    return a;
  });

  if (updated) {
    saveAnnouncements(newAnnouncements);
  }
};

export const getResidents = (): Resident[] => {
  const data = localStorage.getItem('padinig_residents');
  return data ? JSON.parse(data) : [];
};

export const saveResidents = (residents: Resident[]) => {
  localStorage.setItem('padinig_residents', JSON.stringify(residents));
};

export const puroks = [
'Purok Avocado',
'Purok Calamansi',
'Purok Citrus I',
'Purok Citrus II',
'Purok Evergreen',
'Purok Grapes',
'Purok Mangga I',
'Purok Mangga II'];