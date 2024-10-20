/* eslint-disable max-len */
import React, { useState } from 'react';

import { Outlet } from 'react-router-dom';
import Aside from '../aside';
import RenderLink from '../RenderLink';
import { useWorkspace } from '../workspaceContext';
import { useGetWorkspaceMembers } from '../ReactQueryServices';
import Avatar from '../Avatar';
import { useAuthContext } from '~/hooks';

export default function Chats() {
  const { user } = useAuthContext();
  const [open, setOpen] = useState<boolean>(true);

  const { selectedWorkspace } = useWorkspace();

  const { data: members, isLoading, error } = useGetWorkspaceMembers(selectedWorkspace?._id, user?.id);

  return (
    <section className="flex">
      <Aside
        open={open}
        setOpen={setOpen}
        MaxAndMinWidthOpen="min-w-72 max-w-72"
        MaxAndMinWidthClose="min-w-20 max-w-20"
        buttonVisible={false}
      >
        {/* {isLoading && <p>Loading members...</p>} */}

        {error && <p>Failed to load members</p>}

        {members && members.map(({ _id, name }) => (
          <RenderLink
            key={_id}
            text={name}
            href={_id}
            icon={<Avatar text={name} loading={isLoading}/>}
            open={open}
          />
        ))}
      </Aside>

      <div className="h-[calc(100vh-4rem)] w-full overflow-auto reset-scrollbar">
        <Outlet />
      </div>
    </section>
  );
}
