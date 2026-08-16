import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

let socketInstance = null

export const createSocketClient = (token) => {
  if (!SOCKET_URL) {
    return null
  }

  if (socketInstance) {
    socketInstance.disconnect()
  }

  socketInstance = io(SOCKET_URL, {
    transports: ['websocket'],
    auth: {
      token,
    },
  })

  return socketInstance
}

export const disconnectSocketClient = () => {
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
  }
}
