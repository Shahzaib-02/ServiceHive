



import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, X, Minimize2, Maximize2, Bot, User, Sparkles, Zap, Clock, ChevronDown, MoreHorizontal } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Card from '../ui/Card'
import { generateChatResponse } from '../../services/api/openaiApi'

const ServiceHiveChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm ServiceHive Assistant. I have access to real-time platform data and can answer questions about available services, providers, bookings, pricing, and more. How can I help you?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const generateBotResponse = async (userMessage, currentMessages) => {
    try {
      const response = await generateChatResponse(userMessage, currentMessages)
      return response
    } catch (error) {
      console.error('Error generating AI response:', error)
      return "I'm having trouble connecting right now. Please try again in a moment or contact support@servicehive.com for immediate help."
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputMessage('')
    setIsTyping(true)

    try {
      const botResponseText = await generateBotResponse(inputMessage, updatedMessages)
      const botResponse = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error in handleSendMessage:', error)
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "I'm having trouble processing your request right now. Please try again or contact support@servicehive.com for help.",
          sender: 'bot',
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // ========== CLOSED STATE - Floating Button ==========
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#1a1a1a] border border-[#333] shadow-2xl shadow-black/50 hover:border-[#facc15]/50 transition-all duration-300 hover:scale-105"
          aria-label="Open AI Assistant"
        >
          {/* Subtle glow on hover */}
          <div className="absolute inset-0 rounded-full bg-[#facc15]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <Sparkles className="w-6 h-6 text-[#facc15]" />

          {/* Online indicator */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#1a1a1a]">
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-40" />
          </span>
        </button>
      </div>
    )
  }

  // ========== OPEN STATE - Chat Panel ==========
  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[650px] max-h-[85vh]">
      <div className="flex flex-col h-full bg-[#0d0d0d] rounded-2xl border border-[#222] shadow-2xl shadow-black/60 overflow-hidden">

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a] bg-[#0d0d0d]">
          <div className="flex items-center gap-3">
            {/* AI Avatar */}
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#facc15]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#0d0d0d]" />
            </div>

            <div>
              <h3 className="text-white text-sm font-semibold tracking-tight">ServiceHive Assistant</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[11px] text-[#666]">Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#666] hover:text-white hover:bg-[#1a1a1a] transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#666] hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* ===== MESSAGES AREA ===== */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
            >
              {messages.map((message, index) => {
                const isBot = message.sender === 'bot'
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
                    style={{ animation: 'fadeIn 0.2s ease-out' }}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 ${
                      isBot 
                        ? 'bg-[#1a1a1a] border border-[#2a2a2a]' 
                        : 'bg-[#facc15]'
                    }`}>
                      {isBot ? (
                        <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-black" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col max-w-[85%] ${isBot ? 'items-start' : 'items-end'}`}>
                      {/* Sender name + time */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-medium text-[#888]">
                          {isBot ? 'Assistant' : 'You'}
                        </span>
                        <span className="text-[10px] text-[#444]">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>

                      {/* Bubble */}
                      <div className={`relative px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                        isBot
                          ? 'bg-[#1a1a1a] text-[#e5e5e5] rounded-tl-sm border border-[#252525]'
                          : 'bg-[#facc15] text-black font-medium rounded-tr-sm'
                      }`}>
                        {message.text}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[11px] font-medium text-[#888] mb-1">Assistant</span>
                    <div className="bg-[#1a1a1a] border border-[#252525] rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-[#666] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ===== INPUT AREA ===== */}
            <div className="px-5 py-4 border-t border-[#1a1a1a] bg-[#0d0d0d]">
              <div className="relative flex items-end gap-2 bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] focus-within:border-[#facc15]/30 focus-within:ring-1 focus-within:ring-[#facc15]/10 transition-all">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask anything..."
                  rows={1}
                  className="flex-1 bg-transparent text-white text-[13px] placeholder-[#555] px-4 py-3.5 resize-none outline-none max-h-32"
                  style={{ minHeight: '48px' }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-[#facc15] text-black m-1.5 hover:bg-[#fde047] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#444] flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    AI Powered
                  </span>
                  <span className="text-[10px] text-[#444] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Live Data
                  </span>
                </div>
                <span className="text-[10px] text-[#333]">Enter to send</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fade-in animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default ServiceHiveChatbot