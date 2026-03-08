import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { processCommand } from "./AssistantEngine";

export default function AssistantPanel({ close }) {
  const [messages, setMessages] = useState([
    { 
      role: "assistant", 
      text: "Welcome to Waste Management Assistant! I'm here to help you manage garbage collection, report issues, and navigate the system efficiently. How can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate processing delay for better UX
    setTimeout(() => {
      const response = processCommand(input);
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl rounded-2xl border border-slate-700 z-50 backdrop-blur-xl">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-gradient-to-r from-green-600 to-emerald-600 rounded-t-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <b className="text-white font-semibold">Waste Management Assistant</b>
        </div>
        <button 
          onClick={close} 
          className="text-white/80 hover:text-white text-xl leading-none transition-colors hover:rotate-90 duration-200"
          aria-label="Close Assistant"
        >
          ✕
        </button>
      </div>

      <div className="p-4 space-y-3 h-80 overflow-y-auto bg-slate-900/50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
            <div className="max-w-[85%]">
              <div className={`px-4 py-3 rounded-2xl inline-block backdrop-blur-sm border ${
                m.role === "user" 
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500/30 shadow-lg" 
                  : "bg-slate-800/80 text-slate-100 border-slate-700/50 shadow-xl"
              }`}>
                <p className="text-sm leading-relaxed">{m.text}</p>
              </div>
              
              {m.actions && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {m.actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      onClick={() => navigate(action.route)}
                      className="text-sm bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 border border-green-500/30"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 text-slate-100 px-4 py-3 rounded-2xl border border-slate-700/50 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-slate-400">Processing...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 flex gap-2 border-t border-slate-700 bg-slate-800/50 rounded-b-2xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-slate-700/50 border border-slate-600 rounded-xl flex-1 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-slate-100 placeholder-slate-400 backdrop-blur-sm transition-all duration-200"
          placeholder="Ask about waste management..."
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:shadow-lg disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 flex items-center justify-center border border-green-500/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
