import { useState, useEffect } from 'react';
import { initialTaskState } from './initialTaskState';
import { TaskContext } from './TaskContext';


type TaskContextProviderProps = {
  children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
  const [state, setState] = useState(initialTaskState);

  // O "Espião": Executa o console.log toda vez que a variável 'state' for alterada
  //useEffect(() => {
  //  console.log('ESTADO ATUALIZADO:', state);
  //}, [state]);

  return (
    <TaskContext.Provider value={{ state, setState }}>
    {/*  {children}*/}
    </TaskContext.Provider>
  );
}
