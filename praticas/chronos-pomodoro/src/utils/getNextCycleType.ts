import { TaskModel } from '../models/TaskModel';

// Tipamos o retorno para ser exatamente a chave 'type' do TaskModel
export function getNextCycleType(currentCycle: number): TaskModel['type'] {
  // 1. Se o resto da divisão por 8 for zero, é a oitava tarefa (Pausa Longa)
  if (currentCycle % 8 === 0) return 'longBreakTime';

  // 2. Se o resto da divisão por 2 for zero, é um número Par (Pausa Curta)
  if (currentCycle % 2 === 0) return 'shortBreakTime';

  // 3. Se não caiu em nenhuma das regras acima, só pode ser Ímpar (Tempo de Foco)
  return 'workTime';
}
