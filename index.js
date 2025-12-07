import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/zing", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ status: "error" });

  try {
    // API Zing công khai, ổn định hơn
    const searchUrl = `https://api-zingmp3.vercel.app/api/search/song?q=${encodeURIComponent(q)}`;
    const search = await axios.get(searchUrl);

    const song = search.data?.data?.[0];
    if (!song) return res.json({ status: "not_found" });

    const id = song.encodeId;

    const detail = await axios.get(`https://api-zingmp3.vercel.app/api/song?id=${id}`);
    const mp3 = detail.data?.data?.["128"];

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
  console.log("MCP Zing Server Ready");
});
