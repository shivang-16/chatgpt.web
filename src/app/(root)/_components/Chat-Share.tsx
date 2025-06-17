import React, { useState } from 'react';

const ChatShare = ({
  setShowShareModal,
}: {
  setShowShareModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-[#1f1f1f] text-white p-6 rounded-xl w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Share public link to chat</h3>
          <button
            onClick={() => setShowShareModal(false)}
            className="text-gray-400 text-xl leading-none hover:text-white"
          >
            ×
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Your name, custom instructions, and any messages you add after
          sharing stay private.
        </p>
        <div className="flex items-center bg-[#2a2a2a] px-3 py-2 rounded-lg">
          <input
            value={currentUrl}
            className="bg-transparent text-white text-sm w-full outline-none"
            readOnly
          />
          <button
            className="ml-3 bg-white text-black text-sm px-3 py-2 rounded-lg font-medium"
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatShare;
