"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

type Message = { role: 'user' | 'assistant'; content: string; };

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am the Kenmark ITan virtual assistant.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
        <div className="bg-[#0f172a] p-4 text-white flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-400" />
            <h1 className="text-lg font-bold">Kenmark ITan Support</h1>
        </div>
        <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-[80%] ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-800'}`}>
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && <Loader2 className="animate-spin text-gray-500" />}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <input 
            className="flex-1 p-3 border border-gray-300 rounded-lg text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your query..."
          />
          <button onClick={sendMessage} className="p-3 bg-[#0f172a] text-white rounded-lg">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}