const stats = {
  online: 0,
  total: 0,
  delta: 0,
  tiktok: 0,
  sub: 0,
  clients: new Set(),
  lastEvent: null
};

function addClient(res){
  stats.online++;
  stats.clients.add(res);
  res.on('close', ()=>{
    stats.online--;
    stats.clients.delete(res);
  });
}

function broadcast(eventName){
  stats.lastEvent = eventName;
  const payload = JSON.stringify({
    online: stats.online,
    total: stats.total,
    delta: stats.delta,
    tiktok: stats.tiktok,
    sub: stats.sub,
    event: eventName
  });
  for (const c of stats.clients){
    c.write(`data: ${payload}\n\n`);
  }
}

function hit(type){
  stats.total++;
  if (type === 'delta') stats.delta++;
  if (type === 'tiktok') stats.tiktok++;
  if (type === 'sub') stats.sub++;
  broadcast(`User hit /api/${type}`);
}

module.exports = { stats, addClient, broadcast, hit };
