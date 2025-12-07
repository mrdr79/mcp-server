import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Tìm bài hát trực tiếp từ Zing
async function searchZing(keyword) {
  const url = `https://zingmp3.vn/tim-kiem/tat-ca?q=${encodeURIComponent(keyword)}`;
  const res = await axios.get(url);
  const html = res.data;

  const match = html.match(/"name":"([^"]+)","link":"([^"]+)"/);
  if (!match) return null;

  return {
    title: match[1],
    link: "https://zingmp3.vn" + match[2]
  };
}

// Lấy MP3 link từ trang bài hát
async function getMp3(link) {
  const html = await axios.get(link).then(r => r.data);

  const match = html.match(/"source":({[^}]+})/);
  if (!match) return null;

  const json = JSON.parse(match[1].replace(/\\\//g, "/"));
  return json["128"] || json["320"] || null;
}

app.get("/zing", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ status: "error" });

  const song = await searchZing(q);
  if (!song) return res.json({ status: "not_found" });

  const mp3 = await getMp3(song.link);
  if (!mp3) return res.json({ status: "no_audio" });

  res.json({
    status: "ok",
    title: song.title,
    url: mp3
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Zing Server Ready");
});
// redeploy
