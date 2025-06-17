"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Plus, Wrench, X } from "lucide-react";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  handleInputChange,
  onSubmit,
  files,
  setFiles,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={onSubmit} className="relative space-y-3">
      <div className="flex-1 rounded-[30px] p-3 bg-[#303030] outline-none text-white">
        {/* File Preview */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3 p-2 rounded-lg">
            {files.map((file, index) => {
              const url = URL.createObjectURL(file);
              const isImage = file.type.startsWith("image/");
              const isPDF = file.type === "application/pdf";

              return (
                <div key={index} className="relative">
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute -top-1 -right-1 z-10 bg-white text-black rounded-full shadow hover:bg-gray-600 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {isImage ? (
                    <div className="w-14 h-14">
                      <img
                        src={url}
                        alt={file.name}
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                  ) : isPDF ? (
                    <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-2 pr-8 rounded-xl border border-[#4a4a4a] max-w-[200px] relative">
                      <div className="bg-pink-600 p-2 rounded-md flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                      <div className="text-white text-sm truncate max-w-[100px]">
                        {file.name}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#2a2a2a] px-3 py-2 pr-8 rounded-lg border border-[#4a4a4a] max-w-[200px] text-white text-sm truncate relative">
                      {file.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Textarea */}
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

        {/* Buttons */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <input
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx,.txt"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[#8e8ea0] hover:bg-[#4f4f4f] p-3 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="w-5 h-5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[#8e8ea0] hover:bg-[#4f4f4f] p-3 flex items-center space-x-2 rounded-full"
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
