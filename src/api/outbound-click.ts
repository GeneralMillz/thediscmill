import fs from 'fs';
import path from 'path';

/**
 * POST /api/outbound-click
 * Records an outbound manufacturer click event.
 * 
 * NOTE: This is intended for a Node.js serverless environment (e.g., Vercel Functions).
 * In a pure static build, this requires a backend to handle the file write.
 */

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event = req.body;
    if (!event || !event.url) {
      return res.status(400).json({ error: 'Invalid event data. URL is required.' });
    }

    // Ensure atomic-ish write by reading and rewriting the array
    // Note: In highly concurrent environments, a database or a lock-file is needed.
    const DATA_PATH = path.join(process.cwd(), 'public/data/outbound-clicks.json');
    
    // Ensure directory exists
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let clicks = [];
    if (fs.existsSync(DATA_PATH)) {
      const content = fs.readFileSync(DATA_PATH, 'utf-8');
      try {
        clicks = JSON.parse(content || '[]');
      } catch (e) {
        clicks = [];
      }
    }

    // Append new event
    clicks.push({
      ...event,
      timestamp: event.timestamp || Date.now()
    });

    // Write back
    fs.writeFileSync(DATA_PATH, JSON.stringify(clicks, null, 2));

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[API] Outbound click error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
