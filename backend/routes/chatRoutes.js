
// import express from 'express';
// import jwt from 'jsonwebtoken';
// import { authenticateToken } from '../middleware/authMiddleware.js';
// import { assertChatAccess, getMessages, markMessagesRead, saveMessage } from '../services/chatService.js';

// const router = express.Router();

// // ── GET /api/chat/:bookingId/messages ──────────────────────────────────────
// router.get('/:bookingId/messages', authenticateToken, async (req, res) => {
//   try {
//     await assertChatAccess(req.params.bookingId, req.user.id);
//     const messages = await getMessages(req.params.bookingId);

//     // Normalise shape so the frontend always gets { id, senderRole, body, sentAt }
//     const normalised = messages.map((m) => ({
//       id:         m._id,
//       senderRole: m.senderRole,
//       sender:     m.senderRole,
//       body:       m.body,
//       sentAt:     m.createdAt,
//       isRead:     m.isRead,
//     }));

//     res.json({ success: true, data: normalised });
//   } catch (error) {
//     const status = error.message.includes('not found') ? 404
//                  : error.message.includes('denied')    ? 403
//                  : error.message.includes('not available') ? 400
//                  : 500;
//     res.status(status).json({ success: false, message: error.message });
//   }
// });

// // ── POST /api/chat/:bookingId/read ─────────────────────────────────────────
// router.post('/:bookingId/read', authenticateToken, async (req, res) => {
//   try {
//     await assertChatAccess(req.params.bookingId, req.user.id);
//     await markMessagesRead(req.params.bookingId, req.user.id);
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// export default router;


// /**
//  * registerChatSocket(io)
//  *
//  * Call this once from server.js after creating the Socket.io instance.
//  * Each authenticated client joins a room named `chat:<bookingId>`.
//  *
//  * Client must emit:
//  *   socket.emit('chat:join',    { bookingId, token })
//  *   socket.emit('chat:message', { bookingId, body })
//  *
//  * Server emits to room:
//  *   'chat:message'  — { id, senderRole, body, sentAt }
//  *   'chat:error'    — { message }
//  */
// export function registerChatSocket(io) {
//   // Namespace: /chat  (keeps chat events isolated from other socket events)
//   const chatNs = io.of('/chat');

//   chatNs.on('connection', (socket) => {

//     // ── chat:join ────────────────────────────────────────────────────────
//     socket.on('chat:join', async ({ bookingId, token } = {}) => {
//       try {
//         if (!token || !bookingId) {
//           return socket.emit('chat:error', { message: 'bookingId and token are required' });
//         }

//         // Verify JWT
//         let decoded;
//         try {
//           decoded = jwt.verify(token, process.env.JWT_SECRET);
//         } catch {
//           return socket.emit('chat:error', { message: 'Invalid or expired token' });
//         }

//         // Check booking access
//         const booking = await assertChatAccess(bookingId, decoded.id);

//         // Store user info on socket for later use
//         socket.userId    = decoded.id;
//         socket.userRole  = decoded.role;
//         socket.bookingId = bookingId;

//         // Join the room for this booking
//         socket.join(`chat:${bookingId}`);
//         socket.emit('chat:joined', { bookingId });

//       } catch (err) {
//         socket.emit('chat:error', { message: err.message });
//       }
//     });

//     // ── chat:message ─────────────────────────────────────────────────────
//     socket.on('chat:message', async ({ bookingId, body } = {}) => {
//       try {
//         if (!socket.userId) {
//           return socket.emit('chat:error', { message: 'Join a chat room first' });
//         }
//         if (!body?.trim()) {
//           return socket.emit('chat:error', { message: 'Message body cannot be empty' });
//         }
//         if (bookingId !== socket.bookingId) {
//           return socket.emit('chat:error', { message: 'bookingId mismatch' });
//         }

//         const saved = await saveMessage({
//           bookingId,
//           senderId:   socket.userId,
//           senderRole: socket.userRole,
//           body:       body.trim(),
//         });

//         const payload = {
//           id:         saved._id,
//           senderRole: saved.senderRole,
//           sender:     saved.senderRole,
//           body:       saved.body,
//           sentAt:     saved.createdAt,
//         };

//         // Broadcast to everyone in the room (including sender for confirmation)
//         chatNs.to(`chat:${bookingId}`).emit('chat:message', payload);

//       } catch (err) {
//         socket.emit('chat:error', { message: err.message });
//       }
//     });

