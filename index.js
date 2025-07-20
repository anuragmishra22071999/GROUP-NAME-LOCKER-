const login = require("ws3-fca");
const fs = require("fs");
const express = require("express");

// Load appstate safely
let appState;
try {
  appState = JSON.parse(fs.readFileSync("appstate.json", "utf-8"));
} catch (err) {
  console.error("❌ Failed to read appstate.json:", err);
  process.exit(1);
}

// Group configuration
const GROUP_THREAD_ID = "24041654888825173";
const LOCKED_GROUP_NAME = "CHINTU RAJ KE PAPA ANU HERE:)";

// Facebook login
login({ appState }, (err, api) => {
  if (err) {
    console.error("❌ Login Failed:", err);
    return;
  }

  console.log("✅ Bot Started: Group Name Locker Active!");

  // Locker function
  const lockGroupName = () => {
    api.getThreadInfo(GROUP_THREAD_ID, (err, info) => {
      if (err) {
        console.error("❌ Failed to get group info:", err);
        return;
      }

      if (info.name !== LOCKED_GROUP_NAME) {
        console.warn(`⚠️ Group name changed to "${info.name}". Reverting...`);

        api.setTitle(LOCKED_GROUP_NAME, GROUP_THREAD_ID, (err) => {
          if (err) {
            console.error("❌ Failed to reset group name:", err);
          } else {
            console.log("🔒 Group name reset successfully.");
          }
        });
      } else {
        console.log("✅ Group name is correct.");
      }
    });

    // Schedule next check after 30 seconds
    setTimeout(lockGroupName, 30 * 1000);
  };

  // Start the locker
  lockGroupName();
});

// Dummy Express server (Render Uptime)
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🤖 GC Name Locker Bot is running!");
});

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`);
});
