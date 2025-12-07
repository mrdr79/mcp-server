import express from "express";
import axios from "axios";
import cors from "cors";
import cheerio from "cheerio";

const app = express();
app.use(cors());
app.use(express.json());

async function searchZing(keyword) {
  const searchUrl = `https://zingmp3.vn/tim-kiem/bai-hat?q=${encodeURIComponent(keyword)}`;
  const html = await axios.get(searchUrl, {
    headers: { "User-Agent": "Mozilla/5.0" }
  }).then(r => r.data);

  const $ = cheerio.load(html);

  let result = null;

  $("a[href*='/bai-hat/']").each((i, el) => {
    if (result) return;

    const title = $(el).text().trim();
    const link = $(el).attr("href");

    if (title && link) {
      result = {
        title,
        link: "https://zingmp3.vn" + link
      };
    }
  });

  return result;
}

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

  } catch (e) {
    res.json({ status: "error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Zing MCP Server Ready");
});
