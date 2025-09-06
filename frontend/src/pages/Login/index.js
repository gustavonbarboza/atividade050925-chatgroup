// frontend/src/pages/Login/index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableForm from '../../components/Form';
import { PageContainer } from './styles';

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const handleLogin = async (username, password) => {
    const response = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      onLogin(data);
      navigate('/chat');
    }
    return data;
  };

  return (
    <PageContainer>
      <ReusableForm
        title="Login"
        buttonText="Entrar"
        toggleText="Não tem conta? Registre-se"
        onToggle={() => navigate('/register')}
        onSubmit={handleLogin}
      />
    </PageContainer>
  );
};

export default LoginPage;