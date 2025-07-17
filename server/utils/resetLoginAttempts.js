// Import node-cron to schedule tasks
import cron from "node-cron";

// Import the User model to perform database updates
import User from "../models/User.js";

//┌───────────── minute (0 - 59)
//│ ┌───────────── hour (0 - 23)
//│ │ ┌───────────── day of the month (1 - 31)
//│ │ │ ┌───────────── month (1 - 12)
//│ │ │ │ ┌───────────── day of the week (0 - 6) (Sunday = 0)
//│ │ │ │ │
//│ │ │ │ │
//0 */3 * * *

// Schedule a job to run every 3 hours (at minute 0)
cron.schedule("0 */3 * * *", async () => {
  try {
    // Reset loginAttempts and lastLoginAttempt for users with failed attempts
    await User.updateMany(
      { loginAttempts: { $gte: 1 } }, // Target users with at least 1 failed attempt
      { $set: { loginAttempts: 0, lastLoginAttempt: null } }
    );
    console.log("Reset login attempts for users");
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});
