import { Content, Portal, Root } from '@radix-ui/react-popover';
import { alternateName, isAssistantsEndpoint } from 'librechat-data-provider';
import { useGetEndpointsQuery } from 'librechat-data-provider/react-query';
import { useEffect, type FC } from 'react';
import { useChatContext, useAssistantsMapContext } from '~/Providers';
import EndpointItems from './Endpoints/MenuItems';
import TitleButton from './UI/TitleButton';
import { mapEndpoints } from '~/utils';
import { useWorkspace } from '~/components/dashboardFalitech/workspaceContext';
import { useGetUserWorkspaces, useSelectActiveWorkspace } from '~/components/dashboardFalitech/ReactQueryServices';
import { useAuthContext } from '~/hooks';
import { GoCheckCircleFill } from 'react-icons/go';
import Avatar from '~/components/dashboardFalitech/Avatar';
import { IoIosSettings } from 'react-icons/io';
import {  useLocation } from 'react-router-dom';

const SelectWorkspaces: FC = () => {
  const { user } = useAuthContext();
  const { data: workspace, isLoading  } = useGetUserWorkspaces(user?.id);
  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const { mutate } = useSelectActiveWorkspace();
  const location = useLocation();

  const existWorkspace = workspace?.find(x => x?._id === selectedWorkspace?._id);

  useEffect(()=>{
    if (workspace) {
      if (existWorkspace && selectedWorkspace) {
        selectWorkspace(selectedWorkspace);
      } else {
        selectWorkspace(workspace[0]);
      }
    } if (existWorkspace && selectedWorkspace) {
      selectWorkspace(selectedWorkspace);
    }
  },[location, workspace]);

  const { conversation } = useChatContext();
  const { endpoint = '', assistant_id = null } = conversation ?? {};
  const assistantMap = useAssistantsMapContext();

  const assistant =
    isAssistantsEndpoint(endpoint) && assistantMap?.[endpoint ?? '']?.[assistant_id ?? ''];
  const assistantName = (assistant && assistant.name) || 'Assistant';

  if (!endpoint) {
    console.warn('No endpoint selected');
    return null;
  }

  const primaryText = assistant ? assistantName : (alternateName[endpoint] ?? endpoint ?? '') + ' ';

  const handlerChangeWorkspace = (workspace) => {
    mutate({ userId: user?.id, workspaceId: workspace?._id },{
      onSuccess(data) {
        // console.log(data);
      },
      onError(error){
        // console.log(error);
      },
    });
    selectWorkspace(workspace);
  };

  const handlerSettingWorkspace = (workspace) => {
    handlerChangeWorkspace(workspace);
    console.log('ir a configuracion de:', workspace.name);
    window.location.href='/dashboard/workspaces';
  };

  if(isLoading){
    return null;
  }

  return (
    <Root>
      <TitleButton primaryText={selectedWorkspace?.name + ' '} />
      <Portal>
        <div
          style={{
            position: 'fixed',
            left: '0px',
            top: '0px',
            transform: 'translate3d(268px, 50px, 0px)',
            minWidth: 'max-content',
            zIndex: 'auto',
          }}
        >
          <Content
            side="bottom"
            align="start"
            className="mt-2 max-h-[65vh] min-w-[340px] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-700 dark:text-white lg:max-h-[75vh]"
          >
            <div className='flex flex-col gap-1'>
              {
                workspace && workspace.map(workspace => {
                  const isCurrentWorkspace = selectedWorkspace?._id === workspace?._id;
                  const isAdminWorkspace = workspace.owner._id === user?.id;
                  return (
                    <div key={workspace._id} className='group m-1.5 flex max-h-[40px] cursor-pointer gap-2 rounded px-5 py-2.5 !pr-3 text-sm !opacity-100 hover:bg-surface-hover radix-disabled:pointer-events-none radix-disabled:opacity-50'>
                      <button onClick={() => handlerChangeWorkspace(workspace)} className='flex grow items-center justify-between gap-2'>
                        <div className='flex gap-2'>
                          <Avatar text={workspace.name} size='w-6 h-6 text-[10px]'/>
                          <span>{workspace.name}</span>
                        </div>
                        <div className='flex items-center gap-2 group-hover:hidden'>
                          {isCurrentWorkspace && <GoCheckCircleFill color='#fff' />}
                        </div>
                      </button>
                      {isAdminWorkspace && (
                        <button onClick={()=>handlerSettingWorkspace(workspace)} className='items-center gap-2 hidden group-hover:flex '>
                          <span>Setting</span>
                          <IoIosSettings color='#fff' />
                        </button>
                      )}
                    </div>
                  );
                })
              }
            </div>
          </Content>
        </div>
      </Portal>
    </Root>
  );
};

export default SelectWorkspaces;
