import { useState } from 'react';
import { useNavigate } from 'react-router';
import { apiRegister } from '../../services/api';

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação mínima recomendada
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await apiRegister({ name, email, password });
      setSuccess('Conta criada com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        fontFamily: 'sans-serif',
      }}
    >
      <h2>Criar Nova Conta</h2>

      {error && (
        <p
          style={{
            color: 'red',
            background: '#fee',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          {error}
        </p>
      )}
      {success && (
        <p
          style={{
            color: 'green',
            background: '#efe',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          {success}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Nome:</label>
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Seu nome completo'
            style={{ padding: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>E-mail:</label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='seu@email.com'
            style={{ padding: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Senha:</label>
          <input
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder='No mínimo 6 caracteres'
            style={{ padding: '8px', fontSize: '16px' }}
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          style={{
            padding: '10px',
            fontSize: '16px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Cadastrando...' : 'Registrar Conta'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Já tem uma conta?{' '}
        <span
          style={{
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          onClick={() => navigate('/')}
        >
          Faça Login
        </span>
      </p>
    </div>
  );
}
