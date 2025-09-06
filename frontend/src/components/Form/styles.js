// frontend/src/components/FormStyles.js
import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  background-color: #1a1e24;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
`;

export const Input = styled.input`
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #3f4451;
  color: white;
`;

export const Button = styled.button`
  padding: 10px;
  border-radius: 4px;
  border: none;
  background-color: #61dafb;
  color: #282c34;
  cursor: pointer;
  font-weight: bold;
`;

export const ToggleText = styled.button`
  background: none;
  color: #61dafb;
  font-weight: normal;
  margin-top: 10px;
  border: 1px solid #61dafb;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
`;

export const Message = styled.p`
  margin-top: 20px;
  font-size: 1rem;
`;