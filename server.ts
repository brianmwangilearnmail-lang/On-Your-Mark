import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Optional AI Reflection Encouragement Endpoint
  app.post('/api/reflect', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(200).json({
          feedback: "Great reflection! Your commitment to meditating on God's Word is building a firm foundation for your spiritual race."
        });
      }

      const { moduleTitle, question, userResponse } = req.body;
      if (!userResponse || userResponse.trim().length === 0) {
        return res.status(400).json({ error: "User response is required." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a warm, encouraging spiritual mentor and study assistant for the book "ON YOUR MARK" by Benjamin Kasankya.
The reader just answered a reflection question for the lesson "${moduleTitle}".
Question: "${question}"
Reader's Reflection: "${userResponse}"

Provide a brief, 2-3 sentence encouraging, uplifting response that affirms their spiritual insight, highlights a biblical principle, and motivates them in their walk with Christ. Keep it warm, gracious, and scripture-affirming.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const feedback = response.text || "Wonderful reflection! Keep pressing forward on your spiritual journey.";
      return res.json({ feedback });
    } catch (err: any) {
      console.error("Gemini reflection feedback error:", err);
      return res.status(200).json({
        feedback: "Your reflection has been recorded! Continuous meditation on these truths will anchor your soul in God's grace."
      });
    }
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
