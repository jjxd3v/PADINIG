// Data fetchers for chatbot intent responses
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AnnouncementData {
  id: string;
  title: string;
  message: string;
  category: string;
  isEmergency: boolean;
  date: Date;
  targetAudience: string;
}

export interface FAQData {
  question: string;
  answer: string;
  relatedServices?: string[];
}

// Fetch latest announcements
export async function fetchLatestAnnouncements(
  limit: number = 5,
  purok?: string
): Promise<AnnouncementData[]> {
  try {
    // Fetch all published announcements and filter in JS
    const announcements = await prisma.announcement.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { scheduledDate: 'desc' },
      take: 20, // Fetch more to allow for filtering
      select: {
        id: true,
        title: true,
        message: true,
        category: true,
        isEmergency: true,
        scheduledDate: true,
        targetAudience: true
      }
    });
    
    // Filter by purok if specified (targetAudience is a comma-separated string)
    let filtered = announcements;
    if (purok) {
      const purokLower = purok.toLowerCase();
      filtered = announcements.filter(a => {
        const audience = (a.targetAudience || '').toLowerCase();
        return audience.includes('all') || 
               audience.includes(purokLower);
      });
    }
    
    return filtered.slice(0, limit).map(a => ({
      id: a.id,
      title: a.title,
      message: a.message.substring(0, 200), // Truncate for chat
      category: a.category,
      isEmergency: a.isEmergency,
      date: a.scheduledDate || new Date(),
      targetAudience: a.targetAudience || ''
    }));
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

// Fetch emergency alerts
export async function fetchEmergencyAlerts(
  purok?: string
): Promise<AnnouncementData[]> {
  try {
    // Fetch all emergency announcements and filter in JS
    const announcements = await prisma.announcement.findMany({
      where: { status: 'PUBLISHED', isEmergency: true },
      orderBy: { scheduledDate: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        message: true,
        category: true,
        isEmergency: true,
        scheduledDate: true,
        targetAudience: true
      }
    });
    
    // Filter by purok if specified (targetAudience is a comma-separated string)
    let filtered = announcements;
    if (purok) {
      const purokLower = purok.toLowerCase();
      filtered = announcements.filter(a => {
        const audience = (a.targetAudience || '').toLowerCase();
        return audience.includes('all') || 
               audience.includes(purokLower);
      });
    }
    
    return filtered.slice(0, 5).map(a => ({
      id: a.id,
      title: a.title,
      message: a.message.substring(0, 200),
      category: a.category,
      isEmergency: a.isEmergency,
      date: a.scheduledDate || new Date(),
      targetAudience: a.targetAudience || ''
    }));
  } catch (error) {
    console.error('Error fetching emergency alerts:', error);
    return [];
  }
}

// Fetch announcements by category
export async function fetchAnnouncementsByCategory(
  category: string,
  purok?: string,
  limit: number = 5
): Promise<AnnouncementData[]> {
  try {
    // Fetch all category announcements and filter in JS
    const announcements = await prisma.announcement.findMany({
      where: { 
        status: 'PUBLISHED',
        category: category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
      },
      orderBy: { scheduledDate: 'desc' },
      take: 20,
      select: {
        id: true,
        title: true,
        message: true,
        category: true,
        isEmergency: true,
        scheduledDate: true,
        targetAudience: true
      }
    });
    
    // Filter by purok if specified (targetAudience is a comma-separated string)
    let filtered = announcements;
    if (purok) {
      const purokLower = purok.toLowerCase();
      filtered = announcements.filter(a => {
        const audience = (a.targetAudience || '').toLowerCase();
        return audience.includes('all') || 
               audience.includes(purokLower);
      });
    }
    
    return filtered.slice(0, limit).map(a => ({
      id: a.id,
      title: a.title,
      message: a.message.substring(0, 200),
      category: a.category,
      isEmergency: a.isEmergency,
      date: a.scheduledDate || new Date(),
      targetAudience: a.targetAudience || ''
    }));
  } catch (error) {
    console.error('Error fetching category announcements:', error);
    return [];
  }
}

