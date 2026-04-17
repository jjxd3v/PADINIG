// Intent detection service for chatbot
// Uses keyword matching and heuristics for reliable intent classification

export type ChatIntent = 
  | 'QUERY_ANNOUNCEMENTS'
  | 'QUERY_EMERGENCY'
  | 'QUERY_PUROK_SPECIFIC'
  | 'QUERY_CATEGORY'
  | 'QUERY_SERVICES'
  | 'QUERY_CLEARANCE'
  | 'QUERY_ID'
  | 'QUERY_RESIDENCY'
  | 'QUERY_BLOTTER'
  | 'QUERY_CONTACT'
  | 'QUERY_HOURS'
  | 'QUERY_LOCATION'
  | 'GREETING'
  | 'FAREWELL'
  | 'THANKS'
  | 'HELP'
  | 'GENERAL';

export interface IntentResult {
  intent: ChatIntent;
  confidence: number;
  entities: {
    purok?: string;
    category?: string;
    service?: string;
  };
}

// Purok names for entity extraction
const PUROK_NAMES = [
  'avocado', 'calamansi', 'citrus', 'citrus i', 'citrus ii', 
  'evergreen', 'grapes', 'mangga', 'mangga i', 'mangga ii'
];

// Category names
const CATEGORIES = [
  'emergency', 'health', 'disaster', 'event', 'government', 'general'
];

// Intent patterns with keywords
const INTENT_PATTERNS: Record<ChatIntent, string[]> = {
  QUERY_ANNOUNCEMENTS: [
    'announcement', 'announcements', 'news', 'latest', 'update', 'updates',
    'what\'s new', 'whats new', 'may bago', 'latest news', 'any news',
    'show announcements', 'list announcements', 'recent announcements',
    'pahayag', 'balita', 'anunsyo', 'may announcement'
  ],
  QUERY_EMERGENCY: [
    'emergency', 'urgent', 'alert', 'warning', 'critical',
    'typhoon', 'flood', 'baha', 'sunog', 'fire', 'earthquake', 'lindol',
    'evacuation', 'evacuate', 'safety', 'danger', 'peril',
    'may emergency', 'may sunog', 'may baha', 'may bagyo'
  ],
  QUERY_PUROK_SPECIFIC: [
    ...PUROK_NAMES,
    'in my area', 'my purok', 'my zone', 'sa purok', 'sa amin'
  ],
  QUERY_CATEGORY: [
    ...CATEGORIES,
    'health', 'medical', 'checkup', 'dental', 'health center',
    'disaster', 'typhoon', 'flood', 'preparedness',
    'event', 'activity', 'celebration', 'festival',
    'government', 'official', 'barangay business',
    'general', 'announcement'
  ],
  QUERY_SERVICES: [
    'service', 'services', 'serbisyo', 'available services',
    'what can you do', 'help me with', 'barangay services',
    'services offered', 'available'
  ],
  QUERY_CLEARANCE: [
    'clearance', 'barangay clearance', 'brgy clearance',
    'police clearance', 'residency clearance', 'requirement',
    'how to get clearance', 'paano kumuha ng clearance',
    'clearance requirements', 'processing clearance'
  ],
  QUERY_ID: [
    'id', 'barangay id', 'brgy id', 'identification', 'resident id',
    'id card', 'identification card', 'kuha ng id', 'paano kumuha ng id',
    'id requirements', 'valid id'
  ],
  QUERY_RESIDENCY: [
    'residency', 'certificate of residency', 'residence certificate',
    'proof of residency', 'nakatira', 'resident', 'residency cert',
    'residency requirements'
  ],
  QUERY_BLOTTER: [
    'blotter', 'complaint', 'report', 'incident', 'magsumbong',
    'magsumbong', 'irereport', 'complaint', 'problema', 'away',
    'neighbor problem', 'barangay blotter', 'how to file blotter'
  ],
  QUERY_CONTACT: [
    'contact', 'number', 'phone', 'cellphone', 'mobile', 'hotline',
    'email', 'reach', 'call', 'text', 'kontak', 'tawag', 'telepono',
    'how to contact', 'contact info', 'contact number'
  ],
  QUERY_HOURS: [
    'hour', 'hours', 'open', 'close', 'time', 'schedule', 'or',
    'oras', 'sara', 'bukas', 'kailan bukas', 'what time',
    'office hours', 'operating hours', 'business hours',
    'when open', 'bukas ba', 'hanggang kailan'
  ],
  QUERY_LOCATION: [
    'location', 'address', 'where', 'saan', 'pumunta', 'punta',
    'how to get there', 'saan ang', 'lugar', 'barangay hall',
    'hall location', 'opisina', 'office location'
  ],
  GREETING: [
    'hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon',
    'good evening', 'kumusta', 'musta', 'mabuhay', 'magandang umaga',
    'magandang hapon', 'magandang gabi', 'kamusta', 'kumusta ka',
    'hoy', 'uy', 'psst'
  ],
  FAREWELL: [
    'bye', 'goodbye', 'see you', 'paalam', 'adios', 'ciao',
    'thank you bye', 'salamat paalam'
  ],
  THANKS: [
    'thank', 'thanks', 'salamat', 'thank you', 'maraming salamat',
    'maraming salamat po', 'ty', 'thanks a lot', 'appreciate',
    'helpful', 'useful'
  ],
  HELP: [
    'help', 'tulong', 'tulungan', 'help me', 'i need help',
    'can you help', 'what can you do', 'how to use', 'guide',
    'assistance', 'pwede ba', 'pwede mo ba', 'assist'
  ],
  GENERAL: []
};

