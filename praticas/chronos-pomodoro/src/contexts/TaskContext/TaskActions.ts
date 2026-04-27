// useReducer <- hook do React que recebe um reducer e um estado inicial
// reducer <- função que recebe o estado atual e uma ação, e retorna o novo estado
// state <- o estado atual
// action <- a ação disparada, geralmente é um objeto com type e (opcionalmente) payload

import type { TaskModel } from '../../models/TaskModel';

// 1. Usando um objeto literal com 'as const' para travar os valores
export const TaskActionTypes = {
  START_TASK: 'START_TASK',
  INTERRUPT_TASK: 'INTERRUPT_TASK',
  RESET_STATE: 'RESET_STATE',
} as const;

// Ações que OBRIGATORIAMENTE precisam receber dados (payload)
export type TaskActionsWithPayload =
  | {
      type: typeof TaskActionTypes.START_TASK;
      payload: TaskModel;
    }
  | {
      type: typeof TaskActionTypes.INTERRUPT_TASK;
      payload: TaskModel;
    };

// Ações que NÃO DEVEM receber dados extras
export type TaskActionsWithoutPayload = {
  type: typeof TaskActionTypes.RESET_STATE;
};

// Juntando tudo no modelo final que será exportado para o nosso Reducer
export type TaskActionModel =
  | TaskActionsWithPayload
  | TaskActionsWithoutPayload;