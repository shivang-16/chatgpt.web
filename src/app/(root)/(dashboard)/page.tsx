"use client"

import { useState } from "react"
import Sidebar from "../_components/Sidebar"
import ChatInterface from "../_components/Chat-Interface"
import { useAppSelector } from "@/redux/hooks";

export default function Home() {
  const user = useAppSelector(state => state.user.user);

  return (
    <div className="flex h-screen bg-[#212121] text-white">
      {user && <Sidebar />}
      <ChatInterface />
    </div>
  )
}
