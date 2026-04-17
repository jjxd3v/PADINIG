// Comprehensive FAQ database for Barangay Purisima
// Structured knowledge base for chatbot responses

export interface FAQEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
  category: 'services' | 'contact' | 'location' | 'emergency' | 'general';
  relatedQuestions?: string[];
}

export const barangayFAQ: FAQEntry[] = [
  // SERVICES - Clearance
  {
    id: 'clearance-1',
    question: 'How do I get a Barangay Clearance?',
    answer: 'To get a Barangay Clearance:\n\n1. Visit the Barangay Hall during office hours (Mon-Fri 8AM-5PM, Sat 8AM-12PM)\n2. Bring a valid ID (driver\'s license, passport, or any government-issued ID)\n3. Fill out the Barangay Clearance application form\n4. Pay the processing fee (varies depending on purpose)\n5. Wait 1-2 days for processing\n6. Return to pick up your clearance or receive via SMS notification\n\nNote: Processing fee depends on the purpose (employment, business, etc.)',
    keywords: ['clearance', 'barangay clearance', 'brgy clearance', 'how to get clearance', 'paano kumuha ng clearance', 'clearance requirements', 'police clearance'],
    category: 'services',
    relatedQuestions: ['clearance-2', 'clearance-3']
  },
  {
    id: 'clearance-2',
    question: 'What are the requirements for Barangay Clearance?',
    answer: 'Requirements for Barangay Clearance:\n\n📋 Required Documents:\n• Valid ID (Driver\'s License, Passport, SSS/GSIS ID, Voter\'s ID, etc.)\n• Proof of Residency (if ID doesn\'t show current address):\n  - Utility bill (Meralco, Maynilad/Manila Water, PLDT)\n  - Lease contract\n  - Affidavit of residency from neighbors\n\n💰 Processing Fee:\n• Varies by purpose (usually ₱50-₱200)\n• Employment: ~₱100\n• Business: ~₱150-₱200\n• Travel: ~₱50\n\n⏱️ Processing Time: 1-2 business days',
    keywords: ['clearance requirements', 'requirements for clearance', 'requirements', 'needed for clearance', 'ano ang kailangan sa clearance', 'documents for clearance'],
    category: 'services',
    relatedQuestions: ['clearance-1']
  },
  {
    id: 'clearance-3',
    question: 'How long does it take to process Barangay Clearance?',
    answer: 'Barangay Clearance Processing Time:\n\n⏱️ Standard Processing: 1-2 business days\n\n📝 Same-day processing may be available for urgent cases (additional fee may apply)\n\n📱 You will receive an SMS notification when your clearance is ready for pickup\n\n📍 Pickup Location: Barangay Hall, Purisima Street\n\n⏰ Pickup Hours: Same as office hours (Mon-Fri 8AM-5PM, Sat 8AM-12PM)',
    keywords: ['processing time', 'how long', 'when ready', 'kailan matatapos', 'clearance processing', 'days to process'],
    category: 'services',
    relatedQuestions: ['clearance-1', 'clearance-2']
  },

  // SERVICES - Barangay ID
  {
    id: 'id-1',
    question: 'How do I get a Barangay ID?',
    answer: 'To get a Barangay ID:\n\n1. Visit the Barangay Hall\n2. Bring proof of residency:\n   - Utility bill (not older than 3 months)\n   - Lease contract\n   - Barangay Clearance as residency proof\n3. Fill out the ID application form\n4. Have your photo taken (or bring 2x2 photo)\n5. Pay the processing fee (usually ₱100-₱150)\n6. Wait 3-5 days for processing and printing\n7. Pick up your ID or receive via SMS notification\n\n✅ Validity: 1 year from date of issue\n🔄 Renewal: Same process with expired ID',
    keywords: ['id', 'barangay id', 'brgy id', 'identification', 'resident id', 'id card', 'kuha ng id', 'paano kumuha ng id', 'id requirements'],
    category: 'services',
    relatedQuestions: ['id-2', 'id-3']
  },
  {
    id: 'id-2',
    question: 'What are the requirements for Barangay ID?',
    answer: 'Barangay ID Requirements:\n\n📋 Required Documents:\n• Proof of Residency (any of the following):\n  - Utility bill (Meralco, Maynilad, PLDT - within last 3 months)\n  - Lease contract\n  - Barangay Clearance\n  - Sworn affidavit of residency from 2 neighbors\n• 2x2 photo (optional, can be taken at Barangay Hall)\n• Valid ID for verification\n\n💰 Fee: ₱100-₱150 (varies)\n\n⏱️ Processing: 3-5 days\n\n📅 Validity: 1 year',
    keywords: ['id requirements', 'requirements for id', 'ano ang kailangan sa id', 'documents for id', 'id documents'],
    category: 'services',
    relatedQuestions: ['id-1']
  },
  {
    id: 'id-3',
    question: 'How long is Barangay ID valid?',
    answer: 'Barangay ID Validity:\n\n📅 Validity Period: 1 year from date of issue\n\n🔄 Renewal Process:\n• Bring expired ID\n• Fill out renewal form\n• Pay renewal fee (usually discounted, ~₱75-₱100)\n• 1-2 days processing for renewal\n\n⚠️ Important:\n• Renew before expiration to avoid penalties\n• Keep ID safe - replacement fee applies for lost IDs\n• Update address if you move to another purok',
    keywords: ['id validity', 'how long valid', 'expire', 'expired', 'validity', 'renewal', 'renew', 'hanggang kailan valid'],
    category: 'services',
    relatedQuestions: ['id-1', 'id-2']
  },

  // SERVICES - Certificate of Residency
  {
    id: 'residency-1',
    question: 'How do I get a Certificate of Residency?',
    answer: 'To get a Certificate of Residency:\n\n1. Visit the Barangay Hall during office hours\n2. Present proof of residence (any of the following):\n   - Utility bill in your name\n   - Lease contract\n   - Barangay ID\n   - Affidavit of residency from 2 barangay residents\n3. Fill out the Certificate of Residency request form\n4. Pay processing fee (usually ₱50-₱100)\n5. Wait 1-2 days for verification and processing\n6. Pick up your certificate or receive SMS notification\n\nNote: This certifies you\'ve been residing in the barangay for at least 6 months.',
    keywords: ['residency', 'certificate of residency', 'residence certificate', 'proof of residency', 'nakatira', 'resident', 'residency cert', 'paano kumuha ng residency'],
    category: 'services'
  },

  // SERVICES - Certificate of Indigency
  {
    id: 'indigency-1',
    question: 'How do I get a Certificate of Indigency?',
    answer: 'To get a Certificate of Indigency:\n\n1. Visit the Barangay Hall\n2. Request for assessment interview with Barangay Captain or authorized personnel\n3. Provide supporting documents showing financial status:\n   - Proof of income (payslip, certificate of employment with salary)\n   - Or affidavit of unemployment/no income source\n   - Valid ID\n4. Barangay will conduct assessment/home visitation if needed\n5. Fill out request form\n6. Pay minimal processing fee (₱25-₱50)\n7. Wait 2-3 days for processing\n8. Certificate will be issued if approved\n\nNote: This is for low-income residents seeking government assistance.',
    keywords: ['indigency', 'certificate of indigency', 'indigent', 'mahirap', 'financial assistance', 'wala pang pera', 'poor'],
    category: 'services'
  },

  // SERVICES - Good Moral Character
  {
    id: 'goodmoral-1',
    question: 'How do I get a Certificate of Good Moral Character?',
    answer: 'To get a Certificate of Good Moral Character:\n\n1. Visit the Barangay Hall\n2. Bring requirements:\n   - Valid ID\n   - Barangay Clearance\n   - NBI Clearance (for employment/education purposes)\n   - 2x2 photo\n3. Fill out request form\n4. Barangay will conduct background check\n5. Pay processing fee (₱100-₱150)\n6. Wait 3-5 days for processing\n7. Pick up certificate when ready\n\nNote: This certifies you have no record of misconduct in the barangay.',
    keywords: ['good moral', 'good moral character', 'moral character certificate', 'walang record', 'no criminal record'],
    category: 'services'
  },

  // SERVICES - Blotter/Complaint
  {
    id: 'blotter-1',
    question: 'How do I file a blotter or complaint?',
    answer: 'To file a Blotter or Complaint:\n\n1. Visit the Barangay Hall immediately\n2. Approach the Barangay Secretary, Tanod, or Duty Officer\n3. Provide complete details:\n   - Date, time, and location of incident\n   - Names of persons involved\n   - Description of what happened\n   - Any witnesses present\n   - Evidence (if any)\n4. Fill out the Blotter Report form\n5. Get a copy of the blotter entry\n6. Barangay will investigate and schedule hearing if needed\n\n🚨 For crimes in progress or immediate danger: Call 911 first!\n\nNote: Barangay blotter is required before filing police report for most cases.',
    keywords: ['blotter', 'complaint', 'report', 'incident', 'magsumbong', 'irereport', 'problema', 'away', 'neighbor problem', 'barangay blotter', 'how to file blotter'],
    category: 'services'
  },
  {
    id: 'blotter-2',
    question: 'What is a Barangay Blotter?',
    answer: 'What is a Barangay Blotter?\n\n📖 A Barangay Blotter is an official record of:\n• Complaints filed with the barangay\n• Incidents reported to barangay authorities\n• Disputes between residents\n• Any matter requiring barangay intervention\n\n📋 Common reasons for filing:\n• Neighbor disputes\n• Noise complaints\n• Property disputes\n• Physical altercations\n• Theft or vandalism\n• Violation of barangay ordinances\n\n⚖️ Legal Importance:\n• Required before police report for certain cases\n• Used as evidence in court proceedings\n• Shows good faith effort to resolve disputes amicably\n• Can be used for protection orders\n\n💡 Filing a blotter is FREE. The barangay must accept and record all valid complaints.',
    keywords: ['what is blotter', 'blotter meaning', 'para saan ang blotter', 'blotter purpose', 'complaint record'],
    category: 'services',
    relatedQuestions: ['blotter-1']
  },

  // CONTACT INFORMATION
  {
    id: 'contact-1',
    question: 'What is the barangay contact number?',
    answer: 'Barangay Purisima Contact Information:\n\n📞 Landline Hotline: (032) 123-4567\n📱 Mobile/Viber: 0917-123-4567\n📧 Email: barangay.purisima@gmail.com\n\n🚨 Emergency Contacts:\n• National Emergency: 911\n• Barangay Emergency: 0917-123-4567\n• Fire Department: 160\n• Police: 166\n• Ambulance: 911 or 0917-123-4567\n\n💬 Social Media:\n• Facebook: Barangay Purisima Official\n\nYou can call or text during office hours. For emergencies, someone is always available at the emergency hotline.',
    keywords: ['contact', 'number', 'phone', 'cellphone', 'mobile', 'hotline', 'email', 'reach', 'call', 'text', 'kontak', 'tawag', 'telepono', 'paano tumawag'],
    category: 'contact'
  },
  {
    id: 'contact-2',
    question: 'What is the barangay email address?',
    answer: 'Barangay Purisima Email:\n\n📧 Primary Email: barangay.purisima@gmail.com\n\n📧 Use email for:\n• Non-urgent inquiries\n• Document requests (follow up)\n• Feedback and suggestions\n• Official correspondence\n\n📞 For urgent matters, please call:\n• Hotline: (032) 123-4567\n• Mobile: 0917-123-4567\n\n⏱️ Email Response Time: 1-2 business days',
    keywords: ['email', 'email address', 'e-mail', 'mail', 'send email', 'contact email'],
    category: 'contact'
  },

  // LOCATION & HOURS
  {
    id: 'location-1',
    question: 'Where is the barangay hall located?',
    answer: 'Barangay Purisima Location:\n\n📍 Address:\nPurisima Street, Barangay Purisima\nPurisima, Philippines\n\n🏢 Landmarks:\n• Beside Barangay Health Center\n• Near the Community Plaza\n• Across from Purisima Elementary School\n\n🚌 How to Get There:\n• Jeepney routes: Any jeepney passing through Purisima Street\n• Tell driver: "Barangay Hall Purisima" or "Health Center Purisima"\n• Walk: 5 minutes from main road\n\n🗺️ GPS Coordinates:\nAvailable on Google Maps - Search "Barangay Hall Purisima"\n\n♿ Accessibility: Wheelchair accessible entrance available',
    keywords: ['location', 'address', 'where', 'saan', 'pumunta', 'punta', 'how to get there', 'saan ang', 'lugar', 'barangay hall', 'hall location', 'opisina', 'office location'],
    category: 'location'
  },
  {
    id: 'hours-1',
    question: 'What are the office hours?',
    answer: 'Barangay Purisima Office Hours:\n\n🗓️ Monday - Friday: 8:00 AM to 5:00 PM\n🗓️ Saturday: 8:00 AM to 12:00 PM (Noon)\n🗓️ Sunday: Closed\n🗓️ Holidays: Closed (unless emergency)\n\n⏰ Best Time to Visit:\n• Morning: 8:00 AM - 11:00 AM (less crowded)\n• Afternoon: 2:00 PM - 4:00 PM\n\n🚨 After Hours Emergency:\nFor emergencies outside office hours:\n• Call 911 (National Emergency Hotline)\n• Call Barangay Emergency: 0917-123-4567\n\n💡 Tips:\n• Come early to avoid long lines\n• Bring complete requirements\n• Check Project Padinig for announcements about schedule changes',
    keywords: ['hours', 'open', 'close', 'time', 'schedule', 'or', 'oras', 'sara', 'bukas', 'kailan bukas', 'what time', 'office hours', 'operating hours', 'business hours', 'when open', 'bukas ba', 'hanggang kailan'],
    category: 'location'
  },

  // EMERGENCY
  {
    id: 'emergency-1',
    question: 'What should I do during an emergency?',
    answer: '🚨 Emergency Procedures:\n\n1️⃣ STAY CALM and assess the situation\n\n2️⃣ CALL FOR HELP:\n   • Immediate danger (fire, medical, crime): Call 911\n   • Barangay emergency: 0917-123-4567\n   • Fire: 160\n\n3️⃣ FOR NATURAL DISASTERS:\n   • Listen to radio/TV for updates\n   • Check Project Padinig for evacuation alerts\n   • Prepare emergency kit\n   • Follow evacuation orders if given\n\n4️⃣ EVACUATION:\n   • Evacuation centers will be announced via:\n     - SMS alerts\n     - Project Padinig announcements\n     - Barangay tanod announcements\n   • Bring emergency kit\n   • Help elderly and children\n\n📋 EMERGENCY KIT:\n• Water (3 days supply)\n• Food (3 days, ready-to-eat)\n• First aid kit\n• Flashlight + batteries\n• Important documents (in waterproof container)\n• Cash and medicines\n\nStay safe and follow official instructions only!',
    keywords: ['emergency', 'what to do', 'evacuation', 'sunog', 'baha', 'typhoon', 'bagyo', 'lindol', 'earthquake', 'emergency procedure', 'delikado', 'danger'],
    category: 'emergency'
  },
  {
    id: 'emergency-2',
    question: 'What is the emergency hotline?',
    answer: '🚨 Emergency Hotlines:\n\n🆘 National Emergency: 911\n(Calls are free from any phone)\n\n🏘️ Barangay Emergency: 0917-123-4567\n(Available 24/7 for barangay-related emergencies)\n\n🔥 Fire Department: 160\n\n👮 Police: 166 or 911\n\n🚑 Medical Emergency: 911 or 0917-123-4567\n\n⚡ MERALCO: 16211\n\n💧 Manila Water/Maynilad: 1627\n\nSave these numbers in your phone! 📱\n\nRemember: For life-threatening emergencies, always call 911 first.',
    keywords: ['emergency hotline', 'emergency number', '911', 'sunog', 'baha', 'rescue', 'tulong', 'emergency contact', 'hotline number'],
    category: 'emergency'
  },

  // GENERAL
  {
    id: 'general-1',
    question: 'What is Project Padinig?',
    answer: 'What is Project Padinig?\n\n📢 Project Padinig is Barangay Purisima\'s Official Announcement System\n\n🎯 Purpose:\nTo keep all residents informed through:\n• Web platform (this website)\n• SMS notifications (for those without internet)\n• Emergency alerts (instant broadcast)\n\n📱 Features:\n• View latest announcements by category\n• Get emergency alerts immediately\n• Search past announcements\n• Access via computer or smartphone\n• Chat with bAI (me!) for questions\n\n🏘️ Coverage:\nAll 9 Puroks of Barangay Purisima:\nAvocado, Calamansi, Citrus I & II, Evergreen, Grapes, Mangga I & II\n\n💡 Benefits:\n• Fast information dissemination\n• No one misses important updates\n• Works even with basic phones (SMS)\n• Free for all residents\n\nStay connected and informed!',
    keywords: ['project padinig', 'what is padinig', 'announcement system', 'barangay system', 'paano gumagana', 'about padinig'],
    category: 'general'
  },
  {
    id: 'general-2',
    question: 'What are the puroks in Barangay Purisima?',
    answer: 'Puroks of Barangay Purisima:\n\nBarangay Purisima has 9 vibrant puroks:\n\n🥑 1. Avocado\n🍊 2. Calamansi\n🍋 3. Citrus I\n🍋 4. Citrus II\n🌲 5. Evergreen\n🍇 6. Grapes\n🥭 7. Mangga I\n🥭 8. Mangga II\n\n📍 Each purok has its own unique character and community.\n\n💡 Announcements can be targeted to specific puroks when needed, or sent to all residents.\n\n🗳️ Purok Leaders:\nEach purok has elected leaders who help coordinate with the barangay.',
    keywords: ['purok', 'puroks', 'zones', 'areas', 'barangay areas', 'ilang purok', 'list of puroks', 'mga purok'],
    category: 'general'
  },
  {
    id: 'general-3',
    question: 'Who is the Barangay Captain?',
    answer: 'Barangay Purisima Leadership:\n\n👨‍💼 Barangay Captain: [Name]\n(Term: [Year] - [Year])\n\n👥 Barangay Council Members:\n• [Name] - Kagawad (Committee on...)\n• [Name] - Kagawad\n• [Name] - Kagawad\n• [Name] - Kagawad\n• [Name] - Kagawad\n• [Name] - Kagawad\n• [Name] - Kagawad\n\n📋 Barangay Secretary: [Name]\n💰 Barangay Treasurer: [Name]\n\n⚠️ Note: Barangay officials are elected every 3 years. Current officials may have changed since last update.\n\nFor the most current information, visit the Barangay Hall or check official announcements.',
    keywords: ['barangay captain', 'kapitan', 'chairman', 'officials', 'leaders', 'sino ang kapitan', 'leader ng barangay', 'council'],
    category: 'general'
  }
];

