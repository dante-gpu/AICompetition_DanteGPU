const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8000;

// CORS ayarları
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Basit bir echo response
    const response = {
      response: `Echo: ${message}`,
      timestamp: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Session endpoints
app.post('/chat/session', (req, res) => {
  const sessionId = Math.random().toString(36).substring(7);
  res.json({ sessionId });
});

app.get('/chat/session/:sessionId', (req, res) => {
  res.json({ messages: [] });
});

app.get('/chat/history', (req, res) => {
  res.json({ messages: [] });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});