import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Tìm bài hát bằng cách đọc JSON nhúng trong HTML
async function searchZing(keyword) {
  const url = `https://zingmp3.vn/tim-kiem/tat-ca?q=${encodeURIComponent(keyword)}`;
  const html = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0" }
  }).then(r => r.data);

  // Lấy JSON từ script trong trang
  const jsonMatch = html.match(/"data":(\{.*?\}),"status"/s);
  if (!jsonMatch) return null;

  const data = JSON.parse(jsonMatch[1]);

  const song = data?.items?.find(i => i.link?.includes("/bai-hat/"));
  if (!song) return null;

  return {
    title: song.name,
    link: "https://zingmp3.vn" + song.link
  };
}

// Lấy link MP3 thật
async function getMp3(songUrl) {
  const html = await axios.get(songUrl, {
    headers: { "User-Agent": "Mozilla/5.0" }
  }).then(r => r.data);

  const match = html.match(/"128":"(https:[^"]+)"/);
  if (!match) return null;

  return match[1].replace(/\\u002F/g, "/");
}

app.get("/zing", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ status: "error" });

  try {
    const song = await searchZing(q);
    if (!song) return res.json({ status: "not_found" });

    const mp3 = await getMp3(song.link);
    if (!mp3) return res.json({ status: "no_audio" });

    res.json({
      status: "ok",
      title: song.title,
      url: mp3
    });
  } catch {
    res.json({ status: "error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Zing MCP server ready");
});
