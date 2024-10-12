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
import { useGetUserWorkspaces } from './ReactQueryServices';
import { GoDiscussionClosed } from 'react-icons/go';
import PageLoader from './PageLoader';

export default function LayoutFalitech() {
  const { user } = useAuthContext();
  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const location = useLocation();

  const { data: workspace, isLoading, error } = useGetUserWorkspaces(user?.id);

  const [isOwner, setIsOwner] = useState<boolean>(selectedWorkspace?.owner._id === user?.id);

  const [open, setOpen] = useState<boolean>(false);

  const existWorkspace = workspace?.find(x => x?._id === selectedWorkspace?._id);

  useEffect(() => {
    // console.log({ existWorkspace, isLoading, error, workspace });
    if (workspace) {
      if (existWorkspace && selectedWorkspace) {
        selectWorkspace(selectedWorkspace);
      } else {
        selectWorkspace(workspace[0]);
      }
    } if (existWorkspace && selectedWorkspace) {
      selectWorkspace(selectedWorkspace);
    }

  }, [location, existWorkspace, isLoading, error, workspace, selectedWorkspace, selectWorkspace]);

  useEffect(() => {
    setIsOwner(selectedWorkspace?.owner._id === user?.id);
  }, [selectedWorkspace, isLoading]);

  return (
    <>
      <PageLoader loader={isLoading}/>
      <main className="h-screen overflow-hidden bg-white">
        <Header user={user} workspace={workspace} />
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
