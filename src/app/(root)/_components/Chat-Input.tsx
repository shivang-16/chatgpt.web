"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Plus, Wrench, X } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  files: any[];
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const user = useAppSelector((state) => state.user.user);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...(e.target.files ? Array.from(e.target.files) : [])]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePlusClick = () => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e);
    autoResizeTextarea();
  };

  const autoResizeTextarea = () => {
    if (textareaRef.current) {
      const el = textareaRef.current;
      const maxHeight = window.innerHeight * 0.25;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    }
  };

  useEffect(() => {
    autoResizeTextarea();
  }, [input]);

  return (
    <>
      <form onSubmit={onSubmit} className="relative space-y-3">
        <div className="flex-1 rounded-[30px] p-3 bg-[#303030] outline-none text-white">
          {/* File Preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-3 p-2 rounded-lg">
              {files.map((file, index) => {
                const isBlob = file instanceof File || file instanceof Blob;
                const url = isBlob
                  ? URL.createObjectURL(file)
                  : typeof file === "string"
                  ? file
                  : "";
                const name = isBlob
                  ? (file as any).name
                  : typeof file === "object" && file.name
                  ? file.name
                  : url.split("/").pop();
                const extension = name?.split(".").pop()?.toLowerCase();
                const isImage =
                  (isBlob && file.type?.startsWith("image/")) ||
                  (!isBlob &&
                    extension &&
                    ["png", "jpg", "jpeg", "gif", "webp"].includes(extension));

                const isPDF =
                  (isBlob && file.type === "application/pdf") ||
                  (!isBlob && extension === "pdf");

                return (
                  <div key={index} className="relative">
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
                          alt={name}
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
                          {name}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#2a2a2a] px-3 py-2 pr-8 rounded-lg border border-[#4a4a4a] max-w-[200px] text-white text-sm truncate relative">
                        {name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onInput={autoResizeTextarea}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSubmit(e as any);
              }
            }}
            placeholder="Ask anything"
            className="flex w-full px-3 py-2 bg-transparent text-white overflow-auto placeholder:text-[#8e8ea0] border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none text-md leading-relaxed whitespace-pre-wrap break-words min-h-[50px]"
            style={{ maxHeight: "25vh" }}
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
                onClick={handlePlusClick}
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
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="rounded-2xl bg-[#2d2d2d] text-white max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Try advanced features for free
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#b0b0b0]">
            Get smarter responses, upload files, create images, and more by logging in.
          </p>
          <div className="flex items-center justify-between mt-4">
            <Button
              onClick={() => {
                setShowLoginModal(false);
                window.location.href = "/login";
              }}
              className="bg-white text-black rounded-full px-4 py-1 text-sm"
            >
              Log in
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowLoginModal(false);
                window.location.href = "/signup";
              }}
              className="border-white text-white rounded-full px-4 py-1 text-sm hover:bg-white hover:text-black"
            >
              Sign up for free
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatInput;