// Helper function to find FAQ by keywords
export function findFAQByKeywords(query: string): FAQEntry | null {
  const lowerQuery = query.toLowerCase();
  
  // Find best matching FAQ
  let bestMatch: FAQEntry | null = null;
  let bestScore = 0;
  
  for (const faq of barangayFAQ) {
    let score = 0;
    
    // Check keywords
    for (const keyword of faq.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += 1;
        // Boost score for longer keyword matches
        score += keyword.length * 0.01;
      }
    }
    
    // Check if question is similar
    const questionWords = faq.question.toLowerCase().split(' ');
    for (const word of questionWords) {
      if (word.length > 3 && lowerQuery.includes(word)) {
        score += 0.5;
      }
    }
    
    if (score > bestScore && score > 0.5) {
      bestScore = score;
      bestMatch = faq;
    }
  }
  
  return bestMatch;
}

// Helper function to get FAQs by category
export function getFAQsByCategory(category: string): FAQEntry[] {
  return barangayFAQ.filter(faq => faq.category === category);
}

// Helper function to get all FAQs
export function getAllFAQs(): FAQEntry[] {
  return barangayFAQ;
}

// Helper function to get related FAQs
export function getRelatedFAQs(faqId: string): FAQEntry[] {
  const faq = barangayFAQ.find(f => f.id === faqId);
  if (!faq?.relatedQuestions) return [];
  
  return barangayFAQ.filter(f => faq.relatedQuestions?.includes(f.id));
}
