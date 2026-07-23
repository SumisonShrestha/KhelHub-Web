"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";

type Message = { role: "user" | "bot"; text: string };

const BOT_REPLIES: Record<string, string> = {
  hello: "Hi there! How can I help you today?",
  hi: "Hey! Need help with booking a venue or finding a team?",
  booking: "To book a venue, go to the Venues page, pick your favorite court, select a time slot, and confirm your booking!",
  team: "You can create or join a team from the Teams page. Find players and start playing together!",
  venue: "Browse all available futsal venues on the Venues page. Filter by city, sport, or price to find your perfect pitch.",
  payment: "We accept cash and Khalti online payments. Cash is paid after the game at the venue.",
  cancel: "You can cancel your booking from the My Bookings page under your profile.",
  contact: "For further help, reach out to the venue owner directly via the phone number listed on the venue detail page.",
  default: "I'm here to help! Try asking about: booking, teams, venues, payment, or cancellation.",
};

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hi! Ask me anything about KhelHub." },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    const lower = text.toLowerCase();
    let reply = BOT_REPLIES.default;
    for (const [key, val] of Object.entries(BOT_REPLIES)) {
      if (lower.includes(key)) { reply = val; break; }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
    }, 400);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#121A2A] text-white shadow-lg transition hover:scale-110 hover:shadow-xl"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex w-80 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200">
          <div className="flex items-center justify-between bg-[#121A2A] px-4 py-3 text-white">
            <span className="text-sm font-semibold">KhelHub Assistant</span>
            <button onClick={() => setOpen(false)} className="rounded-full p-1 transition hover:bg-white/20">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex h-80 flex-col gap-2 overflow-y-auto p-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#121A2A] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 border-t border-gray-200 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
              placeholder="Ask anything..."
              className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#121A2A] text-white transition hover:bg-gray-800 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
