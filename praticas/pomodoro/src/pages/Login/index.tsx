import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { DefaultInput } from '../../components/DefaultInput';
import { useAuthContext } from '../../contexts/AuthContext';
import { showMessage } from '../../adapters/showMessage';
import styles from './styles.module.css';

type Mode = 'login' | 'register' | 'forgot' | 'reset';

export function Login() {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetToken, setResetToken] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await auth.login(email, password);
        showMessage.success('Login realizado com sucesso');
        navigate('/home');
      } else if (mode === 'register') {
        await auth.register(name, email, password);
        showMessage.success('Conta criada. Faça login.');
        setMode('login');
      } else if (mode === 'forgot') {
        const token = await auth.forgotPassword(email);
        showMessage.info(token ? `Token de laboratório: ${token}` : 'Se o e-mail existir, um token foi gerado.');
        setMode('reset');
      } else {
        await auth.resetPassword(resetToken, password);
        showMessage.success('Senha redefinida. Faça login.');
        setMode('login');
      }
    } catch (error) {
      showMessage.error(error instanceof Error ? error.message : 'Erro no fluxo de autenticação');
    }
  }

  return (<div className={styles.container}><form onSubmit={handleSubmit} className={styles.form}>
    <h1 className={styles.title}>Chronos Login</h1>
    {mode === 'register' && <DefaultInput id='name' labelText='Nome' type='text' value={name} onChange={(e) => setName(e.target.value)} />}
    {(mode === 'login' || mode === 'register' || mode === 'forgot') && <DefaultInput id='email' labelText='E-mail' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />}
    {mode === 'reset' && <DefaultInput id='token' labelText='Token de recuperação' type='text' value={resetToken} onChange={(e) => setResetToken(e.target.value)} />}
    {(mode === 'login' || mode === 'register' || mode === 'reset') && <DefaultInput id='pass' labelText={mode === 'reset' ? 'Nova senha' : 'Senha'} type='password' value={password} onChange={(e) => setPassword(e.target.value)} />}
    <button type='submit' className={styles.submitButton}>Continuar</button>
    <div className={styles.actions}>
      <button type='button' className={styles.secondaryButton} onClick={() => setMode('login')}>Login</button>
      <button type='button' className={styles.secondaryButton} onClick={() => setMode('register')}>Cadastrar</button>
      <button type='button' className={styles.secondaryButton} onClick={() => setMode('forgot')}>Esqueci senha</button>
    </div>
  </form></div>);
}
