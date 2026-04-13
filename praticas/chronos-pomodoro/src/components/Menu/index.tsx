import { HistoryIcon, HouseIcon, SettingsIcon, SunIcon } from 'lucide-react';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

// Tipagem restrita: O tema SÓ pode ser 'dark' ou 'light'
type AvailableThemes = 'dark' | 'light';

export function Menu() {
  const [theme, setTheme] = useState<AvailableThemes>('dark');

  // A função de clique agora apenas muda o estado. Ponto.
  function handleThemeChange(
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) {
    event.preventDefault();

    setTheme(prevTheme => {
      return prevTheme === 'dark' ? 'light' : 'dark';
    });
  }

  // O Efeito Colateral que escuta o estado e reflete no HTML
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    // Função de limpeza (apenas didática neste momento)
    return () => {
      console.log('Limpando efeito anterior...');
    };
  }, [theme]); // Array de dependências observando o 'theme'

  return (
    <nav className={styles.menu}>
      <a
        className={styles.menuLink}
        href='#'
        aria-label='Ir para a Home'
        title='Ir para a Home'
      >
        <HouseIcon />
      </a>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Ver Histórico'
        title='Ver Histórico'
      >
        <HistoryIcon />
      </a>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Configurações'
        title='Configurações'
      >
        <SettingsIcon />
      </a>

      <a
        className={styles.menuLink}
        href='#'
        aria-label='Mudar Tema'
        title='Mudar Tema'
        onClick={handleThemeChange}
      >
        <SunIcon />
      </a>
      <a
        className={styles.menuLink}
        href='#'
        aria-label='Mudar Tema'
        title='Mudar Tema'
        onClick={handleThemeChange}
      ></a>
    </nav>
  );
}
