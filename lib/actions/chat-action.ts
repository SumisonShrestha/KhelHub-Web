"use server";

import { generateContent } from "@/lib/api/ai/gemini";

const SYSTEM_INSTRUCTION = "You are a helpful assistant for KhelHub, a sports venue booking platform in Nepal. Help users with booking venues, creating teams, payments, and general questions. Keep answers concise and friendly.";

export async function askChatbot(messages: { role: "user" | "assistant"; content: string }[]) {
  try {
    const context = messages.slice(0, -1).map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`).join("\n");
    const query = messages[messages.length - 1]?.content || "";

    const data = await generateContent(SYSTEM_INSTRUCTION, context, query);
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
  } catch (e: any) {
    if (e?.response?.status === 429) {
      return "I'm currently unavailable due to high demand. Please try again in a few minutes.";
    }
    return "Sorry, something went wrong. Please try again.";
  }
}
