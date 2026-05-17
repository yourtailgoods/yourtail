import { Resend } from 'resend';
import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }

  const { email } = req.body || {};
  if (!email) { res.status(400).json({ error: 'no email' }); return; }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { res.status(500).json({ error: 'RESEND_API_KEY not set' }); return; }

  const resend = new Resend(apiKey);
  const tempPw = Math.random().toString(36).slice(2, 10);

  try {
    await resend.emails.send({
      from: 'yourtail <onboarding@resend.dev>',
      to: email,
      subject: '[yourtail] 임시 비밀번호 안내',
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="color:#FFC94B">yourtail</h2>
        <p>안녕하세요, 비밀번호 재설정을 요청하셨습니다.</p>
        <p>임시 비밀번호: <strong style="font-size:18px;color:#E6A800">${tempPw}</strong></p>
        <p>로그인 후 마이페이지에서 비밀번호를 변경해주세요.</p>
        <hr style="border:none;border-top:1px solid #EEE;margin:20px 0"/>
        <p style="font-size:12px;color:#999">본 메일은 yourtail에서 자동 발송되었습니다.</p>
      </div>`,
    });

    try {
      const { blobs } = await list({ prefix: 'data/state-users.json', limit: 1 });
      if (blobs.length) {
        const r = await fetch(blobs[0].url);
        const data = await r.json();
        const idx = data.findIndex(u => u.email === email);
        if (idx >= 0) {
          data[idx].password = tempPw;
          await put('data/state-users.json', JSON.stringify(data), { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
        }
      }
    } catch {}

    res.json({ ok: true, tempPw });
  } catch (e) {
    res.status(500).json({ error: e.message || 'send failed' });
  }
}
