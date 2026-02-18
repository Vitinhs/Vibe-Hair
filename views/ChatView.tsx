
import React, { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Olá! Sou seu guia Capillaire. Como posso ajudar na sua rotina natural hoje?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatWithAssistant(input, messages);
      const modelMsg: ChatMessage = { role: 'model', content: response, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: 'Ops, algo deu errado. Tente novamente em instantes.', timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-220px)] flex flex-col animate-in fade-in duration-700">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-2 no-scrollbar pb-6 pt-2">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-5 py-4 rounded-[24px] text-sm leading-relaxed shadow-sm transition-all
              ${msg.role === 'user' 
                ? 'bg-[#2d4a22] text-white rounded-br-none shadow-emerald-900/10' 
                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}
            `}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start animate-in fade-in">
            <div className="bg-white border border-gray-100 px-5 py-4 rounded-[24px] rounded-bl-none flex space-x-1 shadow-sm">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-[#FBFBFD] pt-4 pb-2">
        <div className="relative flex items-center">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Dúvida sobre sua rotina?"
            className="w-full pl-6 pr-14 py-4 bg-white border border-gray-100 rounded-[28px] text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/5 shadow-sm transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="absolute right-2 p-3 bg-[#2d4a22] text-white rounded-full disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-90 tap-highlight-none shadow-lg shadow-emerald-950/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
