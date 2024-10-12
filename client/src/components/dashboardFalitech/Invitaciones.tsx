/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useAcceptInvitation, useGetInvitationForUser, useRejectInvitation, useValidateInvitation } from './ReactQueryServices';
import { useToastContext } from '~/Providers';
import { useAuthContext } from '~/hooks';
import { FaCheck } from 'react-icons/fa';
import { RiCloseLargeFill } from 'react-icons/ri';
import { getInvitationForUser } from './workspacesService';
import { useQueryClient } from '@tanstack/react-query';

export default function Invitaciones() {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  // const [invitations, setInvitations]=useState([]);
  const queryClient = useQueryClient();

  const { mutate: validateInvitationMutate } = useValidateInvitation();

  const { mutate: acceptInvitationMutate } = useAcceptInvitation();

  const { mutate: rejectInvitationMutate } = useRejectInvitation();

  const { data } = useGetInvitationForUser(user?.email);

  function acceptNewInvitation({ code, mewMembers }) {
    validateInvitationMutate({ code, email: mewMembers }, {
      onSuccess({ invitation }) {
        acceptInvitationMutate({
          invitationId: invitation._id,
          userId: user?.id, // Asegúrate de que `user?.id` esté disponible aquí
        }, {
          onSuccess() {
            showToast({ message: 'Invitación aceptada', status: 'success' });
            queryClient.resetQueries();
          },
          onError() {
            queryClient.resetQueries();
            showToast({ message: 'Error al aceptar la invitación', status: 'error' });
          },
        });
      },
      onError(error) {
        console.error('Error al validar la invitación:', error);
        showToast({ message: 'Invitación no válida o ha expirado', status: 'error' });
      },
    });
  }

  function rejectInvitation({ code, mewMembers }) {
    validateInvitationMutate({ code, email: mewMembers }, {
      onSuccess({ invitation }) {
        rejectInvitationMutate(invitation._id,{
          onSuccess(data) {
            showToast({ message: data.message, status: 'success' });
            queryClient.resetQueries();
          },
        });
      },
    });
  }

  if(!data){
    return null;
  }

  return (
    <div className="mb-8 overflow-hidden rounded-md border shadow">
      <h2 className="p-4">Invitaciones pendientes</h2>
      {
        data?.invitations.map(({ code, workspaceName, ownerName, mewMembers }) => (
          <div key={code} className="bg-gray-50 p-4">

            <div className='flex items-center justify-between gap-2 flex-wrap'>
              <span>¡<strong>{ownerName}</strong> Te ha invitado a unirte al espacio de trabajo <strong> {workspaceName}</strong>!</span>
              <div className='flex items-center gap-2'>
                <button onClick={() => acceptNewInvitation({ code, mewMembers })} className="mt-2 flex items-center gap-1 rounded-md border border-[#419b45] p-3  text-[#419b45] transition-all hover:bg-[#419b45] hover:text-white" title='Eliminar area de trabajo'>
                  <FaCheck />
                </button>
                <button onClick={() => rejectInvitation({ code, mewMembers })} className="mt-2 flex items-center gap-1 rounded-md border border-[#dc3545] p-3  text-[#dc3545] transition-all hover:bg-[#dc3545] hover:text-white" title='Eliminar area de trabajo'>
                  <RiCloseLargeFill />
                </button>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}
