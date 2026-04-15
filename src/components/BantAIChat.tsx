import React, { useCallback, useEffect, useState, useRef } from 'react';
import { MessageCircle, X, Send, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
const BAI_AVATAR = "/download_(1).jpg";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const SYSTEM_PROMPT = `You are bAI, the friendly and helpful virtual assistant for Barangay Purisima in the Philippines. You are part of "Project Padinig," the barangay's announcement system.

Your personality:
- Warm, approachable, and helpful
- You mix English and Filipino (Taglish) naturally
- You use relevant emojis sparingly to be friendly
- You keep responses concise (2-4 sentences unless more detail is needed)

Key information about Barangay Purisima:
- Location: Purisima Street, Barangay Purisima, Philippines
- Hotline: (032) 123-4567
- Mobile: 0917-123-4567
- Email: barangay.purisima@gmail.com
- Office Hours: Mon-Fri 8AM-5PM, Sat 8AM-12PM, Closed Sun & Holidays
- Emergency: Call 911 or Barangay Emergency at 0917-123-4567
- 9 Puroks: Avocado, Calamansi, Citrus I, Citrus II, Evergreen, Grapes, Mangga I, Mangga II
- Services: Barangay Clearance, Barangay ID, Certificates, Blotter Reports
- For IDs/Clearances: Visit Barangay Hall with valid ID, fill form, pay processing fee (1-2 days)
- Barangay Health Center is beside the hall for health services
- Announcements are available on the Project Padinig web platform

You can help with:
- Barangay services and requirements
- Office hours and contact info
- Emergency guidance
- Announcement information
- General community questions

If asked something outside your knowledge, politely say you don't have that information and suggest visiting the Barangay Hall or calling the hotline.`;
const quickReplies = [
'What announcements are new?',
'How do I contact the barangay?',
'Where is the barangay hall?',
'What are the office hours?',
'How to report an emergency?'];

function getFallbackResponse(input: string): string {
  const lower = input.toLowerCase();
  if (
  lower.includes('hello') ||
  lower.includes('hi') ||
  lower.includes('kumusta'))
  {
    return "Kumusta! ? I'm bAI, your barangay assistant. How can I help you today?";
  }
  if (lower.includes('contact') || lower.includes('number')) {
    return 'You can reach Barangay Purisima through:\n? Hotline: (032) 123-4567\n? Mobile: 0917-123-4567\n? Email: barangay.purisima@gmail.com';
  }
  if (lower.includes('emergency')) {
    return '? For emergencies:\n? Call 911 (National Emergency)\n? Barangay Emergency: 0917-123-4567';
  }
  return "I'm having trouble connecting right now. Please try again in a moment, or contact the Barangay Hall directly at (032) 123-4567.";
}
export function BantAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
  {
    id: 'welcome',
    text: "Mabuhay! ? I'm bAI, your Barangay Purisima virtual assistant. Ask me anything about barangay services, announcements, or emergencies!",
    sender: 'bot',
    timestamp: new Date()
  }]
  );
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const conversationRef = useRef<GroqMessage[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
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
  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isTyping) return;
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
    conversationRef.current.push({
      role: 'user',
      content: messageText
    });
    if (conversationRef.current.length > 10) {
      conversationRef.current = conversationRef.current.slice(-10);
    }
    const botMsgId = `bot-${Date.now()}`;
    // Add empty bot message that we'll stream into
    setMessages((prev) => [
    ...prev,
    {
      id: botMsgId,
      text: '',
      sender: 'bot',
      timestamp: new Date()
    }]
    );
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          ...conversationRef.current],

          temperature: 0.7,
          max_tokens: 300,
          stream: true
        }),
        signal: controller.signal
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');
      const decoder = new TextDecoder();
      let fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, {
          stream: true
        });
        const lines = chunk.split('\n').filter((line) => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullText += delta;
                // Update the bot message with streamed content
                setMessages((prev) =>
                prev.map((msg) =>
                msg.id === botMsgId ?
                {
                  ...msg,
                  text: fullText
                } :
                msg
                )
                );
              }
            } catch {

              // Skip malformed JSON chunks
            }}
        }
      }
      // Add completed response to conversation history
      conversationRef.current.push({
        role: 'assistant',
        content: fullText
      });
      // If somehow empty, show fallback
      if (!fullText.trim()) {
        const fallback = getFallbackResponse(messageText);
        setMessages((prev) =>
        prev.map((msg) =>
        msg.id === botMsgId ?
        {
          ...msg,
          text: fallback
        } :
        msg
        )
        );
        conversationRef.current.push({
          role: 'assistant',
          content: fallback
        });
      }
    } catch (error: any) {
      if (error?.name === 'AbortError') return;
      console.error('bAI API error:', error);
      const fallback = getFallbackResponse(messageText);
      setMessages((prev) =>
      prev.map((msg) =>
      msg.id === botMsgId ?
      {
        ...msg,
        text: fallback
      } :
      msg
      )
      );
      conversationRef.current.push({
        role: 'assistant',
        content: fallback
      });
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
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
          
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-light p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <img
                src={BAI_AVATAR}
                alt="bAI avatar"
                className="w-10 h-10 rounded-xl object-cover" />
              
                <div>
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    bAI
                    <Sparkles size={14} className="text-accent" />
                  </h3>
                  <p className="text-[11px] text-white/70">
                    Powered by AI ? Barangay Assistant
                  </p>
                </div>
              </div>
              <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/80 hover:text-white">
              
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[250px] max-h-[400px] custom-scrollbar bg-slate-50/50 dark:bg-slate-900/30">
              {messages.map((msg) =>
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
                  {msg.sender === 'bot' ?
              <img
                src={BAI_AVATAR}
                alt="bAI"
                className="w-7 h-7 rounded-full object-cover shrink-0" /> :


              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-secondary/10 text-secondary">
                      <User size={14} />
                    </div>
              }
                  <div
                className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.sender === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-md shadow-sm'}`}>
                
                    {msg.text}
                    {msg.sender === 'bot' &&
                isTyping &&
                msg.id === messages[messages.length - 1]?.id &&
                msg.text &&
                <span className="inline-block w-1.5 h-4 bg-primary/50 dark:bg-primary-light/50 ml-0.5 animate-pulse rounded-sm align-middle" />
                }
                  </div>
                </div>
            )}

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
                {quickReplies.map((reply) =>
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
