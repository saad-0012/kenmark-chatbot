import { NextResponse } from 'next/server';
import { findRelevantContext } from '@/lib/knowledge';
import axios from 'axios';

// NOTE: We do NOT import prisma here to avoid Vercel startup crashes with SQLite
// If you want analytics locally, you can uncomment imports, but for Vercel submission, keep it safe.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    // 1. Retrieve Context
    const context = findRelevantContext(message);

    // 2. Guardrail
    if (!context || context.length === 0) {
      return NextResponse.json({ 
        response: "I apologize, but I don't have information about that. I can only answer questions related to Kenmark ITan Solutions." 
      });
    }

    const systemPrompt = `You are an AI assistant for Kenmark ITan Solutions. Answer using ONLY the context below.\nCONTEXT:\n${context}`;

    let aiResponse = "";

    // 3. AI Switch: Check for Groq Key (Cloud) vs Ollama (Local)
    if (process.env.GROQ_API_KEY) {
      // --- CLOUD MODE (VERCEL) ---
      console.log("Attempting Groq API connection...");
      try {
        const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        }, {
          headers: { 
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        aiResponse = groqRes.data.choices[0].message.content;
      } catch (groqError: any) {
        console.error("Groq API Error:", groqError.response?.data || groqError.message);
        return NextResponse.json({ response: "Error: Check Vercel Logs. Groq API Key might be invalid." });
      }

    } else {
      // --- LOCAL MODE (OLLAMA) ---
      console.log("Using Local Ollama...");
      try {
        const ollamaRes = await axios.post(process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate', {
          model: process.env.OLLAMA_MODEL || 'mistral',
          prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
          stream: false
        });
        aiResponse = ollamaRes.data.response;
      } catch (ollamaError) {
        return NextResponse.json({ response: "Error: Local Ollama not running." });
      }
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("Critical Server Error:", error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}