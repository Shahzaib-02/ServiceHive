













// import React, { useEffect, useRef, useState } from 'react'
// import { X, Send, Wifi, WifiOff, MessageSquare, Circle } from 'lucide-react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useRealtime } from '../../hooks/useRealtime'
// import { useAuth } from '../../hooks/useAuth'

// const BookingChatDrawer = ({ bookingId, title = 'Chat', isOpen, onClose }) => {
//   const { messages, sendMessage, setChatBookingId, socketConnected } = useRealtime()
//   const { user } = useAuth()
//   const [draft, setDraft] = useState('')
//   const bottomRef = useRef(null)
//   const inputRef = useRef(null)

//   useEffect(() => {
//     if (isOpen && bookingId) {
//       setChatBookingId(bookingId)
//       setTimeout(() => inputRef.current?.focus(), 300)
//     }
//     return () => { if (bookingId) setChatBookingId(null) }
//   }, [isOpen, bookingId, setChatBookingId])

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const handleSend = (e) => {
//     e?.preventDefault()
//     if (!draft.trim()) return
//     sendMessage(draft.trim())
//     setDraft('')
//   }

//   const handleKeyDown = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       handleSend()
//     }
//   }

//   // Group messages by date
//   const groupedMessages = messages.reduce((groups, msg) => {
//     const date = new Date(msg.sentAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
//     if (!groups[date]) groups[date] = []
//     groups[date].push(msg)
//     return groups
//   }, {})

//   // Extract name from title e.g. "Chat · Repairing Cars" → "RC"
//   const getInitials = () => {
//     const name = title.replace('Chat · ', '').replace('Chat with ', '')
//     return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
//   }

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Backdrop */}
//           <motion.div
//             key="backdrop"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="fixed inset-0 z-40"
//             style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
//             onClick={onClose}
//           />

//           {/* Drawer */}
//           <motion.div
//             key="drawer"
//             initial={{ x: '100%', opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             exit={{ x: '100%', opacity: 0 }}
//             transition={{ type: 'spring', damping: 32, stiffness: 300 }}
//             className="fixed right-0 top-0 h-full z-50 flex flex-col"
//             style={{
//               width: '380px',
//               background: 'linear-gradient(180deg, #0d1117 0%, #0a0e14 100%)',
//               borderLeft: '1px solid rgba(255,255,255,0.06)',
//               boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
//             }}
//           >
//             {/* ── Header ─────────────────────────────────────────────────── */}
//             <div
//               className="shrink-0 px-5 py-4"
//               style={{
//                 background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.06) 100%)',
//                 borderBottom: '1px solid rgba(255,255,255,0.06)',
//               }}
//             >
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-3">
//                   {/* Avatar */}
//                   <div
//                     className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-xs font-bold text-white"
//                     style={{
//                       background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
//                       boxShadow: '0 0 16px rgba(6,182,212,0.3)',
//                     }}
//                   >
//                     {getInitials()}
//                     {/* Online dot */}
//                     <span
//                       className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2"
//                       style={{
//                         background: socketConnected ? '#22c55e' : '#6b7280',
//                         borderColor: '#0d1117',
//                         boxShadow: socketConnected ? '0 0 6px #22c55e' : 'none',
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <p className="text-sm font-semibold text-white leading-tight" style={{ fontFamily: 'system-ui' }}>
//                       {title.replace('Chat · ', '')}
//                     </p>
//                     <div className="flex items-center gap-1.5 mt-0.5">
//                       {socketConnected ? (
//                         <>
//                           <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 4px #34d399' }} />
//                           <span className="text-[11px] text-emerald-400 font-medium">Online · Live chat</span>
//                         </>
//                       ) : (
//                         <>
//                           <WifiOff className="h-3 w-3 text-slate-500" />
//                           <span className="text-[11px] text-slate-500">Connecting...</span>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={onClose}
//                   className="flex h-8 w-8 items-center justify-center rounded-xl transition-all"
//                   style={{ color: '#64748b' }}
//                   onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff' }}
//                   onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b' }}
//                 >
//                   <X className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>

