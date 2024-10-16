import React, { useEffect, useState } from 'react';
import Header from './header';
import { useAuthContext } from '~/hooks';
import Aside from './aside';
import { useWorkspace, WorkspaceProvider } from './workspaceContext';
import { Outlet, useLocation } from 'react-router-dom';
import RenderLink from './RenderLink';
import { MdPeopleAlt } from 'react-icons/md';
import { GrConnect } from 'react-icons/gr';
import { FaPeopleGroup } from 'react-icons/fa6';
import { IoSettingsOutline } from 'react-icons/io5';
import { useGetUserWorkspaces, useGetWorkspaceById } from './ReactQueryServices';
import { GoDiscussionClosed } from 'react-icons/go';
import PageLoader from './PageLoader';

export default function LayoutFalitech() {
  const { user } = useAuthContext();
  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const location = useLocation();

  // Obtén los workspaces del usuario
  const { data: workspaces, isLoading, error } = useGetUserWorkspaces(user?.id);
  const { data: activeWorkspace } = useGetWorkspaceById(user?.activeWorkspace);

  // const [isOwner, setIsOwner] = useState<boolean>(selectedWorkspace?.owner._id === user?.id);

  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  // const existWorkspace = workspaces?.find(x => x?._id === selectedWorkspace?._id);

  useEffect(() => {
    // Si existe un activeWorkspace, seleccionarlo automáticamente al iniciar sesión
    if (activeWorkspace && !selectedWorkspace) {
      selectWorkspace(activeWorkspace);
    }

    // Si no hay un workspace seleccionado, seleccionar el primer workspace de la lista
    if (workspaces && !selectedWorkspace) {
      selectWorkspace(workspaces[0]);
    }

  }, [activeWorkspace, workspaces, selectedWorkspace, selectWorkspace]);

  // Actualizar el isOwner cuando el workspace seleccionado cambia
  useEffect(() => {
    setIsOwner(selectedWorkspace?.owner._id === user?.id);
  }, [selectedWorkspace, user]);

  return (
    <>
      <PageLoader loader={isLoading}/>
      <main className="h-screen overflow-hidden bg-white">
        <Header user={user} workspace={workspaces} />
        <div className="flex">
          <Aside open={open} setOpen={setOpen}>
            <RenderLink open={open} text="Espacios de trabajo" href="workspaces" icon={<MdPeopleAlt size={20} />} />
            {isOwner && <RenderLink open={open} text="Integraciones" href="integrations" icon={<GrConnect size={20} />} />}
            {isOwner && <RenderLink open={open} text="Miembros" href="members" icon={<FaPeopleGroup size={20} />} />}
            {isOwner && <RenderLink open={open} text="Espacio de trabajo" href="setting" icon={<IoSettingsOutline size={20} />} />}
            {isOwner && <RenderLink open={open} text="Chats" href="chats" icon={<GoDiscussionClosed size={20} />} />}
          </Aside>
          <div className="h-[calc(100vh-4rem)] w-full overflow-auto reset-scrollbar">
            <Outlet />
          </div>
        </div>
      </main>
    </>
  );
}
