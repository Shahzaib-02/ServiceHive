import { useContext, useMemo } from 'react'
import { AppContext } from '../context/AppContext'

export const useRealtime = () => {
  const ctx = useContext(AppContext)
  return useMemo(() => ({
    socketConnected: ctx.socketConnected,
    chatRoomJoined: ctx.chatRoomJoined,
    chatError: ctx.chatError,
    providerLocation: ctx.providerLocation,
    messages: ctx.messages,
    notifications: ctx.notifications,
    sendMessage: ctx.sendMessage,
    setChatBookingId: ctx.setChatBookingId,
    chatBookingId: ctx.chatBookingId,
  }), [
    ctx.socketConnected,
    ctx.chatRoomJoined,
    ctx.chatError,
    ctx.providerLocation,
    ctx.messages,
    ctx.notifications,
    ctx.sendMessage,
    ctx.setChatBookingId,
    ctx.chatBookingId,
  ])
}
