import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    const token = req.cookies.jwt; // Assuming you are storing the token in a cookie
  
    if (!token) {
      return res.sendStatus(403); // Forbidden
    }
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.json(err)
      }
      req.user = user; // Store user data for use in the next middleware
      next();
    });
  };
  