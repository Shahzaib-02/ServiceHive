import React, { useEffect, useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useRealtime } from '../../hooks/useRealtime'

const ChatPanel = ({ bookingId = null }) => {
  const { messages, sendMessage, setChatBookingId } = useRealtime()
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (bookingId) {
      setChatBookingId(bookingId)
    }
    return () => {
      if (bookingId) {
        setChatBookingId(null)
      }
    }
  }, [bookingId, setChatBookingId])

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!draft.trim()) {
      return
    }

    sendMessage(draft.trim())
    setDraft('')
  }

  const senderLabel = (message) => message.senderRole || message.sender || 'participant'

  return (
    <div className="surface-card h-full p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Chat</h3>
        <p className="text-sm text-slate-400">
          {bookingId ? 'Messages for this booking. The provider auto-replies after a short delay.' : 'Select an active booking to start chatting.'}
        </p>
      </div>
      <div className="mb-4 max-h-72 space-y-3 overflow-auto pr-1">
        {!bookingId ? (
          <p className="text-sm text-slate-500">No booking linked to this chat session.</p>
        ) : null}
        {messages.map((message) => (
          <div key={message.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium capitalize text-white">{senderLabel(message)}</p>
              <p className="text-xs text-slate-500">{new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <p className="mt-2 text-sm text-slate-300">{message.body}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Message"
          placeholder="Type a message..."
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <Button type="submit" className="w-full" disabled={!bookingId}>
          Send message
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

export default ChatPanel


