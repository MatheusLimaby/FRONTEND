import { useState } from 'react';
import { useNavigate } from 'react-router';
import { apiForgotPassword } from '../../services/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Por favor, informe seu e-mail.');
      return;
    }

    setLoading(true);
    try {
      await apiForgotPassword(email);
      setSuccess(
        'Instruções enviadas! Verifique o console do backend para obter o token de recuperação.',
      );
    } catch (err: any) {
      setError(err.message || 'Erro ao processar solicitação.');
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
      <h2>Recuperar Senha</h2>
      <p style={{ color: '#666', fontSize: '14px' }}>
        Digite seu e-mail para receber um token de redefinição temporário.
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
        <div>
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
          <button
            onClick={() => navigate('/reset-password')}
            style={{
              padding: '8px',
              width: '100%',
              marginBottom: '15px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Ir para Redefinição de Senha
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <label>E-mail cadastrado:</label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder='seu@email.com'
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
          {loading ? 'Enviando...' : 'Solicitar Token'}
        </button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        <span
          style={{
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
          onClick={() => navigate('/')}
        >
          Voltar para o Login
        </span>
      </p>
    </div>
  );
}
