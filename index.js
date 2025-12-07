import express from "express";
import ytdl from "ytdl-core";

const app = express();

// GET /play?song=...
app.get("/play", async (req, res) => {
  const q = req.query.song;
  if (!q) return res.json({ status: "error" });

  try {
    const search = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`).then(r => r.text());
    const videoIdMatch = search.match(/watch\?v=([^"&]+)/);

    if (!videoIdMatch) return res.json({ status: "not_found" });

    const videoId = videoIdMatch[1];
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });

    res.json({
      status: "ok",
      title: info.videoDetails.title,
      url: format.url
    });
  } catch {
    res.json({ status: "error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("YT MCP Server Ready");
});
