"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Moon, Sun } from "lucide-react";
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'assistant'; content: string; };

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am the Kenmark ITan virtual assistant.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  // DARK MODE STATE
  const [darkMode, setDarkMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); };
  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to server." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // WRAPPER DIV: Applies 'dark' class if darkMode is true
  return (
    <div className={darkMode ? "dark" : ""}>
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        
        {/* Toggle Button (Top Right) */}
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-slate-800 shadow-lg hover:scale-110 transition-transform"
        >
          {darkMode ? <Sun className="w-6 h-6 text-yellow-500" /> : <Moon className="w-6 h-6 text-slate-700" />}
        </button>

        <div className="w-full max-w-2xl bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 transition-colors duration-300">
          
          {/* Header */}
          <div className="bg-[#0f172a] dark:bg-slate-950 p-4 text-white flex items-center gap-2">
              <Bot className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-lg font-bold">Kenmark ITan Support</h1>
                <p className="text-xs text-slate-400">AI Powered • {darkMode ? 'Dark' : 'Light'} Mode</p>
              </div>
          </div>

          {/* Chat Area */}
          <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[80%] ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-slate-700 border dark:border-slate-600 text-gray-800 dark:text-gray-100 shadow-sm'
                }`}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm p-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 flex gap-2">
            <input 
              className="flex-1 p-3 border border-gray-300 dark:border-slate-600 rounded-lg text-black dark:text-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your query..."
            />
            <button onClick={sendMessage} className="p-3 bg-[#0f172a] dark:bg-blue-600 text-white rounded-lg hover:opacity-90">
              <Send className="w-5 h-5" />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}