//     // ── disconnect ───────────────────────────────────────────────────────
//     socket.on('disconnect', () => {
//       // Socket.io automatically removes socket from all rooms on disconnect
//     });
//   });
// }


/**
 * chatRoutes.js
 *
 * REST endpoints:
 *   GET  /api/chat/:bookingId/messages  — load message history
 *   POST /api/chat/:bookingId/read      — mark messages as read
 *
 * Real-time:
 *   registerChatSocket(io) — call once from server.js
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import { authenticateToken } from '../middleware/authMiddleware.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import User from '../models/User.js';
import {
  assertChatAccess,
  getUserRoleInBooking,
  getMessages,
  markMessagesRead,
  saveMessage,
} from '../services/chatService.js';

const router = express.Router();

function authUserId(req) {
  return req.user?._id || req.user?.id;
}

function normalizeMessagePayload(saved) {
  return {
    id:         String(saved._id),
    senderRole: saved.senderRole,
    sender:     saved.senderRole,
    body:       saved.body,
    sentAt:     saved.createdAt,
    isRead:     saved.isRead,
  };
}

async function buildPlatformContext() {
  const [services, providersByCity, bookingStatusBreakdown, totalApprovedServices, totalProviders, totalCustomers, totalBookings] = await Promise.all([
    Service.find({ status: 'approved' }).populate('providerId', 'name').lean().limit(100),
    User.aggregate([
      { $match: { role: 'provider', isApproved: true, isSuspended: false, city: { $exists: true, $ne: '' } } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $project: { _id: 0, city: '$_id', count: 1 } },
      { $sort: { count: -1 } },
    ]),
    Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Service.countDocuments({ status: 'approved' }),
    User.countDocuments({ role: 'provider', isApproved: true, isSuspended: false }),
    User.countDocuments({ role: 'customer', isApproved: true, isSuspended: false }),
    Booking.countDocuments(),
  ]);

  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || 'uncategorized';
    acc[category] = acc[category] || [];
    acc[category].push({
      title: service.title,
      price: service.price || service.basePrice || 0,
      provider: service.providerId?.name || 'Unknown',
    });
    return acc;
  }, {});

  const bookingStatusCounts = bookingStatusBreakdown.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  return {
    platform: 'ServiceHive',
    description: 'ServiceHive is a marketplace for home, beauty, tech, and local services from verified providers.',
    generatedAt: new Date().toISOString(),
    stats: {
      totalApprovedServices,
      totalProviders,
      totalCustomers,
      totalBookings,
    },
    servicesByCategory,
    providersByCity,
    bookingStatusBreakdown: bookingStatusCounts,
  };
}

async function callOpenAIChat(system, messages) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Set OPENAI_API_KEY in the backend environment.');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: system },
        ...messages,
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

// ── GET /api/chat/context ─────────────────────────────────────────────────
router.get('/context', async (req, res) => {
  try {
    const context = await buildPlatformContext();
    res.json(context);
  } catch (error) {
    console.error('Failed to build platform context:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── POST /api/chat ─────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { system, messages } = req.body;
    if (!system || !Array.isArray(messages)) {
      return res.status(400).json({ success: false, message: 'Invalid request body' });
    }

    const text = await callOpenAIChat(system, messages);
    res.json({ success: true, content: [{ type: 'text', text }] });
  } catch (error) {
    console.error('OpenAI chat error:', error);
    const status = error.message.includes('OpenAI API key') ? 500 : 502;
    res.status(status).json({ success: false, message: error.message });
  }
});

// ── GET /api/chat/:bookingId/messages ──────────────────────────────────────
router.get('/:bookingId/messages', authenticateToken, async (req, res) => {
  try {
    await assertChatAccess(req.params.bookingId, authUserId(req));
    const messages = await getMessages(req.params.bookingId);

    const normalised = messages.map((m) => normalizeMessagePayload(m));

    res.json({ success: true, data: normalised });
  } catch (error) {
    const status = error.message.includes('not found')     ? 404
                 : error.message.includes('denied')        ? 403
                 : error.message.includes('not available') ? 400
                 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
});

// ── POST /api/chat/:bookingId/messages — send via HTTP (socket fallback) ───
router.post('/:bookingId/messages', authenticateToken, async (req, res) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ success: false, message: 'Message body cannot be empty' });
    }

    const userId = authUserId(req);
    await assertChatAccess(req.params.bookingId, userId);
    const role = await getUserRoleInBooking(req.params.bookingId, userId);
    if (!role) {
      return res.status(403).json({ success: false, message: 'Could not determine your role in this booking' });
    }

    const saved = await saveMessage({
      bookingId: req.params.bookingId,
      senderId: userId,
      senderRole: role,
      body: body.trim(),
    });

    const payload = normalizeMessagePayload(saved);

    const io = req.app.get('io');
    if (io) {
      io.of('/chat').to(`chat:${String(req.params.bookingId)}`).emit('chat:message', payload);
    }

    res.status(201).json({ success: true, data: payload });
  } catch (error) {
    const status = error.message.includes('not found')     ? 404
                 : error.message.includes('denied')        ? 403
                 : error.message.includes('not available') ? 400
                 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
});

// ── POST /api/chat/:bookingId/read ─────────────────────────────────────────
router.post('/:bookingId/read', authenticateToken, async (req, res) => {
  try {
    const userId = authUserId(req);
    await assertChatAccess(req.params.bookingId, userId);
    await markMessagesRead(req.params.bookingId, userId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;


// ── Socket.io chat handler ─────────────────────────────────────────────────
/**
 * registerChatSocket(io)
 *
 * Client emits:
 *   socket.emit('chat:join',    { bookingId, token })
 *   socket.emit('chat:message', { bookingId, body })
 *
 * Server emits to room `chat:<bookingId>`:
 *   'chat:joined'   — { bookingId, role }
 *   'chat:message'  — { id, senderRole, body, sentAt }
 *   'chat:error'    — { message }
 */
