'use client'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, MessageSquarePlus, Search, Library, Sparkles, Bot, CreditCard, SidebarIcon } from "lucide-react"
import Image from "next/image"
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { getChats } from '@/actions/chat_actions';
import { useEffect, useState } from "react";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAppSelector(state => state.user.user);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        const response = await getChats();
        if (response.success && response.data) {
          setChatHistory(response.data);
        } else {
          console.error("Failed to fetch chats:", response.error);
        }
      }
    };
    fetchChats();
  }, [user]);

  const handleNewChat = () => {
    router.push('/');
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  return (
    <div className="w-[260px] bg-[#171717] px-2 border-r border-[#2f2f2f] flex flex-col">
     <div className="flex mx-2 my-3 justify-between mb-6">
     <Image src='/logo.png' alt="ChatGPT Logo" width={20} height={20} className='rounded-lg invert' />
     <SidebarIcon className="w-5  h-5 mr-3" />

     </div>

      {/* Navigation */}
      <div>
      <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-11 px-3" onClick={handleNewChat}>
          <MessageSquarePlus className="w-4 h-4 mr-3" />
          New chat
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3">
          <Search className="w-4 h-4 mr-3" />
          Search chats
        </Button>
      </div>

      <div className="mt-4">
        <a href="https://sora.chatgpt.com/explore" target="_blank">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3">
          <Sparkles className="w-4 h-4 mr-3" />
          Sora
        </Button>
        </a>
        <a href=""></a>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3">
          <Bot className="w-4 h-4 mr-3" />
          GPTs
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 mt-6">
        <div className="text-xs text-[#8e8ea0] mb-2 px-3">Chats</div>
        <ScrollArea className="h-full">
          <div>
            {chatHistory.map((chat) => (
              <Button
                key={chat._id}
                variant="ghost"
                className={`w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3 text-sm font-normal truncate ${pathname === `/chat/${chat._id}` ? 'bg-[#2f2f2f]' : ''}`}
                onClick={() => handleChatClick(chat._id)}
              >
                {chat.heading}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-[#2f2f2f]">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3">
          <CreditCard className="w-4 h-4 mr-3" />
          <div className="flex flex-col items-start">
            <span className="text-sm">Upgrade plan</span>
            <span className="text-xs text-[#8e8ea0]">More access to the best models</span>
          </div>
        </Button>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-medium">
              U
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-[#2f2f2f]">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
