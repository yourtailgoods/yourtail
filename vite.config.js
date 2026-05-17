import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { Resend } from 'resend'
import dotenv from 'dotenv'
dotenv.config()

const MIME = { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif', webp:'image/webp' }

function prodsApi() {
  const file = path.resolve('./data/prods.json')
  const uploadsDir = path.resolve('./data/uploads')
  return {
    name: 'prods-api',
    configureServer(server) {
      server.middlewares.use('/api/prods', async (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const data = await fs.promises.readFile(file, 'utf8')
            res.setHeader('content-type', 'application/json')
            res.end(data)
          } catch {
            res.statusCode = 404
            res.end('null')
          }
          return
        }
        if (req.method === 'POST') {
          const chunks = []
          for await (const c of req) chunks.push(c)
          const body = Buffer.concat(chunks).toString('utf8')
          try {
            JSON.parse(body)
            await fs.promises.mkdir(path.dirname(file), { recursive: true })
            await fs.promises.writeFile(file, body)
            res.statusCode = 204
            res.end()
          } catch {
            res.statusCode = 400
            res.end('invalid json')
          }
          return
        }
        next()
      })

      server.middlewares.use('/api/state/', async (req, res, next) => {
        const key = path.basename(req.url.split('?')[0]).replace(/[^a-zA-Z0-9_-]/g, '')
        if (!key) { res.statusCode = 400; res.end('bad key'); return }
        const stateFile = path.resolve('./data/state-' + key + '.json')
        if (req.method === 'GET') {
          try {
            const data = await fs.promises.readFile(stateFile, 'utf8')
            res.setHeader('content-type', 'application/json')
            res.end(data)
          } catch {
            res.statusCode = 404
            res.end('null')
          }
          return
        }
        if (req.method === 'POST') {
          const chunks = []
          for await (const c of req) chunks.push(c)
          const body = Buffer.concat(chunks).toString('utf8')
          try {
            JSON.parse(body)
            await fs.promises.mkdir(path.dirname(stateFile), { recursive: true })
            await fs.promises.writeFile(stateFile, body)
            res.statusCode = 204
            res.end()
          } catch {
            res.statusCode = 400
            res.end('invalid json')
          }
          return
        }
        next()
      })

      server.middlewares.use('/api/upload', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        try {
          const url = new URL(req.url, 'http://x')
          const ext = (url.searchParams.get('ext') || 'jpg').replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 4) || 'jpg'
          const name = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8) + '.' + ext
          await fs.promises.mkdir(uploadsDir, { recursive: true })
          const filePath = path.join(uploadsDir, name)
          const out = fs.createWriteStream(filePath)
          await new Promise((resolve, reject) => {
            req.pipe(out)
            out.on('finish', resolve)
            out.on('error', reject)
            req.on('error', reject)
          })
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ url: '/api/uploads/' + name }))
        } catch (e) {
          res.statusCode = 500
          res.end(String(e))
        }
      })

      server.middlewares.use('/api/uploads/', async (req, res, next) => {
        if (req.method !== 'GET') return next()
        const name = path.basename(req.url.split('?')[0])
        const filePath = path.join(uploadsDir, name)
        try {
          const stat = await fs.promises.stat(filePath)
          const ext = path.extname(name).slice(1).toLowerCase()
          res.setHeader('content-type', MIME[ext] || 'application/octet-stream')
          res.setHeader('content-length', stat.size)
          res.setHeader('cache-control', 'public, max-age=31536000, immutable')
          fs.createReadStream(filePath).pipe(res)
        } catch {
          res.statusCode = 404
          res.end()
        }
      })

      server.middlewares.use('/api/send-reset-email', async (req, res, next) => {
        if (req.method !== 'POST') return next()
        const chunks = []
        for await (const c of req) chunks.push(c)
        let body
        try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { res.statusCode = 400; res.end('invalid json'); return }
        const { email } = body
        if (!email) { res.statusCode = 400; res.end(JSON.stringify({error:'no email'})); return }
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) { res.statusCode = 500; res.end(JSON.stringify({error:'RESEND_API_KEY not set'})); return }
        const resend = new Resend(apiKey)
        const tempPw = Math.random().toString(36).slice(2, 10)
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
            </div>`
          })
          const usersFile = path.resolve('./data/state-users.json')
          try {
            const data = JSON.parse(await fs.promises.readFile(usersFile, 'utf8'))
            const idx = data.findIndex(u => u.email === email)
            if (idx >= 0) { data[idx].password = tempPw; await fs.promises.writeFile(usersFile, JSON.stringify(data)) }
          } catch {}
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify({ok:true, tempPw}))
        } catch (e) {
          res.statusCode = 500
          res.end(JSON.stringify({error: e.message || 'send failed'}))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), prodsApi()],
  server: {
    allowedHosts: ["connector-chomp-mouth.ngrok-free.dev"],
  },
})
