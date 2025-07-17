// Import the jsonwebtoken library for verifying JWTs
import jwt from "jsonwebtoken";

// Middleware to protect routes by verifying JWT token
const verifyToken = (req, res, next) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  // If the header is missing or doesn't start with "Bearer ", reject the request
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Token verification failed (expired, tampered, or invalid)
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

// Export the middleware for use in protected routes
export default verifyToken;
