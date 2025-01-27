import jwt from 'jsonwebtoken';
import { User } from '../model/User.js'; 
import { sanitizeUser } from '../services/common.js'; 

export const checkAuthentication = async (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]; 
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized, user not found' });
    }

    req.user = sanitizeUser(user);
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Ensure only one response is sent
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired, please log in again.' });
    }
    return res.status(401).json({ message: 'Unauthorized, invalid token', error: err.message });
  }
};
