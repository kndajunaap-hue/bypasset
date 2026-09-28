// Realtime monitor via SSE dari server
const feed = document.getElementById('mFeed');
const els = {
  online: document.getElementById('mOnline'),
  total: document.getElementById('mTotal'),
  delta: document.getElementById('mDelta'),
  tiktok: document.getElementById('mTiktok'),
  sub: document.getElementById('mSub')
};

function connectMonitor(){
  const es = new EventSource('/api/stats/stream');

  es.onmessage = (e)=>{
    const d = JSON.parse(e.data);
    els.online.textContent = d.online;
    els.total.textContent = d.total;
    els.delta.textContent = d.delta;
    els.tiktok.textContent = d.tiktok;
    els.sub.textContent = d.sub;

    if (d.event){
      const div = document.createElement('div');
      div.textContent = `[${new Date().toLocaleTimeString()}] ${d.event}`;
      feed.prepend(div);
      while (feed.children.length > 30) feed.removeChild(feed.lastChild);
    }
  };

  es.onerror = ()=>{
    es.close();
    setTimeout(connectMonitor, 3000); // reconnect
  };
}
connectMonitor();

// Clock
setInterval(()=>{
  document.getElementById('clock').textContent = new Date().toLocaleTimeString();
},1000);
