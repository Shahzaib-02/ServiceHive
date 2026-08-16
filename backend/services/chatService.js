// import Message from '../models/Message.js';
// import Booking from '../models/Booking.js';

// /**
//  * Verify that userId is either the customer or provider of the booking
//  * and that the booking is in an approved/active state that allows chat.
//  */
// export async function assertChatAccess(bookingId, userId) {
//   const booking = await Booking.findById(bookingId);
//   if (!booking) throw new Error('Booking not found');

//   const customerId  = booking.customerId?.toString()  || booking.userId?.toString();
//   const providerId  = booking.providerId?.toString();
//   const userIdStr   = userId.toString();

//   const isParticipant = customerId === userIdStr || providerId === userIdStr;
//   if (!isParticipant) throw new Error('Access denied: not a participant of this booking');

//   // Chat is only allowed once the provider has accepted/approved the booking
//   const chatAllowedStatuses = ['accepted', 'approved', 'in_progress', 'completed'];
//   if (!chatAllowedStatuses.includes(booking.status)) {
//     throw new Error(`Chat is not available for bookings with status "${booking.status}"`);
//   }

//   return booking;
// }

// /**
//  * Persist a new message and return the saved document.
//  */
// export async function saveMessage({ bookingId, senderId, senderRole, body }) {
//   const message = new Message({ bookingId, senderId, senderRole, body });
//   await message.save();
//   return message;
// }

// /**
//  * Fetch the last N messages for a booking (oldest first for display).
//  */
// export async function getMessages(bookingId, limit = 50) {
//   return Message.find({ bookingId })
//     .sort({ createdAt: -1 })
//     .limit(limit)
//     .lean()
//     .then((msgs) => msgs.reverse()); // return oldest → newest
// }

// /**
//  * Mark all messages in a booking as read for a given recipient.
//  */
// export async function markMessagesRead(bookingId, recipientId) {
//   await Message.updateMany(
//     { bookingId, senderId: { $ne: recipientId }, isRead: false },
//     { isRead: true }
//   );
// }



import Message from '../models/Message.js';
import Booking from '../models/Booking.js';

/**
 * Verify that userId is either the customer or provider of the booking
 * and that the booking status allows chat.
 */
export async function assertChatAccess(bookingId, userId) {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');

  const customerId = booking.customerId?.toString();
  const providerId = booking.providerId?.toString();
  const userIdStr  = userId.toString();

  const isParticipant = customerId === userIdStr || providerId === userIdStr;
  if (!isParticipant) throw new Error('Access denied: not a participant of this booking');

  // Match exact enum values from Booking model
  const chatAllowedStatuses = ['accepted', 'in_progress', 'completed'];
  if (!chatAllowedStatuses.includes(booking.status)) {
    throw new Error(`Chat is not available for bookings with status "${booking.status}"`);
  }

  return booking;
}

/**
 * Determine a user's role in a booking (customer or provider).
 * Used when JWT doesn't carry role info reliably.
 */
export async function getUserRoleInBooking(bookingId, userId) {
  const booking = await Booking.findById(bookingId).select('customerId providerId');
  if (!booking) return null;
  if (booking.customerId?.toString() === userId.toString()) return 'customer';
  if (booking.providerId?.toString() === userId.toString()) return 'provider';
  return null;
}

/**
 * Persist a new message and return the saved document.
 */
export async function saveMessage({ bookingId, senderId, senderRole, body }) {
  const message = new Message({ bookingId, senderId, senderRole, body });
  await message.save();
  return message;
}

/**
 * Fetch the last N messages for a booking (oldest first for display).
 */
export async function getMessages(bookingId, limit = 50) {
  return Message.find({ bookingId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean()
    .then((msgs) => msgs.reverse());
}

/**
 * Mark all messages in a booking as read for a given recipient.
 */
export async function markMessagesRead(bookingId, recipientId) {
  await Message.updateMany(
    { bookingId, senderId: { $ne: recipientId }, isRead: false },
    { isRead: true }
  );
}