export function detectIntent(message: string): IntentResult {
  const lowerMessage = message.toLowerCase().trim();
  
  // Extract entities
  const entities: IntentResult['entities'] = {};
  
  // Extract purok
  for (const purok of PUROK_NAMES) {
    if (lowerMessage.includes(purok.toLowerCase())) {
      entities.purok = purok;
      break;
    }
  }
  
  // Extract category
  for (const category of CATEGORIES) {
    if (lowerMessage.includes(category.toLowerCase())) {
      entities.category = category;
      break;
    }
  }
  
  // Score each intent
  const scores: Record<ChatIntent, number> = {} as Record<ChatIntent, number>;
  
  for (const [intent, keywords] of Object.entries(INTENT_PATTERNS)) {
    scores[intent as ChatIntent] = 0;
    
    for (const keyword of keywords) {
      // Exact match gets higher score
      if (lowerMessage.includes(keyword.toLowerCase())) {
        // Longer keyword matches = higher confidence
        scores[intent as ChatIntent] += keyword.length;
      }
    }
  }
  
  // Find best matching intent
  let bestIntent: ChatIntent = 'GENERAL';
  let bestScore = 0;
  
  for (const [intent, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestIntent = intent as ChatIntent;
    }
  }
  
  // Calculate confidence (normalize by message length)
  const confidence = Math.min(bestScore / (lowerMessage.length * 0.5), 1);
  
  // Boost confidence for specific entity matches
  let finalConfidence = confidence;
  if (entities.purok && (bestIntent === 'QUERY_ANNOUNCEMENTS' || bestIntent === 'QUERY_EMERGENCY')) {
    finalConfidence = Math.min(confidence + 0.2, 1);
  }
  
  return {
    intent: bestIntent,
    confidence: finalConfidence,
    entities
  };
}

// Helper to check if intent is a query type
export function isQueryIntent(intent: ChatIntent): boolean {
  return intent.startsWith('QUERY_');
}

// Helper to get intent display name
export function getIntentDisplayName(intent: ChatIntent): string {
  const names: Record<ChatIntent, string> = {
    QUERY_ANNOUNCEMENTS: 'Announcement Query',
    QUERY_EMERGENCY: 'Emergency Query',
    QUERY_PUROK_SPECIFIC: 'Purok Query',
    QUERY_CATEGORY: 'Category Query',
    QUERY_SERVICES: 'Services Query',
    QUERY_CLEARANCE: 'Clearance Query',
    QUERY_ID: 'ID Query',
    QUERY_RESIDENCY: 'Residency Query',
    QUERY_BLOTTER: 'Blotter Query',
    QUERY_CONTACT: 'Contact Query',
    QUERY_HOURS: 'Hours Query',
    QUERY_LOCATION: 'Location Query',
    GREETING: 'Greeting',
    FAREWELL: 'Farewell',
    THANKS: 'Thanks',
    HELP: 'Help Request',
    GENERAL: 'General'
  };
  return names[intent];
}
