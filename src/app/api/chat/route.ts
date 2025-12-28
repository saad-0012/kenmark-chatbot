import { NextResponse } from 'next/server';
import { findRelevantContext } from '@/lib/knowledge';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    // 1. Retrieve Context
    const context = findRelevantContext(message);

    // --- GUARDRAIL: If no context found, STOP here. ---
    if (!context || context.length === 0) {
      return NextResponse.json({ 
        response: "I apologize, but I don't have information about that. I can only answer questions related to Kenmark ITan Solutions." 
      });
    }

    // 2. Construct System Prompt (Only runs if context was found)
    const systemPrompt = `
      You are an AI assistant for Kenmark ITan Solutions.
      You must answer the user's question using ONLY the context provided below.
      
      CONTEXT:
      ${context}
    `;

    // 3. Call AI
    try {
      const ollamaResponse = await axios.post(process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate', {
        model: process.env.OLLAMA_MODEL || 'mistral',
        prompt: `${systemPrompt}\n\nUser: ${message}\nAssistant:`,
        stream: false
      });
      
      return NextResponse.json({ response: ollamaResponse.data.response });

    } catch (llmError) {
      // Fallback if Ollama is offline but we have data
      return NextResponse.json({ 
        response: "My AI brain is currently offline, but here is the relevant info I found: " + context 
      });
    }

  } catch (error) {
    console.error("SERVER ERROR:", error); // This prints to your terminal
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}