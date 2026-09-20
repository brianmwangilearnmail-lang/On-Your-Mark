import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        feedback: "Great reflection! Your commitment to meditating on God's Word is building a firm foundation for your spiritual race."
      });
    }

    const { moduleTitle, question, userResponse } = req.body || {};
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
}