//             {/* ── Messages area ───────────────────────────────────────────── */}
//             <div
//               className="flex-1 overflow-y-auto px-4 py-5"
//               style={{
//                 scrollbarWidth: 'thin',
//                 scrollbarColor: 'rgba(255,255,255,0.08) transparent',
//               }}
//             >
//               {messages.length === 0 ? (
//                 /* Empty state */
//                 <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-6">
//                   <div
//                     className="flex h-16 w-16 items-center justify-center rounded-3xl"
//                     style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.1))', border: '1px solid rgba(6,182,212,0.2)' }}
//                   >
//                     <MessageSquare className="h-7 w-7 text-cyan-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-white mb-1">Start the conversation</p>
//                     <p className="text-xs text-slate-500 leading-relaxed">
//                       Messages are private between you and the other party.
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 /* Grouped messages */
//                 Object.entries(groupedMessages).map(([date, msgs]) => (
//                   <div key={date}>
//                     {/* Date separator */}
//                     <div className="flex items-center gap-3 my-4">
//                       <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
//                       <span className="text-[10px] font-medium px-2 py-0.5 rounded-full text-slate-500"
//                         style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
//                         {date}
//                       </span>
//                       <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
//                     </div>

//                     <div className="space-y-2">
//                       {msgs.map((msg, i) => {
//                         const isMe = msg.senderRole === user?.role
//                         const showRole = i === 0 || msgs[i - 1]?.senderRole !== msg.senderRole

//                         return (
//                           <motion.div
//                             key={msg.id}
//                             initial={{ opacity: 0, y: 8, scale: 0.97 }}
//                             animate={{ opacity: 1, y: 0, scale: 1 }}
//                             transition={{ duration: 0.2 }}
//                             className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
//                           >
//                             {/* Role label — only first in a sequence */}
//                             {showRole && (
//                               <span className="text-[10px] font-medium capitalize mb-1 px-1"
//                                 style={{ color: isMe ? '#67e8f9' : '#94a3b8' }}>
//                                 {isMe ? 'You' : msg.senderRole}
//                               </span>
//                             )}

//                             {/* Bubble */}
//                             <div
//                               className="relative max-w-[78%] px-4 py-2.5 text-sm leading-relaxed"
//                               style={isMe ? {
//                                 background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(6,182,212,0.15))',
//                                 border: '1px solid rgba(6,182,212,0.25)',
//                                 borderRadius: '18px 18px 4px 18px',
//                                 color: '#e0f9ff',
//                                 boxShadow: '0 2px 12px rgba(6,182,212,0.1)',
//                               } : {
//                                 background: 'rgba(255,255,255,0.05)',
//                                 border: '1px solid rgba(255,255,255,0.08)',
//                                 borderRadius: '18px 18px 18px 4px',
//                                 color: '#cbd5e1',
//                               }}
//                             >
//                               {msg.body}
//                             </div>

//                             {/* Timestamp */}
//                             <span className="text-[10px] mt-1 px-1" style={{ color: '#374151' }}>
//                               {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                             </span>
//                           </motion.div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 ))
//               )}
//               <div ref={bottomRef} />
//             </div>

//             {/* ── Input bar ───────────────────────────────────────────────── */}
//             <div
//               className="shrink-0 px-4 py-4"
//               style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}
//             >
//               <form onSubmit={handleSend} className="flex items-center gap-2">
//                 <div className="relative flex-1">
//                   <input
//                     ref={inputRef}
//                     className="w-full py-3 pl-4 pr-4 text-sm text-white placeholder-slate-600 outline-none transition-all"
//                     style={{
//                       background: 'rgba(255,255,255,0.05)',
//                       border: '1px solid rgba(255,255,255,0.08)',
//                       borderRadius: '14px',
//                     }}
//                     placeholder={socketConnected ? 'Type a message...' : 'Connecting...'}
//                     value={draft}
//                     onChange={(e) => setDraft(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     onFocus={e => { e.currentTarget.style.border = '1px solid rgba(6,182,212,0.4)'; e.currentTarget.style.background = 'rgba(6,182,212,0.05)' }}
//                     onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
//                     disabled={!socketConnected}
//                   />
//                 </div>