// Get barangay services info
export function getBarangayServicesInfo(): FAQData[] {
  return [
    {
      question: 'What services does Barangay Purisima offer?',
      answer: 'Barangay Purisima offers: Barangay Clearance, Barangay ID, Certificate of Residency, Certificate of Indigency, Good Moral Character Certificate, Blotter/Complaint services, and health services at the Barangay Health Center.',
      relatedServices: ['clearance', 'id', 'certificates', 'blotter']
    },
    {
      question: 'How do I get a Barangay Clearance?',
      answer: 'To get a Barangay Clearance: 1) Visit the Barangay Hall during office hours (Mon-Fri 8AM-5PM, Sat 8AM-12PM), 2) Bring a valid ID, 3) Fill out the application form, 4) Pay the processing fee, 5) Wait 1-2 days for processing.',
      relatedServices: ['clearance']
    },
    {
      question: 'How do I get a Barangay ID?',
      answer: 'To get a Barangay ID: 1) Visit the Barangay Hall, 2) Bring proof of residency (utility bill or lease contract), 3) Fill out the ID application form, 4) Have your photo taken, 5) Pay the processing fee. The ID is valid for 1 year.',
      relatedServices: ['id']
    },
    {
      question: 'How do I get a Certificate of Residency?',
      answer: 'To get a Certificate of Residency: 1) Visit the Barangay Hall, 2) Bring proof of residence (utility bill, lease contract, or affidavit from neighbors), 3) Fill out the request form, 4) Pay the processing fee. Processing takes 1-2 days.',
      relatedServices: ['residency']
    },
    {
      question: 'How do I file a blotter/complaint?',
      answer: 'To file a blotter or complaint: 1) Visit the Barangay Hall, 2) Speak with the Barangay Secretary or Tanod, 3) Provide details of the incident (date, time, location, persons involved), 4) The barangay will investigate and schedule a hearing if needed.',
      relatedServices: ['blotter']
    }
  ];
}

// Get contact information
export function getContactInfo(): FAQData {
  return {
    question: 'How do I contact Barangay Purisima?',
    answer: 'Barangay Purisima Contact Information:\n\n📞 Hotline: (032) 123-4567\n📱 Mobile: 0917-123-4567\n📧 Email: barangay.purisima@gmail.com\n\n🚨 Emergency: Call 911 or 0917-123-4567\n\n📍 Address: Purisima Street, Barangay Purisima, Philippines\n\n🕐 Office Hours:\nMonday-Friday: 8:00 AM - 5:00 PM\nSaturday: 8:00 AM - 12:00 PM\nSunday & Holidays: Closed'
  };
}

// Get office hours
export function getOfficeHours(): FAQData {
  return {
    question: 'What are the office hours of Barangay Purisima?',
    answer: 'Barangay Purisima Office Hours:\n\n🗓️ Monday - Friday: 8:00 AM to 5:00 PM\n🗓️ Saturday: 8:00 AM to 12:00 PM\n🗓️ Sunday: Closed\n🗓️ Holidays: Closed\n\nFor emergencies outside office hours, please call:\n🚨 911 (National Emergency)\n🚨 Barangay Emergency: 0917-123-4567'
  };
}

// Get location info
export function getLocationInfo(): FAQData {
  return {
    question: 'Where is Barangay Purisima located?',
    answer: '📍 Barangay Purisima is located at:\nPurisima Street, Barangay Purisima, Philippines\n\n🚌 How to get there:\n- Take any jeepney route passing through Purisima Street\n- Landmark: Near the community plaza and Barangay Health Center\n\nThe Barangay Hall is easily accessible and located beside the Barangay Health Center for your convenience.'
  };
}

// Get emergency info
export function getEmergencyInfo(): FAQData {
  return {
    question: 'What should I do during an emergency?',
    answer: '🚨 Emergency Procedures:\n\n1. STAY CALM and assess the situation\n2. For immediate danger (fire, medical, crime): Call 911\n3. For barangay-related emergencies: Call 0917-123-4567\n4. Follow evacuation instructions if issued\n5. Check announcements on Project Padinig for updates\n\n📋 Emergency Kit Preparation:\n- Water and food for 3 days\n- First aid kit\n- Flashlight and batteries\n- Important documents in waterproof container\n- Cash and medicines\n\nEvacuation Centers will be announced through Project Padinig during actual emergencies.'
  };
}

// Get purok list
export function getPurokList(): string[] {
  return [
    'Avocado', 'Calamansi', 'Citrus I', 'Citrus II', 
    'Evergreen', 'Grapes', 'Mangga I', 'Mangga II'
  ];
}

// Get greeting based on time
export function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour >= 5 && hour < 12) {
    greeting = 'Magandang umaga';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Magandang hapon';
  } else {
    greeting = 'Magandang gabi';
  }
  
  if (name) {
    return `${greeting}, ${name}! 👋`;
  }
  
  return `${greeting}! 👋`;
}

// Get help message
export function getHelpMessage(): string {
  return `Here are some things I can help you with:\n\n📢 **Announcements**\n- "What are the latest announcements?"\n- "Any emergencies?"\n- "What's new in [your purok]?"\n\n📋 **Barangay Services**\n- "How do I get barangay clearance?"\n- "What are the requirements for barangay ID?"\n- "How to file a blotter?"\n\n📞 **Contact Information**\n- "What is the barangay contact number?"\n- "Where is the barangay hall?"\n- "What are the office hours?"\n\n💡 **Tips**\n- You can type in English or Tagalog\n- Be specific about your purok for personalized announcements\n- I'll remember our conversation during this chat session`;
}
