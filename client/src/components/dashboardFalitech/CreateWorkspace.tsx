/* eslint-disable max-len */
import React, { useState } from 'react';
import Avatar from './Avatar';
import { IoSettingsOutline, IoClose } from 'react-icons/io5';
import TableEsqueleton from './TableEsqueleton';
import { useWorkspace } from './workspaceContext';
import {
  useCreateWorkspace,
  useDeleteWorkspace,
  useGetUserWorkspaces,
  useLeaveInvitation,
} from './ReactQueryServices';
import { useAuthContext } from '~/hooks';
import { LuLoader2 } from 'react-icons/lu';
import { RxExit } from 'react-icons/rx';
import { useToastContext } from '~/Providers';
import Invitaciones from './Invitaciones';

export default function CreateWorkspace() {
  const { user } = useAuthContext();
  const { showToast } = useToastContext();
  const { selectedWorkspace, selectWorkspace } = useWorkspace();

  const [workspaceName, setWorkspaceName] = useState<string>('');

  const deleteWorkspace = useDeleteWorkspace();

  // Hook para crear un nuevo workspace
  const { mutate, isLoading } = useCreateWorkspace();

  const { data: workspace, refetch } = useGetUserWorkspaces(user?.id);

  //Salir de area de trabajo
  const leaveWorkspace = useLeaveInvitation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (workspaceName) {
      mutate(
        {
          name: workspaceName,
          owner: user?.id,
          members: user?.id,
        },
        {
          onSuccess() {
            showToast({ message: '¡Área de trabajo creada exitosamente!', status: 'success' });
            refetch();
            setWorkspaceName('');
          },
        },
      );
    }
  };

  return (
    <section className="w-full p-4">
      <div className="mb-8 overflow-hidden rounded-md border shadow">
        <h2 className="p-4">Crear espacio de trabajo</h2>
        <form onSubmit={handleSubmit} name="create-workspace" className="bg-gray-50 p-4">
          <label htmlFor="workspace_name" className="block pb-2">
            Nombre del espacio de trabajo
          </label>
          <input
            onChange={(e) => setWorkspaceName(e.target.value)}
            type="text"
            value={workspaceName}
            className="w-full rounded-lg border p-2 focus:outline-[#0084ff]/60 "
          />
          <button
            type="submit"
            disabled={!workspaceName || isLoading}
            className="mt-3 flex items-center gap-2 rounded-md border bg-[#2791d1]/80 p-2 px-5 text-white transition-all hover:bg-[#2791d1] disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isLoading && <LuLoader2 className="animate-spin" />}
            Crear
          </button>
        </form>
      </div>

      <Invitaciones />

      {isLoading && <TableEsqueleton rows={4} />}
      {!isLoading && (
        <div className="overflow-hidden rounded-md border shadow">
          <h2 className="p-4">Espacios de trabajo actuales</h2>
          <div className="reset-scrollbar w-full overflow-x-auto whitespace-nowrap">
            <table className="w-full overflow-x-auto border">
              <thead className="border">
                <tr className="bg-[#e6ecf0]">
                  <th></th>
                  {/* <th className="p-3 text-left text-gray-500">ID</th> */}
                  <th className="p-3 text-left text-gray-500">Nombre</th>
                  <th className="p-3 text-left text-gray-500">Dueño</th>
                  <th className="p-3 text-left text-gray-500">Role</th>
                  <th className="p-3 text-left text-gray-500">&nbsp;</th>
                </tr>
              </thead>
              <tbody className="divide-y ">
                {workspace &&
                  workspace.map((workspace) => {
                    const isOwner = workspace?.owner._id === user?.id;
                    const isCurrentWorkspace = selectedWorkspace?._id === workspace._id;

                    return (
                      <tr key={workspace?._id}>
                        <td className="p-3">
                          <Avatar text={workspace?.name} />
                        </td>
                        <td className="p-3">
                          <div>{workspace?.name}</div>
                        </td>
                        <td className="p-3">
                          <div>
                            <span>{isOwner ? 'Tú' : workspace?.owner?.name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="badge badge-light">
                            {isOwner ? (
                              <span>Dueño</span>
                            ) : (
                              <span className="rounded-md bg-[#2791d1] p-1 px-2 text-sm text-white">
                                Member
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => selectWorkspace(workspace)}
                            disabled={isCurrentWorkspace}
                            className="mt-2 flex items-center gap-1 rounded-md border border-[#2791d1] p-2  text-[#2791d1] transition-all hover:bg-[#2791d1] hover:text-white disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-200 disabled:text-gray-400"
                          >
                            <IoSettingsOutline />
                            Abrir
                          </button>
                          {isOwner && (
                            <button
                              onClick={() => deleteWorkspace.mutate(workspace?._id)}
                              disabled={isCurrentWorkspace}
                              className="mt-2 flex items-center gap-1 rounded-md border border-[#dc3545] p-3  text-[#dc3545] transition-all hover:bg-[#dc3545] hover:text-white disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-200 disabled:text-gray-400"
                              title="Eliminar area de trabajo"
                            >
                              <IoClose />
                            </button>
                          )}
                          {!isOwner && (
                            <button
                              type="button"
                              onClick={() =>
                                leaveWorkspace.mutate(
                                  {
                                    workspaceId: workspace?._id,
                                    userId: user?.id,
                                  },
                                  {
                                    onSuccess() {
                                      refetch();
                                    },
                                  },
                                )
                              }
                              disabled={isCurrentWorkspace}
                              className="mt-2 flex items-center gap-1 rounded-md border border-[#ffc107] p-3 text-[#ffc107] transition-all hover:bg-[#ffc107] hover:text-white disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-200 disabled:text-gray-400"
                              title="salir del area de trabajo"
                            >
                              <RxExit />
                            </button>
                          )}
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
