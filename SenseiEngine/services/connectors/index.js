const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// The URL of the Python engine service.
// 'engine' is the name we gave it in docker-compose.yml
const ENGINE_URL = 'http://engine:8000/v1/generate-term';

// This is the endpoint your Discord bot will call
app.post('/v1/generate-term', async (req, res) => {
    console.log('Connector received a task:', req.body);
    try {
        // Forward the exact same request body to the Python engine
        const response = await axios.post(ENGINE_URL, req.body);
        
        // Send the engine's response back to the bot
        res.json(response.data);
    } catch (error) {
        console.error('Error connecting to the engine:', error.message);
        // Pass the error from the engine back to the bot
        const status = error.response?.status || 500;
        const detail = error.response?.data?.detail || 'Failed to connect to the engine.';
        res.status(status).json({ detail });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Connector service listening on port ${PORT}`);
});
