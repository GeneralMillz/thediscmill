import fs from 'fs';
import path from 'path';

/**
 * POST /api/contact-partner
 * Records a partner lead/contact submission.
 */

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const lead = req.body;
    if (!lead || !lead.email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const DATA_PATH = path.join(process.cwd(), 'public/data/partner-leads.json');
    
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let leads = [];
    if (fs.existsSync(DATA_PATH)) {
      const content = fs.readFileSync(DATA_PATH, 'utf-8');
      try {
        leads = JSON.parse(content || '[]');
      } catch (e) {
        leads = [];
      }
    }

    leads.push({
      ...lead,
      timestamp: Date.now()
    });

    fs.writeFileSync(DATA_PATH, JSON.stringify(leads, null, 2));

    // Here you would also trigger an email (e.g. via SendGrid/Postmark)
    // console.log('New partner lead:', lead);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[API] Contact partner error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
