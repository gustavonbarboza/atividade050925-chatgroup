import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import {
  PageContainer,
  WelcomeMessage,
  ChatArea,
  MessageInputContainer,
  MessageInput,
  SendButton,
  RoomList,
  RoomItem,
  RoomForm,
  CreateRoomInput,
  CreateRoomButton,
  MessageBubble,
  EnterRoomButton,
  ExitRoomButton,
  OnlineUsersContainer,
  OnlineUsersList,
  EmoteButton,
  EmoteModalContainer,
  EmoteModalContent,
  UploadButton,
  ImagePreview
} from './styles';

const emotes = ['😄', '😂', '😍', '👍', '🙏', '🔥', '🎉', '🤯'];

const ChatPage = ({ user, onLogout }) => {
  const [salas, setSalas] = useState([]);
  const [salaSelecionada, setSalaSelecionada] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [novaSala, setNovaSala] = useState('');
  const [usuariosOnline, setUsuariosOnline] = useState([]);
  const [showEmoteModal, setShowEmoteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatAreaRef = useRef(null);
  const socket = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    socket.current = io('http://localhost:3001');

    socket.current.on('connect', () => console.log('Conectado ao servidor de chat.'));
    socket.current.on('disconnect', () => console.log('Desconectado do servidor de chat.'));

    socket.current.on('novaSala', (novaSala) => {
      setSalas((prevSalas) => [...prevSalas, novaSala]);
    });

    socket.current.on('novaMensagem', (novaMensagem) => {
      setMensagens((prevMensagens) => [...prevMensagens, novaMensagem]);
    });
    
    socket.current.on('usuariosOnline', (users) => {
      setUsuariosOnline(users);
    });

    fetchSalas();

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [mensagens]);

  const fetchSalas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/salas');
      const data = await response.json();
      if (Array.isArray(data)) {
        setSalas(data);
      } else {
        console.error('Dados de salas inválidos:', data);
        setSalas([]);
      }
    } catch (error) {
      console.error('Erro ao buscar as salas:', error);
      setSalas([]);
    }
  };

  const fetchMensagens = async (salaId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/mensagens/${salaId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setMensagens(data);
      } else {
        console.error('Dados de mensagens inválidos:', data);
        setMensagens([]);
      }
    } catch (error) {
      console.error('Erro ao buscar as mensagens:', error);
      setMensagens([]);
    }
  };

  const handleEntrarSala = (sala) => {
    if (salaSelecionada) {
      socket.current.emit('sairSala', salaSelecionada.id);
    }
    setSalaSelecionada(sala);
    fetchMensagens(sala.id);
    socket.current.emit('entrarSala', { salaId: sala.id, username: user.username });
  };
  
  const handleSairSala = () => {
    if (salaSelecionada) {
      socket.current.emit('sairSala', salaSelecionada.id);
      setSalaSelecionada(null);
      setMensagens([]);
      setUsuariosOnline([]);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!novaMensagem.trim() && !selectedFile) return;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('imagem', selectedFile);
      formData.append('usuario_id', user.userId);
      formData.append('sala_id', salaSelecionada.id);
      
      try {
        const response = await fetch('http://localhost:3001/api/upload-imagem', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        // Ação otimista: adiciona a mensagem à tela do remetente
        if (response.ok) {
          const mensagemTemp = {
            tipo: 'imagem',
            url_anexo: data.url_anexo, // Ou o que for retornado pelo backend
            username: user.username,
            data_hora: new Date().toISOString(),
          };
          setMensagens((prev) => [...prev, mensagemTemp]);
        }
      } catch (error) {
        console.error('Erro ao enviar a imagem:', error);
      }
    } else {
      const mensagem = {
        texto: novaMensagem,
        usuario_id: user.userId,
        sala_id: salaSelecionada.id,
      };
      
      try {
        const response = await fetch('http://localhost:3001/api/mensagens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mensagem),
        });
        // Ação otimista para mensagens de texto também
        if (response.ok) {
          const mensagemTemp = {
            texto: novaMensagem,
            username: user.username,
            data_hora: new Date().toISOString(),
          };
          setMensagens((prev) => [...prev, mensagemTemp]);
        }
      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
      }
    }
  
    setNovaMensagem('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmoteSelect = (emote) => {
    setNovaMensagem((prevMsg) => prevMsg + emote);
    setShowEmoteModal(false);
  };
  
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!novaSala.trim()) return;

    const sala = {
      nome: novaSala,
      criador_id: user.userId,
    };

    try {
      await fetch('http://localhost:3001/api/salas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sala),
      });
      setNovaSala('');
    } catch (error) {
      console.error('Erro ao criar a sala:', error);
    }
  };

  return (
    <PageContainer>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
        <WelcomeMessage>Bem-vindo, {user.username}!</WelcomeMessage>
        <button onClick={onLogout}>Sair</button>
      </header>
      
      <RoomForm onSubmit={handleCreateRoom}>
        <CreateRoomInput
          type="text"
          placeholder="Criar nova sala..."
          value={novaSala}
          onChange={(e) => setNovaSala(e.target.value)}
        />
        <CreateRoomButton type="submit">Criar Sala</CreateRoomButton>
      </RoomForm>

      <RoomList>
        {salas.map((sala) => (
          <RoomItem key={sala.id} selecionada={salaSelecionada && salaSelecionada.id === sala.id}>
            {sala.nome}
            {salaSelecionada && salaSelecionada.id === sala.id ? (
              <ExitRoomButton onClick={handleSairSala}>Sair</ExitRoomButton>
            ) : (
              <EnterRoomButton onClick={() => handleEntrarSala(sala)}>Entrar</EnterRoomButton>
            )}
          </RoomItem>
        ))}
      </RoomList>

      {salaSelecionada && (
        <>
          <h3 style={{marginTop: '20px'}}>Sala: {salaSelecionada.nome}</h3>
          <OnlineUsersContainer>
            Online:
            <OnlineUsersList>
              {usuariosOnline.map((username, index) => (
                <li key={index}>{username}</li>
              ))}
            </OnlineUsersList>
          </OnlineUsersContainer>
          <ChatArea ref={chatAreaRef}>
            {mensagens.map((msg, index) => (
              <MessageBubble key={index} minha={msg.username === user.username}>
                <strong>{msg.username}:</strong>
                {msg.tipo === 'imagem' ? (
                  <ImagePreview src={`http://localhost:3001${msg.url_anexo}`} />
                ) : (
                  msg.texto
                )}
              </MessageBubble>
            ))}
          </ChatArea>
          <MessageInputContainer>
            {showEmoteModal && (
              <EmoteModalContainer>
                <EmoteModalContent>
                  {emotes.map((emote, index) => (
                    <span key={index} onClick={() => handleEmoteSelect(emote)}>
                      {emote}
                    </span>
                  ))}
                </EmoteModalContent>
              </EmoteModalContainer>
            )}
            <EmoteButton onClick={() => setShowEmoteModal(!showEmoteModal)}>
              😀
            </EmoteButton>
            <input 
              type="file" 
              style={{ display: 'none' }} 
              onChange={(e) => setSelectedFile(e.target.files[0])} 
              ref={fileInputRef}
            />
            <UploadButton onClick={() => fileInputRef.current.click()}>
              🖼️
            </UploadButton>
            <form onSubmit={handleSendMessage} style={{ display: 'flex', flexGrow: 1, gap: '10px' }}>
              <MessageInput
                type="text"
                placeholder={selectedFile ? `Arquivo: ${selectedFile.name}` : "Digite sua mensagem..."}
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                disabled={!!selectedFile}
              />
              <SendButton type="submit">Enviar</SendButton>
            </form>
          </MessageInputContainer>
        </>
      )}
    </PageContainer>
  );
};

export default ChatPage;