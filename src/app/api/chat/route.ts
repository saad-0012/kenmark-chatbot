import { NextResponse } from 'next/server';
import { findRelevantContext } from '@/lib/knowledge';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    // 1. Analytics (Session + Log)
    try {
      const newSession = await prisma.chatSession.create({ data: {} });
      await prisma.message.create({
        data: { content: message, role: 'user', sessionId: newSession.id }
      });
    } catch (e) {
      console.log("Analytics skipped (DB issue)");
    }

    // 2. Retrieve Context
    const context = findRelevantContext(message);

    // 3. Guardrail
    if (!context || context.length === 0) {
      return NextResponse.json({ 
        response: "I apologize, but I don't have information about that. I can only answer questions related to Kenmark ITan Solutions." 
      });
    }

    const systemPrompt = `You are an AI assistant for Kenmark ITan Solutions. Answer using ONLY the context below.\nCONTEXT:\n${context}`;

    // 4. AI Switch (Groq vs Ollama)
    let aiResponse = "";
    
    if (process.env.GROQ_API_KEY) {
      // --- CLOUD MODE (VERCEL) ---
      const groqRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama3-8b-8192", // Fast & Free
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ]
      }, {
        headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` }
      });
      aiResponse = groqRes.data.choices[0].message.content;

    } else {
      // --- LOCAL MODE (OLLAMA) ---
      const ollamaRes = await axios.post(process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate', {
        model: process.env.OLLAMA_MODEL || 'mistral',
        prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
        stream: false
      });
      aiResponse = ollamaRes.data.response;
    }

    return NextResponse.json({ response: aiResponse });

  } catch (error: any) {
    console.error("AI Error:", error.message);
    return NextResponse.json({ response: "I'm having trouble connecting to my AI brain right now." });
  }
}