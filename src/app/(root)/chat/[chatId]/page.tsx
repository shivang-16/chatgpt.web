"use client"

import { useState } from "react"
import Sidebar from "../../_components/Sidebar"
import ChatInterface from "../../_components/Chat-Interface"
import { useParams } from "next/navigation"

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true)
  const params = useParams()
  const chatId = params.chatId as string
  console.log(chatId)
  return (
    <div className="flex h-screen bg-[#212121] text-white">
      {showSidebar && <Sidebar />}
      <ChatInterface showSidebar={showSidebar} onToggleSidebar={() => setShowSidebar(!showSidebar)} chatId={chatId} />
    </div>
  )
}
