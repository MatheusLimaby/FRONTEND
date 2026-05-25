import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { useAuthContext } from '../../contexts/AuthContext';
import { showMessage } from '../../adapters/showMessage';
import styles from './styles.module.css';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 1. Transformamos a função em async para esperar a resposta do servidor
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim()) {
      showMessage.warn('Informe o usuário (e-mail)');
      return;
    }

    if (!password) {
      showMessage.warn('Informe a senha');
      return;
    }

    setLoading(true);
    try {
      // 2. Aguarda a validação do token e persistência no banco
      const success = await login(username, password);

      if (success) {
        showMessage.success('Bem-vindo!');
        navigate('/home');
      } else {
        showMessage.error('Usuário ou senha inválidos');
      }
    } catch (err) {
      showMessage.error('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Bem-vindo</h1>
        <p className={styles.subtitle}>Faça login para continuar</p>

        <DefaultInput
          id="login-user"
          labelText="E-mail"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <DefaultInput
          id="login-pass"
          labelText="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          {/* 3. Redireciona para a nova rota de cadastro */}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate('/register')}
            disabled={loading}
          >
            Cadastrar
          </button>

          {/* 4. Redireciona para a nova rota de esqueci minha senha */}
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => navigate('/forgot-password')}
            disabled={loading}
          >
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
}