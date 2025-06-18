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
import FilePreviewModal from "../_components/FilePreview"; // update path as needed
import ChatShare from "./Chat-Share";

interface ChatMessageProps {
  message: any;
  onEdit: (content: string, files: any[]) => void;
  onResend: (content: string, files: any[]) => void;
}

export default function ChatMessage({ message, onEdit, onResend }: ChatMessageProps) {
  const isUser = message.role === "user";
  const files = message?.files;
  const [copiedBlock, setCopiedBlock] = useState<number | null>(null);
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "pdf" | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

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

  const handleEditMessage = () => {
    onEdit(message.content, message.files);
  };

  const handleResendMessage = () => {
    console.log("resent clicked", message)
    if (message.role === 'assistant') {
      console.log(message, "here")
      onResend(message.content, message.files);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`${isUser ? "max-w-full md:max-w-[55%]" : "max-w-full"}`}>
        {isUser && files && files.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-2">
            {files.map((file: any, index: number) => {
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
                <div
                  key={index}
                  className="relative rounded-xl cursor-pointer overflow-hidden p-1 bg-[#2a2a2a]"
                  onClick={() => {
                    setPreviewUrl(url);
                    setPreviewType(isImage ? "image" : isPDF ? "pdf" : null);
                  }}
                >
                  {isImage ? (
                    <img
                      src={url}
                      alt={file.name}
                      className="object-cover w-16 h-16 rounded-md"
                    />
                  ) : isPDF ? (
                    <div className="flex items-center gap-2 px-3 py-2 pr-8 rounded-xl max-w-[200px] relative">
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
                            d="M7 21h10a2 2 0 002-2V7.414a2 2 0 00-.586-1.414L14.172 2.586A2 2 0 0012.758 2H7a2 2 0 00-2 2v15a2 2 0 002 2z"
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
              <Edit 
                onClick={handleEditMessage}
                className="text-gray-300 cursor-pointer h-5" 
              />
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
                hr: () => <hr className="border-t border-gray-700 my-6" />,
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
                code({ inline, className, children, node }: any) {
                  const codeContent = String(children).trim();
                  const match = /language-(\w+)/.exec(className || "");

                  if (inline || !className) {
                    return (
                      <code className="bg-[#2a2a2a] px-1 py-[2px] rounded font-bold">
                        {codeContent}
                      </code>
                    );
                  }

                  const stableIndex =
                    node?.position?.start?.offset || codeContent.length;

                  return (
                    <div className="relative group my-6">
                      <div className="absolute top-2 right-2 z-10">
                        {copiedBlock === stableIndex ? (
                          <Check className="text-gray-300 h-4" />
                        ) : (
                          <CopyPlus
                            className="text-gray-300 h-4 cursor-pointer"
                            onClick={() =>
                              handleCopyBlock(codeContent, stableIndex)
                            }
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
              <ThumbsUp
                className={`h-5 cursor-pointer ${
                  feedback === "up" ? "fill-white text-white" : "text-gray-300"
                }`}
                onClick={() =>
                  setFeedback((prev) => (prev === "up" ? null : "up"))
                }
              />
              <ThumbsDown
                className={`h-5 cursor-pointer ${
                  feedback === "down"
                    ? "fill-white text-white"
                    : "text-gray-300"
                }`}
                onClick={() =>
                  setFeedback((prev) => (prev === "down" ? null : "down"))
                }
              />
              <Share
                className="h-5 cursor-pointer text-gray-300"
                onClick={() => setShowShareModal(true)}
              />
              <Recycle 
                onClick={handleResendMessage}
                className="text-gray-300 cursor-pointer h-5" 
              />
            </div>
          </div>
        )}
      </div>

      {previewUrl && previewType && (
        <FilePreviewModal
          url={previewUrl}
          type={previewType}
          onClose={() => {
            setPreviewUrl(null);
            setPreviewType(null);
          }}
        />
      )}

      {showShareModal && (
        <ChatShare setShowShareModal={setShowShareModal} />
      )}
    </div>
  );
}
