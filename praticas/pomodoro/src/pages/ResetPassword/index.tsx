import { useState } from 'react';
import { useNavigate } from 'react-router';
import { apiResetPassword } from '../../services/api';

export function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!token.trim() || !newPassword.trim()) {
      setError('Preencha o token capturado no console e a sua nova senha.');
      return;
    }

    if (newPassword.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await apiResetPassword({ token, newPassword });
      setSuccess(
        'Senha alterada com sucesso! Redirecionando para a tela de login...',
      );
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Token inválido ou expirado.');
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
      <h2>Nova Senha</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Insira o token gerado no console do laboratório e defina sua nova senha.
      </p>

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
          <label>Token de Recuperação:</label>
          <input
            type='text'
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder='Cole o código do console aqui'
            style={{ padding: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>Nova Senha:</label>
          <input
            type='password'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
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
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Alterando...' : 'Redefinir Senha'}
        </button>
      </form>
    </div>
  );
}
