let socket;
let channel = new URLSearchParams(window.location.search).get('channel') || 'icarolinaporto';

function connect() {
  socket = new WebSocket('wss://xxxx-r0pa.onrender.com');

  socket.onopen = () => {
    console.log('Overlay conectada ao servidor');
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

    console.log("Recebido:", msg); // DEBUG (ver se está duplicando)

    // !j1 → Linha Superior
    if (msgLower.startsWith('!j1 ')) {
      const input1 = msg.slice(4).trim();
      document.getElementById('linhaSuperior').textContent = input1;
    }

    // !j2 → Linha Inferior
    else if (msgLower.startsWith('!j2 ')) {
      const input2 = msg.slice(4).trim();
      document.getElementById('linhaInferior').textContent = input2;
    }

    // !m1 → cor Linha Superior
    else if (msgLower.startsWith('!m1 ')) {
      const color1 = msg.slice(4).trim();
      document.getElementById('linhaSuperior').style.color = color1;
    }

    // !m2 → cor Linha Inferior
    else if (msgLower.startsWith('!m2 ')) {
      const color2 = msg.slice(4).trim();
      document.getElementById('linhaInferior').style.color = color2;
    }
  };

  socket.onclose = () => {
    console.log('Conexão perdida, reconectando em 2 segundos...');
    setTimeout(connect, 2000);
  };

  socket.onerror = (err) => {
    console.log('Erro no WebSocket:', err);
    socket.close();
  };
}

connect();
