let socket;
let channel = new URLSearchParams(window.location.search).get('channel') || 'icarolinaporto'; // Pega o canal da URL (ex: overlay.html?channel=seucanal) ou default

function connect() {
  socket = new WebSocket('wss://xxxx-r0pa.onrender.com'); // Mude para WS remoto ex: 'wss://seu-app.render.com:8080' após hospedar

  socket.onopen = () => {
    console.log('Overlay conectada ao servidor');
    // Envia o canal para o server joinar
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
      document.getElementById('linhaSuperior').innerText = input1;
    }

    // !j2 → Linha Inferior (texto)
    else if (msgLower.startsWith('!j2 ')) {
      const input2 = msg.slice(4).trim();
      document.getElementById('linhaInferior').innerText = input2;
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
    setTimeout(connect, 2000); // Reconexão robusta
  };

  socket.onerror = () => {
    console.log('Erro no WebSocket, fechando e reconectando...');
    socket.close();
  };
}

// Inicia a conexão
connect();