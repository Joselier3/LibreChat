import { TUser } from 'librechat-data-provider/dist/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useGetUserWorkspaces, useGetWorkspaceById } from './ReactQueryServices';
import { useAuthContext } from '~/hooks';

// Define los tipos para el Workspace y el contexto
export interface Workspace {
  connections: Record<string, string>[]
  createdAt?: string
  members: TUser[]
  name: string
  owner: TUser
  __v: number
  _id: string
  [key: string]: unknown; // Puedes agregar más propiedades específicas del workspace
}

interface WorkspaceContextProps {
  selectedWorkspace: Workspace | null;
  selectWorkspace: (workspace: Workspace | null) => void;
}

// Crear el contexto con un valor por defecto vacío
const WorkspaceContext = createContext<WorkspaceContextProps | undefined>(undefined);

// Proveedor de Workspace
export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {

  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(() => {
    const storedWorkspace = localStorage.getItem('workspace');
    return storedWorkspace ? JSON.parse(storedWorkspace) : null;
  });

  useEffect(() => {
    if (selectedWorkspace) {
      localStorage.setItem('workspace', JSON.stringify(selectedWorkspace));
    } else {
      localStorage.removeItem('workspace');
    }
  }, [selectedWorkspace]);

  const selectWorkspace = (workspace: Workspace | null) => {
    setSelectedWorkspace(workspace);
  };

  return (
    <WorkspaceContext.Provider value={{ selectedWorkspace, selectWorkspace }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

// Hook para usar el contexto
export const useWorkspace = (): WorkspaceContextProps => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
