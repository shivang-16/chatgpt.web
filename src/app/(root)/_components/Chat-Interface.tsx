'use client';

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Sparkle, Sun } from "lucide-react";
import { useRouter } from 'next/navigation';
import { geminiChat } from "@/actions/gemini_actions";
import { getChatMessages, createChat, createChatMessage } from "@/actions/chat_actions";
import { useAppSelector } from "@/redux/hooks";
import ChatHeader from "./Chat-Header";
import ChatMessage from "./Chat-Message";
import ChatInput from "./Chat-Input";

interface ChatInterfaceProps {
  chatId?: string;
}

export default function ChatInterface({ chatId }: ChatInterfaceProps) {
  const router = useRouter();
  const user = useAppSelector(state => state.user.user);

  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (user && chatId) {
        setIsLoading(true);
        const response = await getChatMessages(chatId);
        if (response.success && response.data) {
          setMessages(response.data);
          setHasStartedChat(true);
        } else {
          console.error("Failed to fetch chat messages:", response.error);
        }
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, [chatId, user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && files.length === 0) return;

    setHasStartedChat(true);

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      files: files
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setFiles([]);

    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "auto";
        textarea.value = "";
      }
    }, 0);

    setIsLoading(true);

    const data = {
      message: input,
      files,
      chatId: chatId,
      userId: user?._id
    };

    const { fileUrls, stream } = await geminiChat(data);

    const assistantMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: ""
    };

    setMessages(prev => [...prev, assistantMessage]);

    for await (const msg of stream) {
      if (msg.type === "text") {
        assistantMessage.content += msg.content;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...assistantMessage };
          return updated;
        });
      }
    }

    let currentChatId = chatId;

    if (!currentChatId && user) {
      const chatName = input.substring(0, 50) || "New Chat";
      const newChatResponse = await createChat(chatName);
      if (newChatResponse.success && newChatResponse.data) {
        currentChatId = newChatResponse.data._id as string;
        // await createChatMessage(currentChatId, input, 'user', fileUrls);
        // await createChatMessage(currentChatId, assistantMessage.content, 'assistant');
        router.push(`/chat/${currentChatId}`);
      } else {
        console.error("Failed to create new chat:", newChatResponse.error);
        setIsLoading(false);
        return;
      }
    }

    if (user && currentChatId && !chatId) {
      await createChatMessage(currentChatId, input, 'user', fileUrls);
      await createChatMessage(currentChatId, assistantMessage.content, 'assistant');
    }

    setIsLoading(false);
  };

  const ChatMessageSkeleton = ({ isUser }: { isUser: boolean }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] px-4 py-3 rounded-xl bg-[#2f2f2f] animate-pulse text-transparent`}>
        Loading message...
      </div>
    </div>
  );

const handleEdit = (content: string, files: File[]) => {
  setInput(content);
  setFiles(files);
  setMessages(prev => prev.filter(m => m.content !== content));
};

const handleResend = (content: string, files: File[]) => {
  setInput(content);
  setFiles(files);
  onSubmit({ preventDefault: () => {} } as React.FormEvent);
};


  return (
    <div className="flex-1 flex flex-col overflow-scroll">
      <ChatHeader user={user} chatId={chatId} />

      <div className="flex-1 flex flex-col">
        {!hasStartedChat ? !(isLoading && messages.length === 0) && (
          <div className="flex-[0.8] flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-4xl">
              <h1 className="text-2xl font-normal text-center mb-8 text-white">
                What's on the agenda today?
              </h1>
              <ChatInput
                input={input}
                handleInputChange={(e) => setInput(e.target.value)}
                onSubmit={onSubmit}
                files={files}
                setFiles={setFiles}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {isLoading && messages.length === 0 && (
                  <>
                    <ChatMessageSkeleton isUser={true} />
                    <ChatMessageSkeleton isUser={false} />
                    <ChatMessageSkeleton isUser={true} />
                    <ChatMessageSkeleton isUser={false} />
                  </>
                )}

                {messages.map((message, index) => (
                  <ChatMessage key={index} message={message} onEdit={handleEdit}  onResend={handleResend}/>
                ))}

                {isLoading && messages.length > 0 && (
                  <div className="flex items-center space-x-2 text-[#8e8ea0]">
                    <div className="w-2 h-2 bg-[#8e8ea0] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#8e8ea0] rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-[#8e8ea0] rounded-full animate-pulse delay-150"></div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

           {/* Bottom Input */}
  <div className="p-4 flex items-center justify-center sticky bottom-0">
    <div className="w-full max-w-4xl">
      <ChatInput
        input={input}
        handleInputChange={(e) => setInput(e.target.value)}
        onSubmit={onSubmit}
        files={files}
        setFiles={setFiles}
      />
    </div>
  </div>


          </>
        )}

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
