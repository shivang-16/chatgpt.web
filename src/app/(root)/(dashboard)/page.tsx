"use client"

import { useState } from "react"
import Sidebar from "../_components/Sidebar"
import ChatInterface from "../_components/Chat-Interface"

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true)

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      {showSidebar && <Sidebar />}
      <ChatInterface showSidebar={showSidebar} onToggleSidebar={() => setShowSidebar(!showSidebar)} />
    </div>
  )
}
