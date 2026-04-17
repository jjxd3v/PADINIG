import { Router } from 'express';
import { z } from 'zod';
import { ok, fail } from '../lib/responses.js';
import { validateBody } from '../middleware/validate.js';
import { detectIntent, type ChatIntent, isQueryIntent } from '../services/chatIntent.js';
import {
  fetchLatestAnnouncements,
  fetchEmergencyAlerts,
  fetchAnnouncementsByCategory,
  getBarangayServicesInfo,
  getContactInfo,
  getOfficeHours,
  getLocationInfo,
  getEmergencyInfo,
  getGreeting,
  getHelpMessage,
  type AnnouncementData,
} from '../services/chatDataFetchers.js';
import { findFAQByKeywords } from '../data/barangayFAQ.js';
import { detectLanguage, getLanguageInstruction, type Language } from '../services/chatLanguage.js';
import {
  buildBaseSystemPrompt,
  buildAnnouncementPrompt,
  buildFAQPrompt,
  buildGreetingPrompt,
  buildHelpPrompt,
  buildPurokPrompt,
  buildContactPrompt,
  buildHoursPrompt,
  buildGeneralPrompt,
  buildFarewellPrompt,
  buildThanksPrompt,
} from '../lib/chatTemplates.js';

const router = Router();

const messageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1),
});

const userContextSchema = z.object({
  name: z.string().optional(),
  purok: z.string().optional(),
  userId: z.string().optional(),
});

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
  userContext: userContextSchema.optional(),
});

function getGroqKey(): string {
  const key = process.env.GROQ_API_KEY?.trim();
  if (!key) throw new Error('GROQ_API_KEY is not set');
  return key;
}

function getGroqModel(): string {
  return (process.env.GROQ_MODEL?.trim() || 'llama-3.1-8b-instant');
}

interface ChatResponse {
  reply: string;
  intent: ChatIntent;
  detectedLanguage?: Language;
  data?: {
    announcements?: AnnouncementData[];
    faq?: { question: string; answer: string };
  };
  actions?: {
    type: 'view_announcements' | 'view_emergency' | 'contact_barangay' | 'view_faq' | 'visit_office';
    label: string;
    link?: string;
  }[];
}

