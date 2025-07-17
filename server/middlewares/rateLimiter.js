// Import the express-rate-limit middleware
import rateLimit from "express-rate-limit";

// Define a rate limiter configuration
const limiter = rateLimit({
  // Time window: 15 minutes
  windowMs: 15 * 60 * 1000,

  // Maximum number of requests allowed per IP within the window
  max: 10,

  // Custom message sent when the limit is exceeded
  message: "Too many requests from this IP, please try again later.",
});

export default limiter;
