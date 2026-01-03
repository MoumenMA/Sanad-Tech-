const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json());



app.get("/display", (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 50;
  const letter = (req.query.letter || "").toUpperCase();

  const start = (page - 1) * limit;
  const end = start + limit;

  const filepath = path.join(__dirname, "public/usernames.txt");

  const stream = fs.createReadStream(filepath, { encoding: "utf8" });

  let buffer = "";
  let users = [];
  let matchedCount = 0;

  stream.on("data", chunk => {
    buffer += chunk;
    const lines = buffer.split("\n");
    buffer = lines.pop();

    for (const line of lines) {
      const username = line.trim();
      if (!username) continue;

      // Alphabet filter
      if (letter && !username.startsWith(letter)) continue;

      if (matchedCount >= start && matchedCount < end) {
        users.push(username);
      }

      matchedCount++;

      // Stop early when page is filled
      if (matchedCount >= end) {
        stream.destroy();
        break;
      }
    }
  });

  stream.on("close", () => {
    res.json({
      page,
      limit,
      letter,
      data: users
    });
  });

  stream.on("error", () => {
    res.status(500).json({ error: "File streaming failed" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
