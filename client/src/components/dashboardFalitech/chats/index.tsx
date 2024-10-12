/* eslint-disable max-len */
import React, { useState } from 'react';

import { Outlet } from 'react-router-dom';
import Aside from '../aside';
import RenderLink from '../RenderLink';
import { useWorkspace } from '../workspaceContext';
import { useGetWorkspaceMembers } from '../ReactQueryServices';
import Avatar from '../Avatar';

export default function Chats() {
  const [open, setOpen] = useState<boolean>(true);

  const { selectedWorkspace } = useWorkspace();

  const { data: members, isLoading } = useGetWorkspaceMembers(selectedWorkspace?._id);

  return (
    <>
      <section className='flex'>
        <Aside open={true} setOpen={setOpen} MaxAndMinWidthOpen='min-w-72 max-w-72' MaxAndMinWidthClose='min-w-20 max-w-20' buttonVisible={false} >
          {
            members && members.map(member => (
              <RenderLink key={member._id} text={member.name} href={member._id}
                icon={<Avatar text={member.name} />} open={true} />
            ))
          }
        </Aside>
        <div className="h-[calc(100vh-4rem)] w-full overflow-auto reset-scrollbar">
          <Outlet />
        </div>
      </section>
    </>
  );
}
