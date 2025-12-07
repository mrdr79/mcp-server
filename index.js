import express from "express";
import axios from "axios";
import ytdl from "ytdl-core";

const app = express();

app.get("/play", async (req, res) => {
  const q = req.query.song;
  if (!q) return res.json({ status: "error" });

  try {
    const searchUrl = "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
    const html = await axios.get(searchUrl).then(r => r.data);

    const videoIdMatch = html.match(/watch\\?v=([^"&]+)/);
    if (!videoIdMatch) return res.json({ status: "not_found" });

    const videoId = videoIdMatch[1];
    const videoUrl = "https://www.youtube.com/watch?v=" + videoId;

    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });

    res.json({
      status: "ok",
      title: info.videoDetails.title,
      url: format.url
    });

  } catch (e) {
    res.json({ status: "error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("YT server ready");
});
