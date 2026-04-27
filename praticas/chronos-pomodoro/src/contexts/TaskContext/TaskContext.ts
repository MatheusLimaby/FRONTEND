import { createContext, type Dispatch } from 'react';
import { initialTaskState } from './initialTaskState';
import type { TaskStateModel } from '../../models/TaskStateModel';
import type { TaskActionModel } from './TaskActions';

type TaskContextProps = {
  state: TaskStateModel;
  // Sai o setState, entra o dispatch tipado com as nossas actions!
  dispatch: Dispatch<TaskActionModel>;
};

const initialContextValue = {
  state: initialTaskState,
  dispatch: () => {},
};

export const TaskContext = createContext<TaskContextProps>(initialContextValue);