let socket = null;
let channel = new URLSearchParams(window.location.search).get('channel') || 'icarolinaporto';

function connect() {

  // Fecha conexão anterior se existir
  if (socket) {
    try {
      socket.onclose = null;
      socket.onerror = null;
      socket.close();
    } catch (e) {}
  }

  socket = new WebSocket('wss://xxxx-r0pa.onrender.com');

  socket.onopen = () => {
    console.log('Overlay conectada');
    socket.send(JSON.stringify({
      action: 'join',
      channel: channel.toLowerCase()
    }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (!data.message) return;

    const msg = data.message.trim();
    const msgLower = msg.toLowerCase();

    console.log("Recebido:", msg);

    if (msgLower.startsWith('!j1 ')) {
      document.getElementById('linhaSuperior').textContent = msg.slice(4).trim();
    }

    else if (msgLower.startsWith('!j2 ')) {
      document.getElementById('linhaInferior').textContent = msg.slice(4).trim();
    }

    else if (msgLower.startsWith('!m1 ')) {
      document.getElementById('linhaSuperior').style.color = msg.slice(4).trim();
    }

    else if (msgLower.startsWith('!m2 ')) {
      document.getElementById('linhaInferior').style.color = msg.slice(4).trim();
    }
  };

  socket.onclose = () => {
    console.log('Reconectando em 3s...');
    setTimeout(connect, 3000);
  };

  socket.onerror = () => {
    socket.close();
  };
}

connect();
