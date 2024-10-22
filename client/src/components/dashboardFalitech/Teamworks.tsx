import React, { useState } from 'react';
import Avatar from './Avatar';
import { useWorkspace } from './workspaceContext';
import { useCreateInvitation, useGetWorkspaceMembers } from './ReactQueryServices';
import TableEsqueleton from './TableEsqueleton';
import { useAuthContext } from '~/hooks';
import { useToastContext } from '~/Providers';
import { LuLoader2 } from 'react-icons/lu';
import { IoClose } from 'react-icons/io5';

export default function Teamworks() {
  const { user } = useAuthContext();
  const { selectedWorkspace } = useWorkspace();
  const { showToast } = useToastContext();
  const [invitedEmail, setInvitedEmail] = useState<string>();
  const [invitationLink, setInvitationLink] = useState<string>('');

  const { data: members, isLoading } = useGetWorkspaceMembers(selectedWorkspace?._id, user?.id);
  const { mutate, isLoading: invitationLoading } = useCreateInvitation();

  const sendInvitation = async (e) => {
    e.preventDefault();

    const invitation = {
      workspaceId: selectedWorkspace?._id,
      invitedEmail,
      userId: user?.id,
    };

    mutate(invitation, {
      onSuccess: (data) => {
        showToast({ message: data.message, status: 'success' });
        setInvitationLink(data.invitationLink);
        // console.log('Invitación creada exitosamente:', data);
      },
      onError: (error) => {
        showToast({ message: 'Ya ha enviado una invitación a este usuario', status: 'error' });
      },
    });
  };

  return (
    <section className=" w-full  p-4">
      <div className="mb-8 overflow-hidden rounded-md border shadow">
        <h2 className="p-4">Enviar invitación</h2>
        <form onSubmit={sendInvitation} name="create-workspace" className="bg-gray-50 p-4">
          <span className="block pb-2">Dirección de correo electrónico</span>
          <input
            type="email"
            onChange={(e) => setInvitedEmail(e.target.value)}
            name="email"
            className="w-full rounded-lg border p-2 focus:outline-[#0084ff]/60 "
          />
          <button
            type="submit"
            disabled={!invitedEmail || invitationLoading}
            className="mt-3 flex items-center gap-2 rounded-md border bg-[#2791d1]/80 p-2 px-5 text-white transition-all hover:bg-[#2791d1] disabled:cursor-not-allowed disabled:bg-gray-200"
          >
            {invitationLoading && <LuLoader2 className="animate-spin" />}
            Enviar invitación
          </button>
        </form>
      </div>
      {invitationLink && (
        <div className="mb-8 flex flex-col overflow-hidden rounded-md border shadow">
          <div className="flex items-center justify-between gap-1 p-2">
            <h2 className="">Enlace de invitación</h2>
            <button
              onClick={() => setInvitationLink('')}
              className="mt-2 flex items-center gap-1 rounded-md border border-[#dc3545] p-3  text-[#dc3545] transition-all hover:bg-[#dc3545] hover:text-white disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-200 disabled:text-gray-400"
              title="Eliminar area de trabajo"
            >
              <IoClose />
            </button>
          </div>
          <div className="bg-gray-50 p-4 ">
            <a
              href={invitationLink}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#0084ff]/50 hover:underline"
            >
              {invitationLink}
            </a>
          </div>
        </div>
      )}
      {isLoading && <TableEsqueleton rows={3} />}
      {!isLoading && (
        <div className="overflow-hidden rounded-md border shadow">
          <h2 className="p-4">Miembros del espacio de trabajo ({members.length})</h2>
          <div className="w-full overflow-x-auto">
            <table className="w-full overflow-x-auto border">
              <thead className="border">
                <tr className="bg-[#e6ecf0]">
                  <th></th>
                  <th className="p-3 text-left text-gray-500">Nombre</th>
                  <th className="p-3 text-left text-gray-500">Correo electrónico</th>
                  <th className="p-3 text-left text-gray-500">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y ">
                {members &&
                  members.map((member) => {
                    const isOwner = member?.rol === 'ADMIN';

                    return (
                      <tr key={member?._id}>
                        <td className="p-3">
                          <Avatar text={member?.name} />
                        </td>
                        <td className="p-3">
                          <div>{isOwner ? 'Tú' : member?.name}</div>
                        </td>
                        <td className="p-3">
                          <div>{member?.email}</div>
                        </td>
                        <td className="p-3">
                          <div>
                            <span>{isOwner ? 'Dueño' : member?.role}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
