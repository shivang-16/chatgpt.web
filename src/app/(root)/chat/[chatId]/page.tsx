"use client"

import { useState } from "react"
import Sidebar from "../../_components/Sidebar"
import ChatInterface from "../../_components/Chat-Interface"
import { useParams } from "next/navigation"
import { useAppSelector } from "@/redux/hooks"

export default function Home() {
  const params = useParams()
  const chatId = params.chatId as string
  const user = useAppSelector(state => state.user.user);

  console.log(chatId)
  return (
    <div className="flex h-screen bg-[#212121] text-white">
      {user &&<Sidebar />}
      <ChatInterface chatId={chatId} />
    </div>
  )
}
