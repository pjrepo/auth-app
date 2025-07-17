import cron from "node-cron";
import User from "../models/User.js";

// Runs every 3 hours at minute 0
cron.schedule("0 */3 * * *", async () => {
  try {
    await User.updateMany(
      { loginAttempts: { $gte: 1 } },
      { $set: { loginAttempts: 0, lastLoginAttempt: null } }
    );
    console.log("Reset login attempts for users");
  } catch (err) {
    console.error("Error in cron job:", err);
  }
});
