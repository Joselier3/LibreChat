import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserById, getWorkspaceById, createWorkspace, updateWorkspace, deleteWorkspace, getAvatar, getUserWorkspaces, getWorkspaceMembers, createInvitation, validateInvitation, acceptInvitation, getInvitationForUser, rejectInvitationApiCall, leaveWorkspace, createConnectionApiCall, getWorkspaceConnection, updateConnectionApiCall, getAllConversationForUser } from './workspacesService';

// Hook para obtener un usuario por ID
export const useGetUserById = (userId) => {
  return useQuery(['user', userId], () => getUserById(userId), {
    enabled: !!userId, // Solo se ejecuta si userId existe
  });
};

// Hook para obtener un workspace por ID
export const useGetWorkspaceById = (workspaceId) => {
  return useQuery(['workspace', workspaceId], () => getWorkspaceById(workspaceId), {
    enabled: !!workspaceId,
  });
};

// Hook para obtener los workspaces de un usuario
export const useGetUserWorkspaces = (userId) => {
  return useQuery(['userWorkspaces', userId], () => getUserWorkspaces(userId), {
    enabled: !!userId, // Ejecutar solo si hay un userId
  });
};

// Hook para crear un nuevo workspace
export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation(createWorkspace, {
    onSuccess: () => {
      queryClient.invalidateQueries(['currentWorkspace']);
      queryClient.invalidateQueries(['userWorkspaces']);
    },
  });
};

// Hook para eliminar un workspace
export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteWorkspace, {
    onSuccess: () => {
      queryClient.invalidateQueries(['currentWorkspace']);
      queryClient.invalidateQueries(['userWorkspaces']);
    },
  });
};

// Hook para obtener los miembros de un workspace
export const useGetWorkspaceMembers = (workspaceId) => {
  return useQuery(['workspaceMembers', workspaceId], () => getWorkspaceMembers(workspaceId), {
    enabled: !!workspaceId, // Ejecutar solo si hay un workspaceId
  });
};

// Hook para actualizar un workspace
export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  return useMutation(updateWorkspace, {
    onSuccess: () => {
      queryClient.invalidateQueries(['currentWorkspace']);
      queryClient.invalidateQueries(['userWorkspaces']);
    },
  });
};

// Hook para obtener el avatar de un workspace
export const useGetAvatar = (workspaceId) => {
  return useQuery(['workspace', workspaceId, 'avatar'], () => getAvatar(workspaceId), {
    enabled: !!workspaceId,
  });
};

// Hook para crear una invitación
export const useCreateInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation(createInvitation, {
    onSuccess: () => {
      queryClient.invalidateQueries(['invitations']);
      queryClient.invalidateQueries(['userWorkspaces']);
    },
  });
};

// Hook para validar una invitación
export const useValidateInvitation = () => {
  return useMutation(validateInvitation);
};

// Hook para validar una invitación
export const useGetInvitationForUser = (id) => {
  return useQuery(['userInvitations'], () => getInvitationForUser(id), {
    enabled: !!id,
  });
};

// Hook para aceptar una invitación
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation(acceptInvitation, {
    onSuccess: (_, { invitationId }) => {
      // Actualizar la cache manualmente para eliminar la invitación aceptada
      queryClient.setQueryData(['userInvitations'], (oldData) => {
        if (!oldData) { return oldData; }

        return {
          ...oldData,
          invitations: oldData.invitations.filter((inv) => inv._id !== invitationId), // Remueve la invitación aceptada
        };
      });

      // Invalidar la query de workspaces para actualizar la lista de workspaces
      queryClient.invalidateQueries(['userWorkspaces', invitationId]);
    },
  });
};

export const useRejectInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation(rejectInvitationApiCall, {
    onSuccess: (_, { invitationId }) => {
      // Actualiza el contexto para eliminar la invitación rechazada
      acceptInvitation(invitationId);

      // Invalidar queries si es necesario (por ejemplo, si se muestran invitaciones en otras partes)
      queryClient.invalidateQueries(['userInvitations']);
    },
  });
};

export const useLeaveInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation(leaveWorkspace, {
    onSuccess() {
      queryClient.invalidateQueries(['userInvitations']);
    },
  });
};

export const useWorkspaceCreateConnection = () => {
  const queryClient = useQueryClient();

  return useMutation(createConnectionApiCall,{
    onSuccess(){
      queryClient.invalidateQueries(['connections']);
    },
  });
};

export const useWorkspaceUpdateConnection = () => {
  const queryClient = useQueryClient();

  return useMutation(updateConnectionApiCall,{
    onSuccess(){
      queryClient.invalidateQueries(['connections']);
    },
  });
};

export const useGetWorkspaceConnection = ({ workspaceId, userId, provider }) => {
  return useQuery(
    ['connections', workspaceId, provider], // Las claves para identificar esta consulta
    () => getWorkspaceConnection({ workspaceId, userId, provider }), // La función que obtiene los datos
    {
      enabled: !!workspaceId && !!userId && !!provider, // Solo ejecuta si estos valores existen
    },
  );
};

// Hook para obtener el avatar de un workspace
export const useGetAllConversationForUser = (userId, ownerId) => {
  return useQuery(['conversation', userId, ownerId], () => getAllConversationForUser(userId,ownerId), {
    enabled: !!userId || !!ownerId,
  });
};
