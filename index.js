import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

// Trang check server
app.get("/", (req, res) => {
  res.send("MCP Music Server is running");
});

// API phát nhạc
app.get("/play", (req, res) => {
  const keyword = req.query.keyword;

  // Trả về link mp3 mẫu (bạn có thể thay bằng link Zing sau)
  res.json({
    title: "Sample Music",
    url: "https://filesamples.com/samples/audio/mp3/sample3.mp3"
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
