"use client";


import { useState } from "react";
import Sidebar from "./Sidebar";

export default function ChatInterface() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, "🧑 You: " + userMessage]);
    setInput("");

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, "🤖 Gemini: " + data.response]);
    } catch (err) {
      setMessages((prev) => [...prev, "❌ Error fetching response"]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white">
     
      {/* Chat UI */}
      <div className="flex-1 flex flex-col bg-[#212121]">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-400 mr-2">Saved memory full</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full text-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Get Plus
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm"></div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col items-center justify-center">
          {messages.length === 0 ? (
            <div className="text-center m-auto w-full">
              <h1 className="text-3xl font-semibold mb-4">What are you working on?</h1>
            
        <div className="p-4 flex items-center max-w-4xl justify-center">
          <div className="relative w-full flex flex-col p-3 pl-6 pr-6 justify-center rounded-3xl bg-[#303030] ">
            <input
              className="flex-1 rounded-lg pb-4 bg-transparent outline-none text-white pr-24"
              placeholder="Ask anything"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <div className="flex items-center space-x-2 mt-3">
              <button className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>
              <span className="text-gray-400 text-sm">Tools</span>
              <div className="absolute right-3 flex items-center space-x-2">
              <button className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 1.5a6 6 0 01-6-6V6.75m6 1.5v3.75m-3.75 0a.75.75 0 01-.75-.75V6.75m7.5 0a.75.75 0 01.75.75v4.5m-12-4.5h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 002.25 2.25M16.5 7.5h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25h-3.375m-1.5-1.5h.008v.008H12v-.008z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 1.5a6 6 0 01-6-6V6.75m6 1.5v3.75m-3.75 0a.75.75 0 01-.75-.75V6.75m7.5 0a.75.75 0 01.75.75v4.5m-12-4.5h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 002.25 2.25M16.5 7.5h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25h-3.375m-1.5-1.5h.008v.008H12v-.008z" />
                </svg>
              </button>
            </div>
            </div>
           
          </div>
        </div>
            </div>
            
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className="whitespace-pre-wrap w-full max-w-2xl">{msg}</div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
