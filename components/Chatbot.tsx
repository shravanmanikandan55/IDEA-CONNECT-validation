import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Markdown from 'react-markdown';

// Get the API key from environment - try multiple ways
const getGeminiApiKey = () => {
  // @ts-ignore
  const key = import.meta.env.VITE_GEMINI_API_KEY || 
         // @ts-ignore
         import.meta.env.GEMINI_API_KEY ||
         // @ts-ignore
         process.env.VITE_GEMINI_API_KEY ||
         // @ts-ignore
         process.env.GEMINI_API_KEY;
  
  console.log('Gemini API Key available:', !!key);
  return key;
};

const geminiApiKey = getGeminiApiKey();
const ai = geminiApiKey ? new GoogleGenAI({ apiKey: geminiApiKey }) : null;

console.log('Chatbot initialized - AI client:', ai ? 'created' : 'null (no API key)');

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hi there! I am the IdeaConnect assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!ai) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'Sorry, the AI service is not configured. Please check the GEMINI_API_KEY environment variable.' }]);
      return;
    }

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      
      history.push({
        role: 'user',
        parts: [{ text: userText }]
      });

      console.log('Sending request to Gemini...');

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: history,
        config: {
          systemInstruction: `You are a helpful assistant for IdeaConnect. 
IdeaConnect is a pre-market validation platform designed to help creators test their product ideas and gather real market feedback before they invest significant time and resources into building.
Answer questions about the platform, how it works, pricing, features, etc. Be concise, friendly, and helpful.`,
        }
      });

      console.log('Gemini response:', response);

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: response.text || 'Sorry, I could not generate a response.' }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: `Sorry, I encountered an error while processing your request. Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 sm:bottom-6 right-6 p-4 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all z-[100] ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chatbot Window */}
      <div className={`fixed bottom-24 sm:bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 z-[100] origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}>
        {/* Header */}
        <div className="bg-emerald-500 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <h3 className="font-semibold">IdeaConnect Assistant</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 ${msg.role === 'user' ? 'bg-emerald-500 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-gray-100 dark:border-slate-700 rounded-tl-sm'}`}>
                {msg.role === 'model' ? (
                  <div className="prose dark:prose-invert prose-sm max-w-none text-sm">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm border border-gray-100 dark:border-slate-700 rounded-2xl rounded-tl-sm p-3 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-emerald-500" />
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
