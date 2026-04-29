import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { useAuthContext } from '../../contexts/AuthContext';
import { showMessage } from '../../adapters/showMessage';
import styles from './styles.module.css';

type ViewMode = 'login' | 'signup' | 'recover';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('login');
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    usernameInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!feedback) return;

    const timer = setTimeout(() => {
      setFeedback('');
    }, 4000);

    return () => clearTimeout(timer);
  }, [feedback]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!username.trim()) {
      const message = 'Informe o usuário.';
      setFeedback(message);
      showMessage.warn(message);
      return;
    }

    if (!password) {
      const message = 'Informe a senha.';
      setFeedback(message);
      showMessage.warn(message);
      return;
    }

    setIsSubmitting(true);

    const authenticated = login(username, password);

    if (authenticated) {
      const message = 'Login enviado com sucesso. Redirecionando...';
      setFeedback(message);
      showMessage.success('Bem-vindo!');
      navigate('/home');
    } else {
      const message = 'Usuário ou senha inválidos.';
      setFeedback(message);
      showMessage.error(message);
      setIsSubmitting(false);
    }
  }

  function handleShowSignup() {
    setViewMode('signup');
    setFeedback('Tela de cadastro (simulação).');
    showMessage.info('Cadastro em breve');
  }

  function handleShowRecover() {
    setViewMode('recover');
    setFeedback('Tela de recuperação de senha (simulação).');
    showMessage.info('Recuperação em breve');
  }

  function handleBackToLogin() {
    setViewMode('login');
    setFeedback('Voltou para o login.');
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Bem-vindo</h1>
        <p className={styles.subtitle}>Faça login para continuar</p>

        {feedback && (
          <p className={styles.feedback} role="status" aria-live="polite">
            {feedback}
          </p>
        )}

        {viewMode === 'login' && (
          <>
            <DefaultInput
              id="login-user"
              labelText="Usuário"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              ref={usernameInputRef}
            />

            <DefaultInput
              id="login-pass"
              labelText="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </>
        )}

        {viewMode !== 'login' && (
          <button type="button" className={styles.submitButton} onClick={handleBackToLogin}>
            Voltar para login
          </button>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={handleShowSignup}>
            Não tem conta? Cadastre-se
          </button>

          <button type="button" className={styles.secondaryButton} onClick={handleShowRecover}>
            Esqueci minha senha
          </button>
        </div>
      </form>
    </div>
  );
}
