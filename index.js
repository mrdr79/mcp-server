import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// API: tìm bài hát từ Zing
app.get("/zing", async (req, res) => {
    const q = req.query.q;
    if (!q) {
        return res.json({ status: "error", message: "missing q" });
    }

    try {
        const api = `https://api-zingmp3.vercel.app/api/search?q=${encodeURIComponent(q)}`;
        const r = await axios.get(api);

        if (!r.data.data || !r.data.data.songs || r.data.data.songs.length === 0) {
            return res.json({ status: "not_found" });
        }

        const song = r.data.data.songs[0];
        const linkApi = `https://api-zingmp3.vercel.app/api/song?id=${song.encodeId}`;
        const linkRes = await axios.get(linkApi);

        return res.json({
            status: "ok",
            title: song.title,
            artists: song.artistsNames,
            url: linkRes.data.data["128"]
        });

    } catch (e) {
        return res.json({ status: "error", error: e.toString() });
    }
});

app.listen(3000, () => console.log("server running on port 3000"));
