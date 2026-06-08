import { useEffect } from 'react';
import { Container } from '../../components/Container';
import { CountDown } from '../../components/CountDown';
import { MainForm } from '../../components/MainForm';
import { MainTemplate } from '../../templates/MainTemplate';
import { useAuthContext } from '../../contexts/AuthContext'; // 1. Importa o contexto de autenticação

export function Home() {
  // 2. Captura o nome do usuário logado
  const { userName } = useAuthContext();

  useEffect(() => {
    document.title = 'Chronos Pomodoro';
  }, []);

  return (
    <MainTemplate>
      {/* 3. Bloco de Boas-vindas adaptado na estrutura */}
      <Container>
        <div
          style={{
            padding: '10px 0',
            borderBottom: '1px solid var(--border-color, #323238)',
            marginBottom: '10px',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '22px',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Olá,{' '}
            <span style={{ color: 'var(--green-500, #00b37e)' }}>
              {userName || 'Usuário'}
            </span>
            ! 🍅
          </h2>
          <p
            style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#8d8d99' }}
          >
            Pronto para focar nos seus ciclos de hoje?
          </p>
        </div>
      </Container>

      <Container>
        <CountDown />
      </Container>

      <Container>
        <MainForm />
      </Container>
    </MainTemplate>
  );
}
