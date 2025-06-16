"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Menu,
  Sparkle,
  Sun,
} from "lucide-react";
import { useChat } from "@ai-sdk/react";
import ChatMessage from "./Chat-Message";
import ChatInput from "./Chat-Input";

interface ChatInterfaceProps {
  showSidebar: boolean;
  onToggleSidebar: () => void;
}

export default function ChatInterface({
  showSidebar,
  onToggleSidebar,
}: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
    });

  const [hasStartedChat, setHasStartedChat] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setHasStartedChat(true);
      handleSubmit(e);

      // Reset textarea height
      setTimeout(() => {
        const textarea = document.querySelector("textarea");
        if (textarea) {
          textarea.style.height = "auto";
          textarea.value = "";
        }
      }, 0);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-scroll">
      {/* Header */}
      <div className="flex items-center px-4 py-1">
        <div className="flex items-center space-x-4">
          {!showSidebar && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="text-white hover:bg-[#2f2f2f]"
            >
              <Menu className="w-4 h-4" />
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">ChatGPT</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14l5-5 5 5z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-center w-full space-x-4 ">
          <div className="flex flex-col items-center space-y-2 text-sm text-[#8e8ea0]">
            <div className="flex items-center space-x-1">
              <span>Saved memory full</span>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <button className="bg-[#373669] hover:bg-[#4b4a78] cursor-pointer text-white px-3 py-1 rounded-full text-sm flex items-center">
              <Sparkle className="w-4 h-4 mr-2" />
              Get Plus
            </button>
          </div>
        </div>

        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-medium">
          U
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {!hasStartedChat ? (
          <div className="flex-[0.8] flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl">
              <h1 className="text-2xl font-normal text-center mb-8 text-white">
                What's on the agenda today?
              </h1>
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                onSubmit={onSubmit}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-[#8e8ea0]">
                    <div className="w-2 h-2 bg-[#8e8ea0] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#8e8ea0] rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-[#8e8ea0] rounded-full animate-pulse delay-150"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Input */}
            <div className="p-4 flex items-center justify-center sticky bottom-0">
              <div className="w-full max-w-4xl">
                <ChatInput
                  input={input}
                  handleInputChange={handleInputChange}
                  onSubmit={onSubmit}
                />
              </div>
            </div>
          </>
        )}

        {/* Floating Sun Icon */}
        {!hasStartedChat && (
          <div className="fixed bottom-8 right-8">
            <Button
              variant="ghost"
              size="sm"
              className="w-12 h-12 rounded-full bg-[#2f2f2f] hover:bg-[#4f4f4f] text-yellow-400"
            >
              <Sun className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
