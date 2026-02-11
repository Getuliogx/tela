let socket = null;
let channel = new URLSearchParams(window.location.search).get('channel') || 'icarolinaporto';

function connect() {

  if (socket) {
    try {
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

    const linha1 = document.getElementById('linhaSuperior');
    const linha2 = document.getElementById('linhaInferior');

    // !j1 → Texto Linha Superior
    if (msgLower.startsWith('!j1 ')) {
      const novoTexto = msg.slice(4).trim() || 'Filme';

      linha1.textContent = '';
      void linha1.offsetWidth; // força reflow
      linha1.textContent = novoTexto;
    }

    // !j2 → Texto Linha Inferior
    else if (msgLower.startsWith('!j2 ')) {
      const novoTexto = msg.slice(4).trim() || 'Patrocinador';

      linha2.textContent = '';
      void linha2.offsetWidth;
      linha2.textContent = novoTexto;
    }

    // !m1 → Cor Linha Superior
    else if (msgLower.startsWith('!m1 ')) {
      linha1.style.color = msg.slice(4).trim();
    }

    // !m2 → Cor Linha Inferior
    else if (msgLower.startsWith('!m2 ')) {
      linha2.style.color = msg.slice(4).trim();
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
