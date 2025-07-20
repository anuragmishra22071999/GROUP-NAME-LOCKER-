const login = require("ws3-fca");
const fs = require("fs");
const express = require("express");

const appState = JSON.parse(fs.readFileSync("appstate.json", "utf-8"));

// Your group info
const GROUP_THREAD_ID = "24041654888825173";
const LOCKED_GROUP_NAME = "CHINTU RAJ KE PAPA ANU HERE:)";

// Login to Facebook
login({ appState }, (err, api) => {
  if (err) return console.error("❌ Login Failed:", err);
  console.log("✅ Bot Started: Group Name Locker Active!");

  // Function to check and lock group name
  const checkAndLockGroupName = () => {
    api.getThreadInfo(GROUP_THREAD_ID, (err, info) => {
      if (err) return console.error("❌ Error getting thread info:", err);

      if (info.name !== LOCKED_GROUP_NAME) {
        console.log(`⚠️ Group name changed to "${info.name}", resetting...`);
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

      // Schedule next check with random interval (55s to 70s)
      const delay = Math.floor(Math.random() * 15000) + 55000;
      setTimeout(checkAndLockGroupName, delay);
    });
  };

  // Initial check
  checkAndLockGroupName();
});

// Dummy Express server to keep Render alive
const server = express();
const PORT = process.env.PORT || 3000;
server.get("/", (req, res) => res.send("🤖 GC Locker Bot is running!"));
server.listen(PORT, () => console.log(`🌐 Web server started on port ${PORT}`));
