'use client'

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Settings,
  MessageSquarePlus,
  Search,
  Sparkles,
  Bot,
  CreditCard,
  SidebarIcon
} from "lucide-react"
import Image from "next/image"
import { useRouter, usePathname } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import { getChats } from '@/actions/chat_actions'
import { useEffect, useState } from "react"

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAppSelector(state => state.user.user)
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [isLoadingChats, setIsLoadingChats] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        setIsLoadingChats(true)
        const response = await getChats()
        setIsLoadingChats(false)

        if (response.success && response.data) {
          setChatHistory(response.data)
        } else {
          console.error("Failed to fetch chats:", response.error)
        }
      }
    }
    fetchChats()
  }, [user])

  const handleNewChat = () => {
    router.push('/')
  }

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const SkeletonChatButton = () => (
    <div className="w-full h-10 px-3 mb-2 animate-pulse bg-[#212121] rounded-md" />
  )

  return (
    <div
      className={`fixed md:sticky top-0 overflow-auto left-0 h-full z-50 bg-[#171717] border-r border-[#2f2f2f] transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'w-[260px]' : 'w-[48px] h-[48px] mt-2 bg-[#171717] rounded-2xl'}`}
    >
      <div className={`h-full flex flex-col ${isSidebarOpen ? 'px-2' : 'px-1'}`}>
        {/* Header with logo and toggle button */}
        <div className="flex items-center justify-between mx-2 pt-3 pb-3 mb-3 sticky top-0 bg-[#171717]">
          {isSidebarOpen && (
            <Image src='/logo.png' alt="ChatGPT Logo" width={20} height={20} className='rounded-lg invert' />
          )}
          <SidebarIcon
            className="w-5 h-5 text-white cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>

        {isSidebarOpen && (
          <>
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

            {/* External Links */}
            <div className="mt-4">
              <a href="https://sora.chatgpt.com/explore" target="_blank">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3">
                  <Sparkles className="w-4 h-4 mr-3" />
                  Sora
                </Button>
              </a>
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
                  {isLoadingChats
                    ? Array.from({ length: 6 }).map((_, idx) => (
                        <SkeletonChatButton key={idx} />
                      ))
                    : chatHistory.map((chat) => (
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
            <div className="p-3 border-t border-[#2f2f2f] sticky bg-[#171717] bottom-0">
              <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3">
                <CreditCard className="w-4 h-4 mr-3" />
                <div className="flex flex-col items-start">
                  <span className="text-sm">Upgrade plan</span>
                  <span className="text-xs text-[#8e8ea0]">More access to the best models</span>
                </div>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
