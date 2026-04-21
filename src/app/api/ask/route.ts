import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import Groq from "groq-sdk";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });
const COLLECTION = process.env.QDRANT_COLLECTION || "clark_chunks";


export async function POST(req: NextRequest) {
  const start = Date.now();
  try {
    const { question, language = "English", stream: useStream = true } = await req.json();
    if (!question?.trim()) {
      return NextResponse.json({ error: "Please ask a question." }, { status: 400 });
    }

    const results = await qdrant.scroll(COLLECTION, {
      limit: 200, with_payload: true, with_vector: false,
    });

    const keywords = question.toLowerCase()
      .split(" ").filter((w: string) => w.length > 3);

    const scored = (results.points || [])
      .map((p: any) => {
        const text = (p.payload?.content || "").toLowerCase();
        const score = keywords.reduce((acc: number, kw: string) =>
          acc + (text.split(kw).length - 1), 0);
        return { ...p, score };
      })
      .filter((p: any) => p.score > 0)
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 4);

    const confidence = scored.length > 0 && scored[0].score >= 3 ? "high"
      : scored.length > 0 && scored[0].score >= 1 ? "medium"
      : "low";

    if (scored.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find specific information about that on Clark's website. Try visiting clarku.edu directly.",
        sourceUrl: "https://www.clarku.edu",
        sourceTitle: "Clark University",
        confidence: "low",
        responseTime: Date.now() - start,
      });
    }

    const context = scored
      .map((r: any) => `[${r.payload.title} — ${r.payload.url}]\n${r.payload.content}`)
      .join("\n\n---\n\n");

    const sourceUrl = scored[0].payload.url;
    const sourceTitle = scored[0].payload.title;

    if (false) {
      // Streaming response
      const stream = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `You are CampusPulse, AI assistant for Clark University students.
Answer using ONLY the Clark University content provided.
IMPORTANT: Respond in ${language}. If not English, translate your full answer.
Be specific and concise (2-4 sentences).`
          },
          {
            role: "user",
            content: `CLARK UNIVERSITY CONTENT:\n${context}\n\nQUESTION: ${question}\n\nAnswer:`
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
        stream: true,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          // Send metadata first
          const meta = JSON.stringify({ sourceUrl, sourceTitle, confidence, responseTime: Date.now() - start });
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "meta", data: meta })}\n\n`));

          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "text", data: text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming fallback
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are CampusPulse, AI assistant for Clark University. Answer concisely using only provided content." },
        { role: "user", content: `CLARK CONTENT:\n${context}\n\nQUESTION: ${question}\n\nAnswer:` }
      ],
      max_tokens: 300,
      temperature: 0.3,
    });

    return NextResponse.json({
      answer: completion.choices[0]?.message?.content || "I couldn't generate an answer.",
      sourceUrl, sourceTitle, confidence,
      responseTime: Date.now() - start,
    });

  } catch (error: any) {
    console.error("API Error:", error.message);
    return NextResponse.json({
      answer: "Sorry, something went wrong. Please try again.",
      sourceUrl: "https://www.clarku.edu",
      sourceTitle: "Clark University",
      responseTime: 0,
    }, { status: 200 });
  }
}