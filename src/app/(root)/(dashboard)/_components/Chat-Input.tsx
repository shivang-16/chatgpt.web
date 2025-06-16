"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, Plus, Wrench } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  handleInputChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="flex-1 rounded-[30px] p-3 bg-[#303030] outline-none text-white">
        <textarea
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e as any);
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pastedText = e.clipboardData.getData("text");
            const newText = input + pastedText;
            handleInputChange({ target: { value: newText } } as any);

            const textarea = e.currentTarget;
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight * 5 + "px";
          }}
          placeholder="Ask anything"
          className="flex w-full px-3 py-2 bg-transparent text-white overflow-auto placeholder:text-[#8e8ea0] border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-md leading-relaxed whitespace-pre-wrap break-words min-h-[50px]"
          rows={1}
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[#8e8ea0] hover:bg-[#4f4f4f] p-3"
            >
              <Plus className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[#8e8ea0] hover:bg-[#4f4f4f] p-3 flex items-center space-x-2"
            >
              <Wrench className="w-5 h-5" />
              <span className="text-sm">Tools</span>
            </Button>
          </div>

          <div className="flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[#8e8ea0] hover:bg-[#4f4f4f] p-3 rounded-full"
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-[#8e8ea0] hover:bg-[#4f4f4f] p-3 rounded-full"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
