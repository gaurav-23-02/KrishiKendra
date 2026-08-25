import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  HelpCircle,
  Wheat,
  CloudSun,
  FileText
} from 'lucide-react';
import { assistantService } from '../services/assistantService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { formatDateTime } from '../utils/formatters';

const AssistantPage = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Namaste${user?.name ? ' ' + user.name : ''}! 🙏 Welcome to Krishi Mitra, your AI Agricultural Assistant.\n\nI can help you with:\n* **Live Mandi Rates**: Ask about current prices for Wheat, Mustard, Soybean, Paddy, Onion, etc.\n* **Weather Advisories**: Daily forecasts and agricultural recommendations.\n* **Government Schemes**: PM-KISAN, PMFBY, Solar Pump, Micro-irrigation, and KCC.\n\nHow can I help you today?`,
      sources: ['Krishi Kendra Verified Knowledge Base'],
      suggestions: [
        "What is the wheat price in Bhopal today?",
        "What is today's weather in Indore?",
        "How can I apply for PM-KISAN scheme?",
        "What is the interest rate for Kisan Credit Card (KCC)?"
      ],
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (questionText = input) => {
    const q = questionText.trim();
    if (!q || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: q,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await assistantService.askQuestion(
        q,
        user?.state || 'Madhya Pradesh',
        user?.district || 'Bhopal',
        language
      );

      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply,
        sources: data.sourcesUsed || [],
        suggestions: data.suggestedQuestions || [],
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Assistant query failed:", err);
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "I apologize, but I encountered an issue retrieving that information right now. Please try rephrasing your question or check the Mandi Prices and Weather pages directly.",
        sources: [],
        suggestions: ["What is the wheat price in Bhopal?", "What is the weather today?"],
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'bot',
        text: `Chat reset. How can I assist you with your farming needs today?`,
        sources: [],
        suggestions: [
          "What is the wheat price in Bhopal?",
          "PM-KISAN eligibility criteria",
          "Weather in Indore today"
        ],
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-krishi-700 to-krishi-500 text-white flex items-center justify-center shadow-md">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-gray-900">Krishi Mitra AI Assistant</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-krishi-100 text-krishi-800 rounded-full">
                Grounded & Verified
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Context-aware agricultural intelligence powered by official mandi and weather records
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          title="Reset conversation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear Chat</span>
        </button>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-md flex flex-col h-[650px] overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-xl bg-krishi-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-3xl p-5 text-sm space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-krishi-700 text-white rounded-tr-xs shadow-xs'
                    : 'bg-gray-50/90 text-gray-800 rounded-tl-xs border border-gray-200/60'
                }`}
              >
                {/* Message Body */}
                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>

                {/* Grounded Source Badges */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-2 border-t border-gray-200/60 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-gray-500 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-krishi-600" />
                      <span>Verified Sources:</span>
                    </span>
                    {msg.sources.map((src, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-md bg-white border border-gray-200 font-medium text-gray-700"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}

                {/* Follow-up Suggestion Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="pt-2 border-t border-gray-200/60 space-y-1.5">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Suggested Inquiries:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, sugIdx) => (
                        <button
                          key={sugIdx}
                          onClick={() => handleSend(sug)}
                          className="text-xs font-semibold px-3 py-1 rounded-full bg-white hover:bg-krishi-50 text-krishi-800 border border-krishi-200 transition-colors shadow-2xs text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-gray-800 text-white flex items-center justify-center shrink-0 shadow-2xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl bg-krishi-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-50 rounded-3xl p-4 border border-gray-200/60 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-krishi-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-krishi-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-krishi-500 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs text-gray-500 font-medium ml-1">Checking verified agricultural records...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about crop prices, weather forecast, or government subsidies..."
              disabled={loading}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-krishi-500 transition-all shadow-2xs disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 bg-krishi-600 hover:bg-krishi-700 text-white rounded-2xl shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          <p className="text-[11px] text-gray-400 text-center mt-2">
            Krishi Mitra is grounded in live APMC mandi data and official portals to assist farmers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
