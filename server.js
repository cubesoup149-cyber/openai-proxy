import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_KEY = process.env.OPENAI_API_KEY;

app.post("/chat", async (req, res) => {
    try {
        const prompt = req.body.prompt;
        if (!prompt) {
            return res.json({ reply: "No prompt received." });
        }

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4.1-mini",
                messages: [
                    { role: "system", content: "You generate Roblox Lua scripts." },
                    { role: "user", content: prompt }
                ]
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_KEY}`
                }
            }
        );

        const reply = response.data.choices[0].message.content;

        res.json({ reply });
    } catch (err) {
        console.error(err);
        res.json({ reply: "Error contacting OpenAI." });
    }
});

app.listen(process.env.PORT || 3000, () =>
    console.log(`OpenAI Proxy running on port ${process.env.PORT || 3000}`)
);
