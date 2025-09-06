// frontend/src/pages/Register/index.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableForm from '../../components/Form';
import { PageContainer } from './styles';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (username, password) => {
    const response = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (response.ok) {
      navigate('/login');
    }
    return data;
  };

  return (
    <PageContainer>
      <ReusableForm
        title="Registrar"
        buttonText="Registrar"
        toggleText="Já tem conta? Faça login"
        onToggle={() => navigate('/login')}
        onSubmit={handleRegister}
      />
    </PageContainer>
  );
};

export default RegisterPage;