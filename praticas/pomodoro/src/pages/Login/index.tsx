// pages/Login/index.tsx
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim()) {
      showMessage.warn('Informe o usuário');
      return;
    }

    if (!password) {
      showMessage.warn('Informe a senha');
      return;
    }

    if (login(username, password)) {
      showMessage.success('Bem-vindo!');
      navigate('/home');
    } else {
      showMessage.error('Usuário ou senha inválidos');
    }
  }

return (
  <div className={styles.container}>
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 className={styles.title}>Bem-vindo</h1>
      <p className={styles.subtitle}>Faça login para continuar</p>

      <DefaultInput
        id="login-user"
        labelText="Usuário"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <DefaultInput
        id="login-pass"
        labelText="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton}>
          Entrar
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => showMessage.info('Cadastro em breve')}
        >
          Cadastrar
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => showMessage.info('Recuperação em breve')}
        >
          Esqueci minha senha
        </button>
      </div>
    </form>
  </div>
);
}