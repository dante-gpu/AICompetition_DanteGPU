import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS ayarları
app.use(cors());
app.use(express.json());

// Ollama API URL
const OLLAMA_API_URL = "http://localhost:11434/api/generate";

// Ollama sağlık kontrolü
async function checkOllamaHealth(): Promise<boolean> {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "mistral",
        prompt: "test",
        stream: false
      })
    });
    return response.ok;
  } catch (error) {
    console.error('Ollama health check failed:', error);
    return false;
  }
}

// Health check endpoint
app.get('/api/health', async (_, res) => {
  const ollamaHealthy = await checkOllamaHealth();
  
  if (!ollamaHealthy) {
    return res.status(503).json({ 
      status: 'error',
      message: 'Ollama service is not available'
    });
  }
  
  res.json({ status: 'ok' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Ollama sağlık kontrolü
    const ollamaHealthy = await checkOllamaHealth();
    if (!ollamaHealthy) {
      return res.status(503).json({ 
        error: 'AI service is currently unavailable',
        details: 'Please try again later'
      });
    }

    console.log('Sending to Ollama:', message);

    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "mistral",
        prompt: message,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error:', errorText);
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Ollama response:', data);

    if (!data.response) {
      throw new Error('Invalid response from Ollama');
    }

    res.json({
      response: data.response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      details: errorMessage
    });
  }
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    details: err.message
  });
});

// Server başlatma
const startServer = async () => {
  // İlk Ollama sağlık kontrolü
  const ollamaHealthy = await checkOllamaHealth();
  if (!ollamaHealthy) {
    console.error('Warning: Ollama service is not available');
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Ollama status: ${ollamaHealthy ? 'Available' : 'Not available'}`);
  });
};

startServer(); 