//                 {/* Send button */}
//                 <motion.button
//                   type="submit"
//                   disabled={!draft.trim() || !socketConnected}
//                   whileTap={{ scale: 0.92 }}
//                   className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all"
//                   style={{
//                     background: draft.trim() && socketConnected
//                       ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
//                       : 'rgba(255,255,255,0.05)',
//                     border: '1px solid rgba(6,182,212,0.2)',
//                     boxShadow: draft.trim() && socketConnected ? '0 0 16px rgba(6,182,212,0.3)' : 'none',
//                     color: draft.trim() && socketConnected ? '#fff' : '#374151',
//                   }}
//                 >
//                   <Send className="h-4 w-4" style={{ marginLeft: '1px' }} />
//                 </motion.button>
//               </form>

//               {/* Hint text */}
//               <p className="text-center text-[10px] mt-2" style={{ color: '#1e293b' }}>
//                 Press Enter to send · Shift+Enter for new line
//               </p>
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   )
// }

// export default BookingChatDrawer



import React, { useEffect, useRef, useState } from 'react'
import { X, Send, Minimize2, Maximize2, MessageCircle, User, Sparkles, Zap, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealtime } from '../../hooks/useRealtime'
import { useAuth } from '../../hooks/useAuth'

/**
 * BookingChatDrawer
 * Matches ServiceHiveChatbot UI — dark #0d0d0d theme, #facc15 yellow accents
 *
 * Props:
 *   bookingId  — string | null
 *   title      — string  e.g. "reparing cars"
 *   isOpen     — bool
 *   onClose    — () => void
 */
