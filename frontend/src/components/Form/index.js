// frontend/src/components/Form.js
import React, { useState } from 'react';
import { Container, Form, Input, Button, ToggleText, Message } from './styles';

const ReusableForm = ({ title, buttonText, toggleText, onToggle, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(username, password);
    setMessage(result.message);
  };

  return (
    <Container>
      <h2>{title}</h2>
      <Form onSubmit={handleSubmit}>
        <Input 
          type="text" 
          placeholder="Usuário" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />
        <Input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <Button type="submit">{buttonText}</Button>
      </Form>
      <ToggleText onClick={onToggle}>
        {toggleText}
      </ToggleText>
      {message && <Message>{message}</Message>}
    </Container>
  );
};

export default ReusableForm;