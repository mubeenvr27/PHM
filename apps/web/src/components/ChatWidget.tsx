"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <>
      {/* Expanded Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white md:bottom-24 md:left-auto md:right-6 md:top-auto md:h-[520px] md:w-[380px] md:rounded-2xl md:border md:border-[#E2EBF4] md:shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex h-16 shrink-0 items-center justify-between bg-[#1B3A5C] px-4 text-white">
            <h2 className="font-semibold">PHM Assistant</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition-colors hover:bg-white/10 md:hidden"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto bg-[#F8FAFC] p-4">
            <div className="flex w-full flex-col gap-4">
              {/* Assistant Message Bubble */}
              <div className="mr-auto max-w-[85%] rounded-2xl rounded-tl-sm border border-[#E2EBF4] bg-white p-3 text-[0.9375rem] text-[#1A1A2E] shadow-sm leading-relaxed">
                Hello. I am the PHM virtual assistant. How can I guide you today?
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="shrink-0 border-t border-[#E2EBF4] bg-white p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // Chat logic will go here
                setInputValue("");
              }}
              className="flex items-center gap-2"
            >
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 focus-visible:ring-[#0D7377]"
              />
              <Button
                type="submit"
                size="icon"
                className="shrink-0 bg-[#0D7377] text-white transition-colors hover:bg-[#0a5f63]"
                aria-label="Send message"
              >
                <Send size={18} />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0D7377] text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label={isOpen ? "Close PHM virtual assistant" : "Open PHM virtual assistant"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
