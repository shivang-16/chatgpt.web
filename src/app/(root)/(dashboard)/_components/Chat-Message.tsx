"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  CopyPlus,
  Edit,
  Recycle,
  Share,
  ThumbsDown,
  ThumbsUp,
  Check,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Message } from "ai";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);

  const handleCopyBlock = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlock(index);
      setTimeout(() => setCopiedBlock(null), 2000);
    } catch (err) {
      console.error("Failed to copy code block:", err);
    }
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`${isUser ? "max-w-[55%]" : "max-w-full"}`}>
        {isUser ? (
          <div className="group relative bg-[#303030] text-white px-5 py-3 rounded-2xl">
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
            <div className="absolute right-0 top-full mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {copiedMsg ? (
                <Check className="text-gray-300 h-5" />
              ) : (
                <CopyPlus
                  onClick={handleCopyMessage}
                  className="text-gray-300 cursor-pointer h-5"
                />
              )}
              <Edit className="text-gray-300 cursor-pointer h-5" />
            </div>
          </div>
        ) : (
          <div className="text-white px-5 py-4 rounded-2xl leading-relaxed">
            <ReactMarkdown
  rehypePlugins={[]}
  components={{
    p: ({ children }) => (
      <p className="mb-4 text-white leading-relaxed">{children}</p>
    ),
    hr: () => (
      <hr className="border-t border-gray-700 my-6" />
    ),
    a: ({ children, href }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline"
      >
        {children}
      </a>
    ),
    code({ inline, className, children }: any) {
      const codeContent = String(children).trim();
      const match = /language-(\w+)/.exec(className || "");

      if (inline || !className) {
        return (
          <code className="bg-[#2a2a2a] px-1 py-[2px] rounded font-bold">
            {codeContent}
          </code>
        );
      }

      const index = Math.random();

      return (
        <div className="relative group my-6">
          <div className="absolute top-2 right-2 z-10">
            {copiedBlock === index ? (
              <Check className="text-gray-300 h-4" />
            ) : (
              <CopyPlus
                className="text-gray-300 h-4 cursor-pointer"
                onClick={() => handleCopyBlock(codeContent, index)}
              />
            )}
          </div>
          <SyntaxHighlighter
            language={match?.[1] || "tsx"}
            style={vscDarkPlus}
            customStyle={{
              padding: "16px",
              borderRadius: "10px",
              fontSize: "14px",
              lineHeight: "1.6",
              margin: 0,
            }}
            wrapLongLines
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      );
    },
  }}
>
  {message.content}
</ReactMarkdown>


            <div className="mt-4 flex space-x-2">
              {copiedMsg ? (
                <Check className="text-gray-300 h-5" />
              ) : (
                <CopyPlus
                  onClick={handleCopyMessage}
                  className="text-gray-300 cursor-pointer h-5"
                />
              )}
              <ThumbsUp className="text-gray-300 cursor-pointer h-5" />
              <ThumbsDown className="text-gray-300 cursor-pointer h-5" />
              <Edit className="text-gray-300 cursor-pointer h-5" />
              <Recycle className="text-gray-300 cursor-pointer h-5" />
              <Share className="text-gray-300 cursor-pointer h-5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
