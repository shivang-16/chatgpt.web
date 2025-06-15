import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, MessageSquarePlus, Search, Library, Sparkles, Bot, CreditCard, SidebarIcon } from "lucide-react"
import Image from "next/image"

const chatHistory = [
  "Electricity Bill Subsidy Details",
  "Intern Report Email Draft",
  "Internship Report Summary",
  "Should I start with this",
  "New chat",
  "Gemini API Chat UI",
  "AI Agent Collaboration",
  "Unique Elements in Array",
  "Debounce Function Implementation",
  "Pagination for Large Datasets",
  "Hi Shivang Response",
  "Overlay window during screen s...",
  "AI Task Manager Clarifications",
  "Mac Data Usage Tips",
]

export default function Sidebar() {
  return (
    <div className="w-[260px] bg-[#171717] px-2 border-r border-[#2f2f2f] flex flex-col">
     <div className="flex mx-2 my-3 justify-between mb-6">
     <Image src='/logo.png' alt="ChatGPT Logo" width={20} height={20} className='rounded-lg invert' />
     <SidebarIcon className="w-5  h-5 mr-3" />

     </div>

      {/* Navigation */}
      <div>
      <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-11 px-3">
          <MessageSquarePlus className="w-4 h-4 mr-3" />
          New chat
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3">
          <Search className="w-4 h-4 mr-3" />
          Search chats
        </Button>
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3">
          <Library className="w-4 h-4 mr-3" />
          Library
        </Button>
      </div>

      <div className="mt-4">
        <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3">
          <Sparkles className="w-4 h-4 mr-3" />
          Sora
        </Button>
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
            {chatHistory.map((chat, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-[#2f2f2f] h-10 px-3 text-sm font-normal truncate"
              >
                {chat}
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
