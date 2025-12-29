import { NextResponse } from 'next/server';
import { findRelevantContext } from '@/lib/knowledge';
import { prisma } from '@/lib/prisma'; // Import DB
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    // --- ANALYTICS FIX START ---
    // 1. Create a simplified tracking session
    const newSession = await prisma.chatSession.create({
      data: {}
    });

    // 2. Log the user's question to the database
    await prisma.message.create({
      data: {
        content: message,
        role: 'user',
        sessionId: newSession.id, // Correctly link to the new session
      }
    });
    // --- ANALYTICS FIX END ---

    // 3. Retrieve Context
    const context = findRelevantContext(message);

    // --- GUARDRAIL ---
    if (!context || context.length === 0) {
      return NextResponse.json({ 
        response: "I apologize, but I don't have information about that. I can only answer questions related to Kenmark ITan Solutions." 
      });
    }

    // 4. System Prompt
    const systemPrompt = `
      You are an AI assistant for Kenmark ITan Solutions.
      Answer using ONLY the context below.
      CONTEXT:
      ${context}
    `;

    // 5. Call AI
    try {
      const ollamaResponse = await axios.post(process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate', {
        model: process.env.OLLAMA_MODEL || 'mistral',
        prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
        stream: false
      });
      
      return NextResponse.json({ response: ollamaResponse.data.response });

    } catch (llmError) {
      return NextResponse.json({ 
        response: "My AI brain is offline, but here is the info: " + context 
      });
    }

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}