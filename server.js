const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

// 1. Enable Cross-Origin Resource Sharing (Allows frontend clients to reach Render backend)
app.use(cors());

// 2. Enable JSON body parsing middleware
app.use(express.json());

// 3. Base health check route
app.get('/', (req, res) => {
    res.json({ status: "healthy", message: "Fikury-backend processing engine is running cleanly." });
});

// 4. Main AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    try {
        // Accepts either 'message' (from UI) or 'prompt' (from ReqBin/Postman)
        const userPrompt = req.body.message || req.body.prompt;

        // Validation guard rail
        if (!userPrompt) {
            return res.status(400).json({ error: "Message or prompt field parameter is missing." });
        }

        console.log(`Received user payload: "${userPrompt}"`);

        // Get Free Groq API Key from environment variables
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            console.error("GROQ_API_KEY environment variable is not configured.");
            return res.status(500).json({ error: "AI API key missing on backend server." });
        }

        // --- FREE GROQ API INTEGRATION (Llama 3.3 70B) ---
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { 
                        role: 'system', 
                        content: 'You are Fikury-SEEK, a highly intelligent, fast, and helpful AI assistant.' 
                    },
                    { 
                        role: 'user', 
                        content: userPrompt 
                    }
                ]
            })
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            console.error("Groq API Error Details:", errorDetails);
            return res.status(502).json({ error: "Error communicating with Groq AI service." });
        }

        const data = await response.json();
        const automatedReply = data.choices?.[0]?.message?.content || "No response returned from AI model.";

        // Send response payload back cleanly
        return res.status(200).json({
            reply: automatedReply
        });

    } catch (error) {
        console.error("Internal processing fault inside chat pipeline:", error);
        return res.status(500).json({ error: "Internal core engine operational route failure." });
    }
});

// Bind listener port
app.listen(PORT, () => {
    console.log(`=============================================`);
    console.log(`🚀 Fikury Core Application Node Live Matrix Running on Port: ${PORT}`);
    console.log(`=============================================`);
});