export function registerChatSocket(io) {
  const chatNs = io.of('/chat');

  chatNs.on('connection', (socket) => {
    // ── chat:join ──────────────────────────────────────────────────────────
    socket.on('chat:join', async ({ bookingId, token } = {}) => {
      try {
        if (!token || !bookingId) {
          return socket.emit('chat:error', { message: 'bookingId and token are required' });
        }

        // 1. Verify JWT
        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch {
          return socket.emit('chat:error', { message: 'Invalid or expired token' });
        }

        const userId = decoded.id || decoded._id || decoded.userId;
        if (!userId) {
          return socket.emit('chat:error', { message: 'Token missing user id' });
        }

        const bookingIdStr = String(bookingId);

        // 2. Check booking access (status + participant)
        await assertChatAccess(bookingIdStr, userId);

        // 3. Determine role from the booking itself — don't trust JWT role
        //    because JWT may not carry it, or it may be stale
        const role = await getUserRoleInBooking(bookingIdStr, userId);
        if (!role) {
          return socket.emit('chat:error', { message: 'Could not determine your role in this booking' });
        }

        // 4. Store on socket for use in chat:message
        socket.userId    = String(userId);
        socket.userRole  = role;          // 'customer' | 'provider'
        socket.bookingId = bookingIdStr;

        // 5. Leave any previous room then join new one
        if (socket.currentRoom) {
          socket.leave(socket.currentRoom);
        }
        const room = `chat:${bookingIdStr}`;
        socket.join(room);
        socket.currentRoom = room;

        // 6. Confirm to the client
        socket.emit('chat:joined', { bookingId: bookingIdStr, role });

      } catch (err) {
        socket.emit('chat:error', { message: err.message });
      }
    });

    // ── chat:message ───────────────────────────────────────────────────────
    socket.on('chat:message', async ({ bookingId, body } = {}) => {
      try {
        // Guard: must have joined first
        if (!socket.userId || !socket.userRole || !socket.bookingId) {
          return socket.emit('chat:error', { message: 'Join a chat room first with chat:join' });
        }

        if (!body?.trim()) {
          return socket.emit('chat:error', { message: 'Message body cannot be empty' });
        }

        const bookingIdStr = String(bookingId);

        // Guard: bookingId must match joined room
        if (bookingIdStr !== socket.bookingId) {
          return socket.emit('chat:error', { message: 'bookingId does not match your joined room' });
        }

        // Save to DB
        const saved = await saveMessage({
          bookingId: bookingIdStr,
          senderId:   socket.userId,
          senderRole: socket.userRole,
          body:       body.trim(),
        });

        const payload = normalizeMessagePayload(saved);

        // Broadcast to ALL sockets in the room (including sender for confirmation)
        const room = `chat:${bookingIdStr}`;
        chatNs.to(room).emit('chat:message', payload);

      } catch (err) {
        socket.emit('chat:error', { message: err.message });
      }
    });
  });
}