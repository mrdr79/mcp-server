import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/zing", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.json({ status: "error", message: "missing q" });

  try {
    const api = `https://api-zingmp3.vercel.app/api/search?q=${encodeURIComponent(q)}`;
    const r = await axios.get(api);

    const song = r.data?.data?.songs?.[0];
    if (!song) return res.json({ status: "not_found" });

    const linkApi = `https://api-zingmp3.vercel.app/api/song?id=${song.encodeId}`;
    const linkRes = await axios.get(linkApi);

    return res.json({
      status: "ok",
      title: song.title,
      url: linkRes.data.data["128"]
    });

  } catch (e) {
    return res.json({ status: "error" });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
