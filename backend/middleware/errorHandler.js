// Centralized error handling middleware
function pickMessage(err) {
  if (!err) return 'Server error';
  if (typeof err === 'string') return err;
  if (typeof err.message === 'string' && err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return 'Server error';
  }
}

export const errorHandler = (err, req, res, next) => {
  const msg = pickMessage(err);
  console.error('💥 Error:', msg);
  if (err?.stack) console.error('📋 Stack:', err.stack);

  let statusCode = err?.statusCode || err?.status || 500;
  if (statusCode < 400 || statusCode > 599) statusCode = 500;

  let errorPayload = {
    message: msg,
    ...(typeof err?.type === 'string' && { type: err.type }),
    ...(typeof err?.code === 'string' && { code: err.code }),
    ...(err?.raw && typeof err.raw === 'object' && typeof err.raw.message === 'string'
      ? { detail: err.raw.message }
      : {}),
  };

  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorPayload = {
      message: err.message,
      details: Object.values(err.errors || {}).map((e) => e.message),
    };
  } else if (err.name === 'CastError') {
    statusCode = 400;
    errorPayload = { message: 'Invalid data format', details: err.message };
  } else if (err.code === 11000) {
    statusCode = 409;
    errorPayload = {
      message: 'Duplicate entry',
      details: 'This resource already exists',
    };
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorPayload = { message: 'Authentication failed', details: err.message };
  }

  res.status(statusCode).json({
    success: false,
    message: errorPayload.message || msg,
    error: errorPayload,
    timestamp: new Date().toISOString(),
  });
};
