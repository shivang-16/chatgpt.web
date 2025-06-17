'use client';

import { Sparkle, Share } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import ChatShare from './Chat-Share'; // Ensure correct import path

const ChatHeader = ({ user, chatId }: { user: any; chatId?: string }) => {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-10 bg-[#212121] flex items-center px-4 py-1 justify-between">
        {/* Left: Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium">ChatGPT</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14l5-5 5 5z" />
            </svg>
          </div>
        </div>

        {/* Middle */}
        {user && (
          <div className="hidden md:flex items-center justify-center w-full space-x-4">
            <div className="flex flex-col items-center space-y-2 text-sm text-[#8e8ea0]">
              <div className="flex items-center space-x-1">
                <span>Context Memory</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <a
                href="https://chatgpt.com/#pricing"
                target="_blank"
                rel="noreferrer"
              >
                <button className="bg-[#373669] hover:bg-[#4b4a78] cursor-pointer text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <Sparkle className="w-4 h-4 mr-2" />
                  Get Plus
                </button>
              </a>
            </div>
          </div>
        )}

        {/* Right: Share + Avatar / Auth */}
        <div className="flex items-center space-x-4">
          {chatId && (
            <div
              className="hidden md:flex items-center space-x-1 cursor-pointer hover:opacity-80 text-white"
              onClick={() => setShowShareModal(true)}
            >
              <Share className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </div>
          )}

          {user ? (
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-medium">
              {user.firstname?.[0]?.toUpperCase() || 'U'}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <button className="bg-white text-black py-2 px-4 rounded-full text-sm font-medium hover:opacity-90">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="border border-white text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white hover:text-black">
                  Sign up for free
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ChatShare setShowShareModal={setShowShareModal} />
      )}
    </>
  );
};

export default ChatHeader;
