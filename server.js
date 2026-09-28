const express = require('express');
const path = require('path');
const delta = require('./api/delta');
const tiktok = require('./api/tiktok');
const sub = require('./api/sub4unlock');
const { stats, addClient, broadcast, hit } = require('./api/stats');

const app = express();
app.use(express.static(path.join(__dirname)));

// ===== SSE Realtime Monitor =====
app.get('/api/stats/stream', (req, res)=>{
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.flushHeaders();
  addClient(res);
  broadcast('User connected');

  const ping = setInterval(()=> res.write(': ping\n\n'), 25000);
  req.on('close', ()=> clearInterval(ping));
});

app.get('/api/stats', (req, res)=>{
  res.json({
    online: stats.online,
    total: stats.total,
    delta: stats.delta,
    tiktok: stats.tiktok,
    sub: stats.sub
  });
});

// ===== Bypass endpoints =====
app.get('/api/delta', async (req, res)=>{
  hit('delta');
  try { res.json(await delta.bypass(req.query.url)); }
  catch(e){ res.json({ error: e.message }); }
});

app.get('/api/tiktok', async (req, res)=>{
  hit('tiktok');
  try { res.json(await tiktok.download(req.query.url)); }
  catch(e){ res.json({ error: e.message }); }
});

app.get('/api/sub4unlock', async (req, res)=>{
  hit('sub');
  try { res.json(await sub.bypass(req.query.url)); }
  catch(e){ res.json({ error: e.message }); }
});

app.listen(3000, ()=> console.log('✦ Zero Bypass Anime Edition running di http://localhost:3000'));
