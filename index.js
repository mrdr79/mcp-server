import express from "express";
const app = express();

app.get("/", (req, res) => {
    res.send("MCP server is running!");
});

// API phát nhạc
app.get("/play", (req, res) => {
    res.json({
        url: "https://your-music-url-here.mp3"
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
