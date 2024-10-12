import { useEffect, useState } from 'react';
import { getUserById, getWorkspaceById } from './workspacesService';
import { useAuthContext } from '~/hooks';
import { TUser } from 'librechat-data-provider/dist/types';

export const useFetchWorkspaces = () => {
  const { user } = useAuthContext();
  const [currentUser, setCurrentUser] = useState<TUser | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const fetchWorkspaces = async () => {
        try {
          const workspacesWithAvatars = await Promise.all(
            user.workspaces.map(async (workspaceId) => {
              let workspace = await getWorkspaceById(workspaceId);

              const owner = await getUserById(workspace.owner);
              const members = await Promise.all(
                workspace.members.map(async (memberId) => await getUserById(memberId)),
              );

              workspace = { ...workspace, owner, members };
              return workspace;
            }),
          );

          // Actualizar el usuario completo con todos los workspaces expandidos
          setCurrentUser({ ...user, workspaces: workspacesWithAvatars });
        } catch (error) {
          console.error('Error fetching workspaces:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchWorkspaces();
    }
  }, [user]);

  return { currentUser, isLoading };
};
