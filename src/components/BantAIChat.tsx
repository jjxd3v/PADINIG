import React, { useCallback, useEffect, useState, useRef } from 'react';
import { X, Send, User, Sparkles, Megaphone, Phone, MapPin, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ApiAnnouncement } from '../lib/announcements';
type ChatUserProfile = {
  name?: string | null;
  avatarUrl?: string | null;
  purok?: string | null;
  id?: string | null;
};
const BAI_AVATAR = "/bai-avatar.png";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  data?: {
    announcements?: ApiAnnouncement[];
    faq?: { question: string; answer: string };
  };
  actions?: Array<{
    type: 'view_announcements' | 'view_emergency' | 'contact_barangay' | 'view_faq' | 'visit_office';
    label: string;
    link?: string;
  }>;
}

type Language = 'ENGLISH' | 'TAGALOG' | 'BISAYA' | 'TAGLISH';

interface ChatResponse {
  reply: string;
  intent: string;
  detectedLanguage?: Language;
  data?: {
    announcements?: ApiAnnouncement[];
    faq?: { question: string; answer: string };
  };
  actions?: Array<{
    type: 'view_announcements' | 'view_emergency' | 'contact_barangay' | 'view_faq' | 'visit_office';
    label: string;
    link?: string;
  }>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001';

const quickRepliesByLanguage: Record<Language, string[]> = {
  ENGLISH: [
    'What are the latest announcements?',
    'Any emergencies in my area?',
    'How do I get barangay clearance?',
    'What are the office hours?',
    'How to contact the barangay?'
  ],
  TAGALOG: [
    'Ano ang mga latest na announcement?',
    'May emergency ba sa aming lugar?',
    'Paano kumuha ng barangay clearance?',
    'Ano ang office hours?',
    'Paano makontak ang barangay?'
  ],
  BISAYA: [
    'Unsa ang bag-ong announcement?',
    'Naay emergency sa among lugar?',
    'Unsaon pagkuha og barangay clearance?',
    'Unsa ang office hours?',
    'Unsaon pagkontak sa barangay?'
  ],
  TAGLISH: [
    'Ano ang latest announcements?',
    'May emergency ba sa area namin?',
    'Paano kumuha ng barangay clearance?',
    'Ano ang office hours?',
    'Paano contact ang barangay?'
  ]
};

// Simple language detection for frontend
function detectLanguage(message: string): Language {
  const lower = message.toLowerCase();
  
  // Bisaya markers (strong)
  const bisayaWords = ['kumusta', 'salamat', 'daghang', 'gihapon', 'karon', 'adto', 'diri', 'unsay', 'kinsay', 'bitaw', 'lagi', 'sus', 'ambot', 'ganahan', 'palihug', 'salig', 'bayad', 'tubag', 'pangutana', 'pila', 'asa', 'unsaon', 'akoang', 'imoang', 'atong', 'inyong', 'niini', 'niana', 'niadto', 'diha', 'naghimo', 'nagtrabaho', 'nagtuon', 'nagkaon', 'nag-inom', 'naglakaw', 'nagdagan', 'maayong', 'buntag', 'hapon', 'gabii', 'adlaw', 'gab-i', 'kaadlawan', 'higala', 'amigo', 'amiga', 'igsoon', 'manghod', 'tiyay', 'totoy', 'dili', 'ara', 'wala pa', 'nahuman', 'wa pa', 'taga-a', 'taga-as', 'taga-asa', 'asa man', 'unsa ni', 'kinsa ni', 'sa among', 'sa amoa', 'sa inyong', 'sa inyo'];
  
  // Tagalog markers
  const tagalogWords = ['kamusta', 'maraming', 'po', 'opo', 'hindi', 'meron', 'nandito', 'niyan', 'niyon', 'doon', 'paano', 'bakit', 'saan', 'kailan', 'sino', 'ano', 'alin', 'gaano', 'ilan', 'ayaw', 'kailangan', 'pwede', 'pwedeng', 'puwede', 'saklolo', 'tawag', 'tumawag', 'magtawag', 'tumulong', 'magbigay', 'punong', 'tanod', 'sekretarya', 'klerek', 'umaga', 'gabi', 'tanghali', 'madaling', 'magandang', 'maganda', 'pangit', 'mabait', 'masama', 'masaya', 'malungkot', 'siguro', 'baka', 'yata', 'daw', 'raw', 'naman', 'nga', 'ginagawa', 'nagtatrabaho', 'nag-aaral', 'kumakain', 'umiinom', 'lumalakad', 'naman', 'po', 'ho'];
  
  // Taglish markers
  const taglishWords = ['kamusta na', 'ok lang', 'sige na', 'bahala na', 'bahala ka', 'gawa na', 'nagpunta', 'nag-asikaso', 'nagprocess', 'nagfile', 'nagapply', 'nagrequest', 'nagbayad na', 'nagwork', 'nagstudy', 'nagcheck', 'nagverify', 'saan yung', 'asan ang', 'san ba', 'saan ba', 'pano mag', 'pano kumuha', 'ok na', 'pwede na', 'bawal ba', 'pwede ba', 'meron ba', 'wala ba', 'thank you po', 'thanks po', 'salamat po', 'ty po', 'salamat ha', 'hello po', 'hi po', 'excuse me po', 'pasensya na po', 'pasensya na'];
  
  let bisayaScore = 0, tagalogScore = 0, taglishScore = 0;
  
  bisayaWords.forEach(w => { if (lower.includes(w)) bisayaScore++; });
  tagalogWords.forEach(w => { if (lower.includes(w)) tagalogScore++; });
  taglishWords.forEach(w => { if (lower.includes(w)) taglishScore++; });
  
  // Strong Bisaya markers get double weight
  ['gihapon', 'karon', 'adto', 'diri', 'unsay', 'kinsay', 'bitaw', 'lagi', 'sa among', 'sa amoa'].forEach(w => { if (lower.includes(w)) bisayaScore += 2; });
  
  // Strong Tagalog markers get extra weight
  ['po', 'opo', 'ho', 'naman', 'nga', 'daw', 'raw', 'yata'].forEach(w => { if (lower.includes(w)) tagalogScore += 2; });
  
  if (bisayaScore > tagalogScore && bisayaScore > taglishScore) return 'BISAYA';
  if (taglishScore >= tagalogScore * 0.8 && taglishScore > 1) return 'TAGLISH';
  if (tagalogScore > bisayaScore) return 'TAGALOG';
  return 'ENGLISH';
}

function getQuickReplies(language: Language = 'ENGLISH'): string[] {
  return quickRepliesByLanguage[language] || quickRepliesByLanguage.ENGLISH;
}

function getFallbackResponse(input: string): string {
  const lower = input.toLowerCase();
  if (
  lower.includes('hello') ||
  lower.includes('hi') ||
  lower.includes('kumusta'))
  {
    return "Kumusta! 👋 I'm bAI, your barangay assistant. How can I help you today?";
  }
  if (lower.includes('contact') || lower.includes('number')) {
    return 'You can reach Barangay Purisima through:\n📞 Hotline: (032) 123-4567\n📱 Mobile: 0917-123-4567\n📧 Email: barangay.purisima@gmail.com';
  }
  if (lower.includes('emergency')) {
    return '🚨 For emergencies:\n🚨 Call 911 (National Emergency)\n📱 Barangay Emergency: 0917-123-4567';
  }
  return "I'm having trouble connecting right now. Please try again in a moment, or contact the Barangay Hall directly at (032) 123-4567.";
}

// Action button component
function ActionButton({ action, onClick }: { action: NonNullable<Message['actions']>[0]; onClick: () => void }) {
  const getIcon = () => {
    switch (action.type) {
      case 'view_announcements':
      case 'view_emergency':
        return <Megaphone size={14} />;
      case 'contact_barangay':
        return <Phone size={14} />;
      case 'view_faq':
        return <FileText size={14} />;
      case 'visit_office':
        return <MapPin size={14} />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light rounded-full text-xs font-medium hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors"
    >
      {getIcon()}
      {action.label}
    </button>
  );
}

// Announcement card component
function AnnouncementCard({ announcement }: { announcement: ApiAnnouncement }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-2 shadow-sm">
      <div className="flex items-start gap-2">
        <div className={`p-1.5 rounded-lg shrink-0 ${announcement.isEmergency ? 'bg-emergency/10 text-emergency' : 'bg-primary/10 text-primary'}`}>
          <Megaphone size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-slate-800 dark:text-white truncate">
            {announcement.title}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
            {announcement.message?.substring(0, 100)}...
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
              {announcement.category}
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date(announcement.scheduledDate || announcement.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export function BantAIChat({ user }: { user?: ChatUserProfile | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<Language>('ENGLISH');
  const [messages, setMessages] = useState<Message[]>([
  {
    id: 'welcome',
    text: "Mabuhay! 👋 I'm bAI, your Barangay Purisima virtual assistant. Ask me anything about barangay services, announcements, or emergencies!",
    sender: 'bot',
    timestamp: new Date()
  }]
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Load conversation history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bai-chat-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          })));
        }
      } catch {
        // Ignore parse errors
      }
    }
  }, []);
  
  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 1) {
      localStorage.setItem('bai-chat-history', JSON.stringify(messages));
    }
  }, [messages]);
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  const handleActionClick = (action: NonNullable<Message['actions']>[0]) => {
    switch (action.type) {
      case 'view_announcements':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'view_emergency':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'contact_barangay':
        window.location.href = 'tel:0321234567';
        break;
      case 'visit_office':
        // Could open map directions
        window.open('https://maps.google.com/?q=Barangay+Purisima', '_blank');
        break;
      case 'view_faq':
        // Could scroll to FAQ section or show help
        handleSend('What services do you offer?');
        break;
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping) return;
    
    // Detect language from user message for immediate UI update
    const userLang = detectLanguage(messageText);
    setDetectedLanguage(userLang);
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    
    const botMsgId = `bot-${Date.now()}`;
    
    // Add empty bot message that we'll fill
    setMessages((prev) => [
      ...prev,
      {
        id: botMsgId,
        text: '',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: messageText }],
          userContext: {
            name: user?.name || undefined,
            purok: user?.purok || undefined,
            userId: user?.id || undefined
          }
        }),
        signal: controller.signal
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      const chatResponse: ChatResponse = data?.data;
      
      if (chatResponse) {
        // Update detected language from API response
        if (chatResponse.detectedLanguage) {
          setDetectedLanguage(chatResponse.detectedLanguage);
        }
        
        // Update the bot message with rich content
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId
              ? {
                  ...msg,
                  text: chatResponse.reply || '',
                  data: chatResponse.data,
                  actions: chatResponse.actions
                }
              : msg
          )
        );
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
      console.error('bAI API error:', error);
      
      const fallback = getFallbackResponse(messageText);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, text: fallback }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };
  
  const clearConversation = () => {
    setMessages([{
      id: 'welcome',
      text: "Mabuhay! 👋 I'm bAI, your Barangay Purisima virtual assistant. Ask me anything about barangay services, announcements, or emergencies!",
      sender: 'bot',
      timestamp: new Date()
    }]);
    localStorage.removeItem('bai-chat-history');
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.9
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.9
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25
          }}
          className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-96 max-h-[70vh] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">
          
            {/* Header - Sticky and always visible */}
            <div className="bg-primary p-4 flex items-center justify-between shrink-0 shadow-lg border-b border-primary/20 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={BAI_AVATAR}
                    alt="bAI avatar"
                    className="w-11 h-11 rounded-xl object-cover border-2 border-white/30 shadow-md"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-1.5 tracking-tight">
                    bAI
                    <Sparkles size={16} className="text-yellow-300" />
                  </h3>
                  <p className="text-xs text-white/80 font-medium">
                    Barangay Purisima Assistant
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearConversation}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all text-white/80 hover:text-white text-xs font-medium border border-white/10 hover:border-white/30"
                  title="Clear conversation"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-xl transition-all text-white/80 hover:text-white border border-white/10 hover:border-white/30"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] custom-scrollbar bg-slate-50/50 dark:bg-slate-900/30">
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {/* Main message bubble */}
                  <div className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender === 'bot' ? (
                      <img
                        src={BAI_AVATAR}
                        alt="bAI"
                        className="w-7 h-7 rounded-full object-cover shrink-0"
                      />
                    ) : user?.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name ? `${user.name} avatar` : 'User avatar'}
                        className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200/60 dark:border-slate-700/60"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-secondary/10 text-secondary">
                        <User size={14} />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-primary text-white rounded-br-md'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-md shadow-sm'
                      }`}
                    >
                      {msg.text}
                      {msg.sender === 'bot' && isTyping && msg.id === messages[messages.length - 1]?.id && msg.text && (
                        <span className="inline-block w-1.5 h-4 bg-primary/50 dark:bg-primary-light/50 ml-0.5 animate-pulse rounded-sm align-middle" />
                      )}
                    </div>
                  </div>
                  
                  {/* Announcement cards for bot messages */}
                  {msg.sender === 'bot' && msg.data?.announcements && msg.data.announcements.length > 0 && (
                    <div className="ml-9.5 space-y-2">
                      {msg.data.announcements.map((announcement) => (
                        <AnnouncementCard key={announcement.id} announcement={announcement} />
                      ))}
                    </div>
                  )}
                  
                  {/* Action buttons for bot messages */}
                  {msg.sender === 'bot' && msg.actions && msg.actions.length > 0 && (
                    <div className="ml-9.5 flex flex-wrap gap-1.5">
                      {msg.actions.map((action, idx) => (
                        <ActionButton key={idx} action={action} onClick={() => handleActionClick(action)} />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator ? only show when bot message is empty (before first token) */}
              {isTyping &&
            messages[messages.length - 1]?.sender === 'bot' &&
            !messages[messages.length - 1]?.text &&
            <div className="flex gap-2.5">
                    <img
                src={BAI_AVATAR}
                alt="bAI"
                className="w-7 h-7 rounded-full object-cover shrink-0" />
              
                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex gap-1.5">
                        <span
                    className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce"
                    style={{
                      animationDelay: '0ms'
                    }}>
                  </span>
                        <span
                    className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce"
                    style={{
                      animationDelay: '150ms'
                    }}>
                  </span>
                        <span
                    className="w-2 h-2 bg-slate-300 dark:bg-slate-500 rounded-full animate-bounce"
                    style={{
                      animationDelay: '300ms'
                    }}>
                  </span>
                      </div>
                    </div>
                  </div>
            }

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 &&
          <div className="px-4 pb-2 pt-1 flex flex-wrap gap-1.5 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                {getQuickReplies(detectedLanguage).map((reply: string) =>
            <button
              key={reply}
              onClick={() => handleSend(reply)}
              className="text-[11px] font-medium px-3 py-1.5 bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-light rounded-full hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors border border-primary/10 dark:border-primary/20">
              
                    {reply}
                  </button>
            )}
              </div>
          }

            {/* Input */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all dark:text-white dark:placeholder-slate-400"
                disabled={isTyping} />
              
                <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="p-2.5 bg-primary hover:bg-primary-light text-white rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center">
                
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Floating Bubble Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-4 sm:right-6 z-[60] w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-colors overflow-hidden ${isOpen ? 'bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-400' : ''}`}
        whileHover={{
          scale: 1.05
        }}
        whileTap={{
          scale: 0.95
        }}
        aria-label="Open bAI chat">
        
        <AnimatePresence mode="wait">
          {isOpen ?
          <motion.div
            key="close"
            initial={{
              rotate: -90,
              opacity: 0
            }}
            animate={{
              rotate: 0,
              opacity: 1
            }}
            exit={{
              rotate: 90,
              opacity: 0
            }}
            transition={{
              duration: 0.15
            }}>
            
              <X size={24} className="text-white" />
            </motion.div> :

          <motion.div
            key="chat"
            initial={{
              scale: 0.8,
              opacity: 0
            }}
            animate={{
              scale: 1,
              opacity: 1
            }}
            exit={{
              scale: 0.8,
              opacity: 0
            }}
            transition={{
              duration: 0.15
            }}
            className="relative w-full h-full">
            
              <img
              src={BAI_AVATAR}
              alt="bAI"
              className="w-full h-full rounded-full object-cover ring-2 ring-primary shadow-md" />
            
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-accent rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
            </motion.div>
          }
        </AnimatePresence>
      </motion.button>
    </>);

}
