import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider';
import { AuthContextProvider } from './contexts/AuthContext'; // 👈 FALTAVA ISSO
import { MessagesContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter';
import './styles/theme.css';
import './styles/global.css';

export function App() {
  return (
    <TaskContextProvider>
      <AuthContextProvider> 
        <MessagesContainer>
          <MainRouter />
        </MessagesContainer>
      </AuthContextProvider>
    </TaskContextProvider>
  );
}