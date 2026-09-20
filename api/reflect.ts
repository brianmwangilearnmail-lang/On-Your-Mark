export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userResponse } = req.body || {};
  if (!userResponse || userResponse.trim().length === 0) {
    return res.status(400).json({ error: "User response is required." });
  }

  return res.status(200).json({
    feedback: "Your reflection has been recorded! Continuous meditation on these foundational truths will anchor your soul in God's grace."
  });
}
