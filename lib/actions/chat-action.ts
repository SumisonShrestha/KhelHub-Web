"use server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function askChatbot(messages: { role: "user" | "assistant"; content: string }[]) {
  if (!OPENAI_API_KEY) {
    return "I'm currently in offline mode. For AI-powered answers, add your OpenAI API key to .env.local";
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant for KhelHub, a sports venue booking platform in Nepal. Help users with booking venues, creating teams, payments, and general questions. Keep answers concise and friendly.",
          },
          ...messages,
        ],
        max_tokens: 300,
      }),
    });

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
  } catch {
    return "Sorry, something went wrong. Please try again.";
  }
}
