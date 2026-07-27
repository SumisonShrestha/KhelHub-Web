"use server";

import { handleGenerateContent } from "@/lib/actions/ai/gemini-action";

export async function askChatbot(messages: { role: "user" | "assistant"; content: string }[]) {
  try {
    const query = messages[messages.length - 1]?.content || "";
    const result = await handleGenerateContent(query);
    if (result.success) {
      return result.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
    }
    return result.message || "Sorry, something went wrong.";
  } catch {
    return "Sorry, something went wrong. Please try again.";
  }
}
