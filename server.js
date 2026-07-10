
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// 1. Enable Cross-Origin Resource Sharing (Allows your GitHub Pages site to talk to Render)
app.use(cors());

// 2. Enable JSON parsing parsing middleware to read incoming req.body payloads
app.use(express.json());

// 3. Base route just to check if the server is healthy in the browser
app.get('/', (req, res) => {
    res.json({ status: "healthy", message: "Fikury-backend processing engine is running cleanly." });
});

// 4. The main chat endpoint that your frontend is trying to call!
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Validation guard rail if message string is entirely empty
        if (!message) {
            return res.status(400).json({ error: "Message field input text parameter is missing." });
        }

        console.log(`Received user message payload: "${message}"`);

        // --- TODO: PLACE YOUR AI INTEGRATION CODES (OpenAI / DeepSeek) HERE ---
        // For now, we return a smart placeholder to verify the pipes work smoothly!
        const automatedReply = `🚀 Server received your prompt: "${message}". Your Fikury-backend cloud router environment is completely configured!`;

        // Send response payload back cleanly
        return res.status(200).json({
            reply: automatedReply
        });

    } catch (error) {
        console.error("Internal processing fault inside chat pipeline:", error);
        return res.status(500).json({ error: "Internal core engine operational route runtime crash execution failure." });
    }
});

// Bind listener port
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Fikury Core Application Node Live Matrix Running on Port: ${PORT}`);
    console.log(`=============================================`);
});
