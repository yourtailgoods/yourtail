import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  const { key } = req.query;
  if (!key || !/^[a-zA-Z0-9_-]+$/.test(key)) {
    res.status(400).end('bad key');
    return;
  }

  const blobPath = `data/state-${key}.json`;

  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: blobPath, limit: 1 });
      if (!blobs.length) { res.status(404).json(null); return; }
      const r = await fetch(blobs[0].url);
      const data = await r.json();
      res.json(data);
    } catch {
      res.status(404).json(null);
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = JSON.stringify(req.body);
      await put(blobPath, body, { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
      res.status(204).end();
    } catch {
      res.status(400).end('invalid json');
    }
    return;
  }

  res.status(405).end();
}
