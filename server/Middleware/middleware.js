const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");
  
  // Check if the Authorization header starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  // Extract token from the Authorization header
  const token = authHeader.split(" ")[1]; // "Authorization" : "Bearer sdgfjsdfhkjxguy3t1746873624"

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify the token using your secret
    const decoded = jwt.verify(token, "secret"); // Use process.env.JWT_SECRET in production
    req.token = decoded; // Attach the decoded payload (user info) to req.token
    req.userId = decoded._id; 
    next(); // Call the next middleware or route handler
  } catch (error) {
    // If the token is invalid
    res.status(403).json({ message: "Invalid token." });
  }
}

module.exports = verifyToken;
