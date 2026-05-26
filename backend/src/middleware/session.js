const { generateSessionId } = require('../utils/helpers');

const sessionMiddleware = (req, res, next) => {
  let sessionId = req.cookies.session_id;
  if (!sessionId) {
    sessionId = generateSessionId();
    res.cookie('session_id', sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });
  }
  req.sessionId = sessionId;
  next();
};

module.exports = sessionMiddleware;