async function processIntent(
  intent: ChatIntent,
  userMessage: string,
  userContext?: { name?: string; purok?: string; userId?: string },
  language?: Language
): Promise<ChatResponse> {
  const context = userContext || {};
  const lang = language || 'ENGLISH';
  
  switch (intent) {
    case 'GREETING': {
      const greeting = getGreeting(context.name);
      const prompt = buildGreetingPrompt(greeting, true, context);
      const reply = await getAIResponse(prompt, context, lang);
      return {
        reply,
        intent,
        actions: [
          { type: 'view_announcements', label: 'View Announcements' },
          { type: 'view_faq', label: 'Barangay Services' },
        ],
      };
    }

    case 'FAREWELL': {
      const prompt = buildFarewellPrompt(context);
      const reply = await getAIResponse(prompt, context, lang);
      return { reply, intent };
    }

    case 'THANKS': {
      const prompt = buildThanksPrompt();
      const reply = await getAIResponse(prompt, context, lang);
      return { reply, intent };
    }

    case 'HELP': {
      const prompt = buildHelpPrompt();
      const reply = await getAIResponse(prompt, context, lang);
      return {
        reply,
        intent,
        actions: [
          { type: 'view_announcements', label: 'Latest Announcements' },
          { type: 'view_faq', label: 'Barangay Services' },
          { type: 'contact_barangay', label: 'Contact Barangay' },
        ],
      };
    }

    case 'QUERY_ANNOUNCEMENTS': {
      const announcements = await fetchLatestAnnouncements(5, context.purok);
      const prompt = buildAnnouncementPrompt(announcements, 'latest', undefined, context.purok);
      const reply = await getAIResponse(prompt, context, lang);
      return {
        reply,
        intent,
        data: { announcements },
        actions: announcements.length > 0 
          ? [{ type: 'view_announcements', label: 'View All Announcements' }]
          : undefined,
      };
    }

    case 'QUERY_EMERGENCY': {
      const emergencies = await fetchEmergencyAlerts(context.purok);
      const prompt = buildAnnouncementPrompt(emergencies, 'emergency', undefined, context.purok);
      const reply = await getAIResponse(prompt, context, lang);
      return {
        reply,
        intent,
        data: { announcements: emergencies },
        actions: emergencies.length > 0
          ? [
              { type: 'view_emergency', label: 'View Emergency Details' },
              { type: 'contact_barangay', label: 'Contact Emergency Hotline' },
            ]
          : [{ type: 'view_emergency', label: 'Emergency Information' }],
      };
    }

    case 'QUERY_CATEGORY': {
      // Try to extract category from message
      const categoryMatch = userMessage.match(/(emergency|health|disaster|event|government|general)/i);
      const category = categoryMatch ? categoryMatch[1] : 'General';
      const announcements = await fetchAnnouncementsByCategory(category, context.purok);
      const prompt = buildAnnouncementPrompt(announcements, 'category', category, context.purok);
      const reply = await getAIResponse(prompt, context, lang);
      return {
        reply,
        intent,
        data: { announcements },
        actions: announcements.length > 0
          ? [{ type: 'view_announcements', label: `View All ${category} Announcements` }]
          : undefined,
      };
    }

    case 'QUERY_PUROK_SPECIFIC': {
      // Extract purok name from message
      const purokMatch = userMessage.match(/(avocado|calamansi|citrus|evergreen|grapes|mangga)/i);
      const purok = purokMatch ? purokMatch[1] : context.purok;
      if (purok) {
        const announcements = await fetchLatestAnnouncements(5, purok);
        const prompt = buildPurokPrompt(purok, announcements);
        const reply = await getAIResponse(prompt, context, lang);
        return {
          reply,
          intent,
          data: { announcements },
        };
      }
      // Fallback to general
      const prompt = buildGeneralPrompt(userMessage, context);
      const reply = await getAIResponse(prompt, context, lang);
      return { reply, intent: 'GENERAL' };
    }

    case 'QUERY_SERVICES':
    case 'QUERY_CLEARANCE':
    case 'QUERY_ID':
    case 'QUERY_RESIDENCY':
    case 'QUERY_BLOTTER': {
      // Try to find matching FAQ
      const faq = findFAQByKeywords(userMessage);
      if (faq) {
        const prompt = buildFAQPrompt(faq.question, faq.answer, context);
        const reply = await getAIResponse(prompt, context, lang);
        return {
          reply,
          intent,
          data: { faq: { question: faq.question, answer: faq.answer } },
          actions: [
            { type: 'visit_office', label: 'Visit Barangay Hall' },
            { type: 'contact_barangay', label: 'Call for Inquiry' },
          ],
        };
      }
      // Fallback to services list
      const services = getBarangayServicesInfo();
      const servicesText = services.map(s => `${s.question}: ${s.answer}`).join('\n\n');
      const prompt = buildFAQPrompt('Barangay Services', servicesText, context);
      const reply = await getAIResponse(prompt, context, lang);
      return {
        reply,
        intent,
        actions: [
          { type: 'view_faq', label: 'View All Services' },
          { type: 'visit_office', label: 'Visit Barangay Hall' },
        ],
      };
    }

    case 'QUERY_CONTACT': {
      const contact = getContactInfo();
      const prompt = buildContactPrompt(context);
      const reply = await getAIResponse(prompt, context, lang);
      return {
        reply,
        intent,
        actions: [
          { type: 'contact_barangay', label: 'Call Barangay Hotline' },
        ],
      };
    }

    case 'QUERY_HOURS': {
      const hours = getOfficeHours();
      const prompt = buildHoursPrompt();
      const reply = await getAIResponse(prompt, context, lang);
      return {
        reply,
        intent,
        actions: [
          { type: 'visit_office', label: 'Plan Your Visit' },
        ],
      };
    }

    case 'QUERY_LOCATION': {
      const location = getLocationInfo();
      const prompt = buildFAQPrompt(location.question, location.answer, context);
      const reply = await getAIResponse(prompt, context, lang);
      return {
        reply,
        intent,
        actions: [
          { type: 'visit_office', label: 'Get Directions' },
        ],
      };
    }

    default: {
      // Try FAQ first
      const faq = findFAQByKeywords(userMessage);
      if (faq) {
        const prompt = buildFAQPrompt(faq.question, faq.answer, context);
        const reply = await getAIResponse(prompt, context, lang);
        return {
          reply,
          intent: 'GENERAL',
          data: { faq: { question: faq.question, answer: faq.answer } },
        };
      }
      
      // General fallback
      const prompt = buildGeneralPrompt(userMessage, context);
      const reply = await getAIResponse(prompt, context, lang);
      return { reply, intent: 'GENERAL' };
    }
  }
}

async function getAIResponse(prompt: string, context?: { name?: string; purok?: string }, language?: Language): Promise<string> {
  const lang = language || 'ENGLISH';
  const systemPrompt = buildBaseSystemPrompt(context) + '\n\n' + getLanguageInstruction(lang);
  
  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getGroqKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: getGroqModel(),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 400,
      stream: false,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Groq API error: ${resp.status}`);
  }

  const data = (await resp.json()) as any;
  return data?.choices?.[0]?.message?.content || '';
}

router.post('/', validateBody(chatSchema), async (req, res, next) => {
  try {
    const { messages, userContext } = req.body as z.infer<typeof chatSchema>;
    
    // Get the last user message
    const lastUserMessage = messages
      .filter(m => m.role === 'user')
      .pop()?.content || '';
    
    // Detect intent and language
    const intentResult = detectIntent(lastUserMessage);
    const languageResult = detectLanguage(lastUserMessage);
    console.log(`[Chat] Detected intent: ${intentResult.intent} (confidence: ${intentResult.confidence.toFixed(2)})`);
    console.log(`[Chat] Detected language: ${languageResult.language} (confidence: ${languageResult.confidence.toFixed(2)})`);
    
    // Process based on intent
    let response: ChatResponse;
    
    try {
      response = await processIntent(intentResult.intent, lastUserMessage, userContext, languageResult.language);
    } catch (intentError) {
      console.error('[Chat] Intent processing error:', intentError);
      // Fallback to general AI response
      const prompt = buildGeneralPrompt(lastUserMessage, userContext);
      const reply = await getAIResponse(prompt, userContext, languageResult.language);
      response = { reply, intent: 'GENERAL', detectedLanguage: languageResult.language };
    }
    
    // Add detected language to response
    response.detectedLanguage = languageResult.language;

    return res.json(ok(response));
  } catch (err) {
    return next(err);
  }
});

export default router;