const BookingChatDrawer = ({ bookingId, title = 'Chat', isOpen, onClose }) => {
  const { messages, sendMessage, setChatBookingId, socketConnected, chatRoomJoined, chatError } = useRealtime()
  const { user } = useAuth()
  const [draft, setDraft] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen && bookingId) {
      setChatBookingId(bookingId)
      setTimeout(() => inputRef.current?.focus(), 300)
    }
    return () => { if (bookingId) setChatBookingId(null) }
  }, [isOpen, bookingId, setChatBookingId])

  useEffect(() => {
    if (!isMinimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isMinimized])

  const canSend = Boolean(draft.trim()) && socketConnected
  const inputPlaceholder = chatError
    ? chatError
    : !socketConnected
      ? 'Connecting...'
      : !chatRoomJoined
        ? 'Joining chat...'
        : 'Type a message...'

  const handleSend = () => {
    if (!draft.trim() || !socketConnected) return
    sendMessage(draft.trim())
    setDraft('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  // Clean up title for display
  const displayTitle = title.replace('Chat · ', '').replace('Chat with ', '')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)' }}
            onClick={onClose}
          />

          {/* Drawer — fixed right side, matches chatbot panel style */}
          <motion.div
            key="drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed right-6 bottom-6 z-50 w-[420px] max-w-[calc(100vw-2rem)]"
            style={{ height: isMinimized ? 'auto' : '650px', maxHeight: '85vh' }}
          >
            <div
              className="flex flex-col h-full rounded-2xl overflow-hidden"
              style={{
                background: '#0d0d0d',
                border: '1px solid #222',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              }}
            >
              {/* ── HEADER ─────────────────────────────────────────────── */}
              <div
                className="flex items-center justify-between px-5 py-4 shrink-0"
                style={{ borderBottom: '1px solid #1a1a1a', background: '#0d0d0d' }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar — matches chatbot's bot avatar style but yellow bg for user chat */}
                  <div className="relative">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    >
                      <MessageCircle className="w-5 h-5" style={{ color: '#facc15' }} />
                    </div>
                    {/* Online dot */}
                    <span
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                      style={{
                        background: socketConnected ? '#22c55e' : '#6b7280',
                        border: '2px solid #0d0d0d',
                      }}
                    />
                  </div>

                  <div>
                    <h3
                      className="text-sm font-semibold tracking-tight"
                      style={{ color: '#ffffff' }}
                    >
                      {displayTitle}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: socketConnected ? '#22c55e' : '#6b7280' }}
                      />
                      <span className="text-[11px]" style={{ color: '#666' }}>
                        {socketConnected ? 'Online' : 'Connecting...'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Minimize / Maximize */}
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: '#666' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = '#1a1a1a' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent' }}
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>

                  {/* Close */}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: '#666' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.1)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.background = 'transparent' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isMinimized && (
                <>
                  {chatError ? (
                    <div className="mx-5 mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200 shrink-0">
                      {chatError}
                    </div>
                  ) : null}

                  {/* ── MESSAGES AREA ────────────────────────────────────── */}
                  <div
                    className="flex-1 overflow-y-auto px-5 py-6 space-y-6"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}
                  >
                    {messages.length === 0 ? (
                      /* Empty state — matches chatbot style */
                      <div className="flex h-full flex-col items-center justify-center gap-4 text-center py-16">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center"
                          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                        >
                          <MessageCircle className="w-7 h-7" style={{ color: '#facc15' }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-1" style={{ color: '#ffffff' }}>
                            Start the conversation
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: '#555' }}>
                            Messages are private between<br />you and the other party.
                          </p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.senderRole === user?.role
                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                            style={{ animation: 'fadeIn 0.2s ease-out' }}
                          >
                            {/* Avatar */}
                            <div
                              className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
                              style={isMe
                                ? { background: '#facc15' }
                                : { background: '#1a1a1a', border: '1px solid #2a2a2a' }
                              }
                            >
                              {isMe ? (
                                <User className="w-3.5 h-3.5" style={{ color: '#000' }} />
                              ) : (
                                <MessageCircle className="w-3.5 h-3.5" style={{ color: '#facc15' }} />
                              )}
                            </div>

                            {/* Message content */}
                            <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                              {/* Name + time */}
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-medium" style={{ color: '#888' }}>
                                  {isMe ? 'You' : msg.senderRole}
                                </span>
                                <span className="text-[10px]" style={{ color: '#444' }}>
                                  {formatTime(msg.sentAt)}
                                </span>
                              </div>

                              {/* Bubble — exact same style as chatbot */}
                              <div
                                className="px-4 py-2.5 text-[13px] leading-relaxed"
                                style={isMe ? {
                                  background: '#facc15',
                                  color: '#000',
                                  fontWeight: '500',
                                  borderRadius: '16px 16px 4px 16px',
                                } : {
                                  background: '#1a1a1a',
                                  color: '#e5e5e5',
                                  border: '1px solid #252525',
                                  borderRadius: '16px 16px 16px 4px',
                                }}
                              >
                                {msg.body}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}

                    <div ref={bottomRef} />
                  </div>

                  {/* ── INPUT AREA ────────────────────────────────────────── */}
                  <div
                    className="px-5 py-4 shrink-0"
                    style={{ borderTop: '1px solid #1a1a1a', background: '#0d0d0d' }}
                  >
                    {/* Input box — exact same as chatbot */}
                    <div
                      className="relative flex items-end gap-2 rounded-xl transition-all"
                      style={{
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                      }}
                      onFocusCapture={e => { e.currentTarget.style.border = '1px solid rgba(250,204,21,0.3)'; e.currentTarget.style.boxShadow = '0 0 0 1px rgba(250,204,21,0.1)' }}
                      onBlurCapture={e => { e.currentTarget.style.border = '1px solid #2a2a2a'; e.currentTarget.style.boxShadow = 'none' }}
                    >
                      <textarea
                        ref={inputRef}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={inputPlaceholder}
                        rows={1}
                        disabled={!socketConnected}
                        className="flex-1 bg-transparent text-[13px] placeholder-[#555] px-4 py-3.5 resize-none outline-none"
                        style={{ color: '#ffffff', minHeight: '48px', maxHeight: '128px' }}
                      />
                      <button
                        onClick={handleSend}
                        disabled={!canSend}
                        className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg m-1.5 transition-all duration-200"
                        style={{
                          background: canSend ? '#facc15' : 'transparent',
                          color: canSend ? '#000' : '#444',
                          cursor: canSend ? 'pointer' : 'not-allowed',
                          opacity: canSend ? 1 : 0.4,
                        }}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Footer hints — same as chatbot */}
                    <div className="flex items-center justify-between mt-2 px-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] flex items-center gap-1" style={{ color: '#444' }}>
                          <Zap className="w-3 h-3" />
                          Live chat
                        </span>
                        <span className="text-[10px] flex items-center gap-1" style={{ color: '#444' }}>
                          <Clock className="w-3 h-3" />
                          Real-time
                        </span>
                      </div>
                      <span className="text-[10px]" style={{ color: '#333' }}>Enter to send</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Fade-in animation — same as chatbot */}
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(4px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  )
}

export default BookingChatDrawer