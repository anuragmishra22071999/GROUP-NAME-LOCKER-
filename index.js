const login = require("ws3-fca");
const fs = require("fs");

// Appstate load karo
let appState;
try {
  appState = JSON.parse(fs.readFileSync("appstate.json", "utf-8"));
} catch (err) {
  console.error("❌ Appstate.json load karne mein error:", err);
  process.exit(1); // Agar appstate nahi mila toh exit
}

const GROUP_THREAD_ID = "24041654888825173"; // Double-check yeh ID
const LOCKED_GROUP_NAME = "CHINTU RAJ KE PAPA ANU HERE:)";

let api = null;

function attemptLogin(attempt = 1) {
  login({ appState }, (err, apiInstance) => {
    if (err) {
      console.error(`❌ Login Failed (Attempt ${attempt}):`, err);
      if (attempt < 3) { // Maximum 3 retries
        console.log(`🔄 Retry ${attempt + 1} mein 5 sec baad...`);
        setTimeout(() => attemptLogin(attempt + 1), 5000);
      } else {
        console.error("❌ Max retries crossed, stopping...");
        process.exit(1);
      }
      return;
    }
    api = apiInstance;
    console.log("✅ Bot Started: Group Name Locker Active!");
    startGroupNameCheck();
  });
}

// Group name check aur reset logic
function startGroupNameCheck() {
  setInterval(() => {
    if (!api) return console.log("⚠️ API nahi mili, retrying login...");
    api.getThreadInfo(GROUP_THREAD_ID, (err, info) => {
      if (err) {
        console.error("❌ Error getting thread info:", err);
        return; // Retry hoga interval ke saath
      }

      if (info.name !== LOCKED_GROUP_NAME) {
        console.log(`⚠️ Group name changed to "${info.name}", resetting...`);
        api.setTitle(LOCKED_GROUP_NAME, GROUP_THREAD_ID, (err) => {
          if (err) {
            console.error("❌ Failed to reset name:", err);
          } else {
            console.log("🔒 Group name reset successfully.");
          }
        });
      } else {
        console.log("✅ Group name is correct.");
      }
    });
  }, 300000); // 5 minutes interval, rate limit avoid karne ke liye
}

// Express server for Render uptime
const express = require("express");
const server = express();

const PORT = process.env.PORT || 3000;
server.get("/", (req, res) => res.send("Bot is running!"));

server.listen(PORT, () => {
  console.log(`🌐 Web server started on port ${PORT}`);
}).on("error", (err) => {
  console.error("❌ Server error:", err);
});

// Start the bot
attemptLogin();
