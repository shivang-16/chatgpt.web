"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Sparkle, Sun } from "lucide-react";
import { useRouter } from 'next/navigation'; // Import useRouter
import { useChat } from "@ai-sdk/react";
import ChatMessage from "./Chat-Message";
import ChatInput from "./Chat-Input";
import { geminiChat } from "@/actions/gemini_actions";
import { getChatMessages, createChat, createChatMessage } from "@/actions/chat_actions"; // Import getChatMessages
import { useAppSelector } from "@/redux/hooks";

interface ChatInterfaceProps {
  showSidebar: boolean;
  onToggleSidebar: () => void;
  chatId?: string; // Add chatId as an optional prop
}

export default function ChatInterface({
  showSidebar,
  onToggleSidebar,
  chatId, // Destructure chatId
}: ChatInterfaceProps) {
  const router = useRouter(); // Initialize useRouter
  const user = useAppSelector(state => state.user.user)

  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch messages when chatId changes
  if(user) {
    useEffect(() => {
      const fetchMessages = async () => {
        if (chatId) {
          setIsLoading(true);
          const response = await getChatMessages(chatId);
          console.log(response, "hereis thei messge")
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
    }, [chatId]);
  }


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (!input.trim() && files.length === 0) return;
  
    setHasStartedChat(true);

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      files: files
    };

    setMessages(prev => [...prev, userMessage]);

  

    console.log(files, "here in interface");

    const data = {
      message: input,
      files,
    };
  
    const {fileUrls, stream} = await geminiChat(data);
    console.log(fileUrls, "here ar file urls")

    const assistantMessage = {
      id: Date.now().toString(),
      role: "assistant",
      content: ""
    };
    
    // Optimistically add the assistant message
    setMessages(prev => [...prev, assistantMessage]);
    
    for await (const msg of stream) {
      if (msg.type === "text") {
        assistantMessage.content += msg.content;
    
        // Update the last message in state
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...assistantMessage };
          return updated;
        });
      }
    }

    if(user && chatId) {
      await createChatMessage(chatId, input, 'user', fileUrls);
      await createChatMessage(chatId, assistantMessage.content, 'assistant');

    }

    let currentChatId = chatId;

    
    if (!currentChatId && user) {
      // Create a new chat if no chatId exists
      const chatName = input.substring(0, 50) || "New Chat"; // Use first 50 chars of message as chat name
      console.log(chatName, "here is chat name")
      const newChatResponse = await createChat(chatName);
      if (newChatResponse.success && newChatResponse.data) {
        currentChatId = newChatResponse.data._id as string;
        await createChatMessage(currentChatId, input, 'user', fileUrls);
        await createChatMessage(currentChatId, assistantMessage.content, 'assistant');

        router.push(`/chat/${currentChatId}`); // Redirect to the new chat URL
      } else {
        console.error("Failed to create new chat:", newChatResponse.error);
        setIsLoading(false);
        return;
      }
    }
    // // Save assistant message if user is logged in
    // if (user && currentChatId) {
    //   await createChatMessage(currentChatId, assistantMessage.content, 'assistant');
    // }

  
    setInput("");
    setFiles([]);
    setIsLoading(false);
  
    // Reset textarea
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.style.height = "auto";
        textarea.value = "";
      }
    }, 0);
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
            <a href="https://chatgpt.com/#pricing" target="_blank">
              <button className="bg-[#373669] hover:bg-[#4b4a78] cursor-pointer text-white px-3 py-1 rounded-full text-sm flex items-center">
                <Sparkle className="w-4 h-4 mr-2" />
                Get Plus
              </button>
            </a>
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
                {messages?.map((message, index) => (
                  <ChatMessage key={index} message={message} />
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
                  handleInputChange={(e) => setInput(e.target.value)}
                  onSubmit={onSubmit}
                  files={files}
                  setFiles={setFiles}
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
