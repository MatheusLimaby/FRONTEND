import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import styles from './styles.module.css';

export function Cycles() {
  const { state } = useTaskContext();

  // 1. Cria um array com o tamanho exato do ciclo atual (ex: se for 3, cria um array com 3 posições)
  const cycleStep = Array.from({ length: state.currentCycle });

  // 2. Dicionário para traduzir os tipos de ciclo para texto legível (Acessibilidade)
  const cycleDescriptionMap = {
    workTime: 'foco',
    shortBreakTime: 'descanso curto',
    longBreakTime: 'descanso longo',
  };

  return (
    <div className={styles.cycleDots}>
  {cycleStep.map((_, index) => {
    // O índice começa em 0. Usamos nossas funções para saber o número e o tipo real do ciclo.
    const nextCycle = getNextCycle(index);
    const nextCycleType = getNextCycleType(nextCycle);

    return (
      <span
        // A prop 'key' é OBRIGATÓRIA no React para elementos gerados por map()
        key={nextCycle}
        // Aplicamos a classe base da bolinha + a classe dinâmica da cor (ex: styles.workTime)
        className={`${styles.cycleDot} ${styles[nextCycleType]}`}
        // Acessibilidade (Leitores de tela e tooltip ao passar o mouse)
        aria-label={`Indicador de ciclo de ${cycleDescriptionMap[nextCycleType]}`}
        title={`Indicador de ciclo de ${cycleDescriptionMap[nextCycleType]}`}
      ></span>
    );
  })}
</div>
  );
}