let socket;
let channel = new URLSearchParams(window.location.search).get('channel') || 'icarolinaporto';

function connect() {
  socket = new WebSocket('wss://xxxx-r0pa.onrender.com');

  socket.onopen = () => {
    console.log('Overlay conectada ao servidor');
    socket.send(JSON.stringify({ action: 'join', channel: channel.toLowerCase() }));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (!data.message) return;

    const msg = data.message.trim();
    const msgLower = msg.toLowerCase();

    // !j1 → Linha Superior (texto)
    if (msgLower.startsWith('!j1 ')) {
      const input1 = msg.slice(4).trim();
      const elem1 = document.getElementById('linhaSuperior');
      elem1.textContent = ''; // Limpa o antigo
      elem1.innerText = input1; // Adiciona o novo
      elem1.style.display = 'block'; // Força repaint no OBS
    }

    // !j2 → Linha Inferior (texto)
    else if (msgLower.startsWith('!j2 ')) {
      const input2 = msg.slice(4).trim();
      const elem2 = document.getElementById('linhaInferior');
      elem2.textContent = ''; // Limpa o antigo
      elem2.innerText = input2; // Adiciona o novo
      elem2.style.display = 'block'; // Força repaint no OBS
    }

    // !m1 → cor da Linha Superior
    else if (msgLower.startsWith('!m1 ')) {
      const color1 = msg.slice(4).trim();
      document.getElementById('linhaSuperior').style.color = color1;
    }

    // !m2 → cor da Linha Inferior
    else if (msgLower.startsWith('!m2 ')) {
      const color2 = msg.slice(4).trim();
      document.getElementById('linhaInferior').style.color = color2;
    }
  };

  socket.onclose = () => {
    console.log('Conexão perdida, tentando reconectar em 2 segundos...');
    setTimeout(connect, 2000);
  };

  socket.onerror = () => {
    console.log('Erro no WebSocket, fechando e reconectando...');
    socket.close();
  };
}

// Inicia a conexão
connect();
