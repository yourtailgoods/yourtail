import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const ext = (url.searchParams.get('ext') || 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 4) || 'jpg';
    const name = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext;

    const blob = await put(`uploads/${name}`, req, { access: 'public', contentType: req.headers['content-type'] || 'application/octet-stream' });

    res.json({ url: blob.url });
  } catch (e) {
    res.status(500).end(String(e));
  }
}
