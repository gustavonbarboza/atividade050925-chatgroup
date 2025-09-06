import styled from 'styled-components';

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #282c34;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const WelcomeMessage = styled.h1`
  text-align: center;
  margin-bottom: 0;
`;

export const RoomForm = styled.form`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
`;

export const CreateRoomInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #3f4451;
  color: white;
`;

export const CreateRoomButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: #61dafb;
  color: #282c34;
  cursor: pointer;
  font-weight: bold;
`;

export const RoomList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  width: 100%;
  max-width: 600px;
`;

export const RoomItem = styled.div`
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid #61dafb;
  background-color: ${(props) => (props.selecionada ? '#61dafb' : 'transparent')};
  color: ${(props) => (props.selecionada ? '#282c34' : '#61dafb')};
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #61dafb;
    color: #282c34;
  }
`;

export const EnterRoomButton = styled.button`
  background-color: #282c34;
  color: #61dafb;
  border: 1px solid #61dafb;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  cursor: pointer;
  &:hover {
    background-color: #61dafb;
    color: #282c34;
  }
`;

export const ExitRoomButton = styled.button`
  background-color: #e57373;
  color: white;
  border: 1px solid #e57373;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  cursor: pointer;
  &:hover {
    background-color: #d32f2f;
  }
`;

export const OnlineUsersContainer = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: #1a1e24;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 10px;
  border: 1px solid #4f5661;
`;

export const OnlineUsersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  li {
    background-color: #61dafb;
    color: #282c34;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9em;
    font-weight: bold;
  }
`;

export const ChatArea = styled.div`
  flex-grow: 1;
  background-color: #1a1e24;
  border-radius: 8px;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  margin-top: 10px;
`;

export const MessageBubble = styled.div`
  background-color: ${(props) => (props.minha ? '#61dafb' : '#4f5661')};
  color: ${(props) => (props.minha ? '#282c34' : 'white')};
  align-self: ${(props) => (props.minha ? 'flex-end' : 'flex-start')};
  padding: 10px 15px;
  border-radius: 20px;
  margin-bottom: 10px;
  max-width: 70%;
  word-wrap: break-word;
`;

export const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
  border-radius: 8px;
`;

export const MessageInputContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  width: 100%;
  max-width: 600px;
  position: relative;
`;

export const EmoteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  margin-right: 10px;
  padding: 0;
`;

export const EmoteModalContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: #1a1e24;
  border: 1px solid #4f5661;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 5px;
`;

export const EmoteModalContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  span {
    font-size: 24px;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
      transition: transform 0.2s ease;
    }
  }
`;

export const UploadButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  margin-right: 10px;
  padding: 0;
`;

export const MessageInput = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #3f4451;
  color: white;
`;

export const SendButton = styled.button`
  padding: 10px 20px;
  border-radius: 4px;
  border: none;
  background-color: #61dafb;
  color: #282c34;
  cursor: pointer;
  font-weight: bold;
`;