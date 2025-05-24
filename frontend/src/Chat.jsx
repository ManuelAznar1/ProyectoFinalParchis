import React, { useEffect, useState } from 'react';
import './App.css';

function Chat({ socket, codigo, usuario }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(usuario);
  const [partida, setPartida] = useState('');
  const [joined, setJoined] = useState(false);
  const [availablePartidas, setAvailablePartidas] = useState([]);
  const [partidaDescription, setPartidaDescription] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    socket.on('chat history', ({ messages, description }) => {
      setMessages(messages);
      setPartidaDescription(description);
    });

    socket.on('chat message', (msg) => {
      if (msg.partida === codigo) {
        setMessages((prev) => [...prev, msg]);
      } else {
        console.log('Mensaje de otra partida: ' + msg.partida + ' - Esta partida es: ' + partida)
      }
    });

    socket.on('partida list', (partidas) => setAvailablePartidas(partidas));


    //    socket.on('send turn', (msg) => {
    //      console.log('turno remoto:'+msg.turnoActual);
    //       
    //
    //    });    

    return () => {
      socket.off('chat history');
      socket.off('chat message');
      socket.off('partida list');
      //      socket.off('send turn');      
    };
  }, [partida]);

  //
  //  const joinPartida = (codigo) => {
  //    if (partida.trim()) {
  //      
  //            socket.emit('join', {codigo, usuario}, (response) => {
  //                if (response.error) {
  //                    console.error('Error:', response.error);
  //                } else {
  //                    console.log('Éxito:', response);
  //                }
  //            });
  //            
  //      setJoined(true);
  //    }
  //  };


  return (

    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, float: 'left' }}>
      <div
        style={{
          height: 300,
          overflowY: 'scroll',
          border: '1px solid #ccc',
          padding: 10,
          marginBottom: 10,
          backgroundColor: '#f9f9f9',
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <input
          style={{ flex: 1, marginRight: '8px', padding: '8px' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Escribe tu mensaje"
        />
        <button
          className="custom-button"
          onClick={sendMessage}
          style={{
            width: '70px',
            height: '36px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Enviar
        </button>
      </div>
    </div>

  );

  function sendMessage() {
    if (input.trim()) {
      socket.emit('chat message', { partida: codigo, user, message: input });
      setInput('');
    }
  }
}

export default Chat;

