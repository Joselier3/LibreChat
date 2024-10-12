import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { getConfigDefaults, PermissionTypes, Permissions } from 'librechat-data-provider';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import type { ContextType } from '~/common';
import { EndpointsMenu, ModelSpecsMenu, PresetsMenu, HeaderNewChat } from './Menus';
import ExportAndShareMenu from './ExportAndShareMenu';
import { useMediaQuery, useHasAccess } from '~/hooks';
import HeaderOptions from './Input/HeaderOptions';
import BookmarkMenu from './Menus/BookmarkMenu';
import AddMultiConvo from './AddMultiConvo';
import SelectWorkspaces from './Menus/SelectWorkspace';
import { useWorkspace } from '../dashboardFalitech/workspaceContext';

const defaultInterface = getConfigDefaults().interface;

export default function Header() {

  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const { data: startupConfig } = useGetStartupConfig();
  const { navVisible } = useOutletContext<ContextType>();
  const modelSpecs = useMemo(() => startupConfig?.modelSpecs?.list ?? [], [startupConfig]);
  const interfaceConfig = useMemo(
    () => startupConfig?.interface ?? defaultInterface,
    [startupConfig],
  );

  const hasAccessToBookmarks = useHasAccess({
    permissionType: PermissionTypes.BOOKMARKS,
    permission: Permissions.USE,
  });

  const hasAccessToMultiConvo = useHasAccess({
    permissionType: PermissionTypes.MULTI_CONVO,
    permission: Permissions.USE,
  });

  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  return (
    <div className="sticky top-0 z-10 flex h-14 w-full items-center justify-between bg-white p-2 font-semibold dark:bg-gray-800 dark:text-white">
      <div className="hide-scrollbar flex w-full items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2">
          {!navVisible && <HeaderNewChat />}
          {/* muestra el menu de IAs y si hay un asistente seleccionado muestra el assistente */}
          <SelectWorkspaces />
          {(selectedWorkspace?.connections.length && interfaceConfig.endpointsMenu === true) ? <EndpointsMenu /> : null}
          {/* {modelSpecs.length > 0 && <ModelSpecsMenu modelSpecs={modelSpecs} />} */}
          {/* muestra la configuracion prestablecida de la IA y permite cambiar de asistente  */}
          {selectedWorkspace?.connections.length ? <HeaderOptions interfaceConfig={interfaceConfig} /> : null}
          {(selectedWorkspace?.connections.length && interfaceConfig.presets === true) ? <PresetsMenu /> : null}
          {(selectedWorkspace?.connections.length && hasAccessToBookmarks === true) ? <BookmarkMenu /> : null}
          {(selectedWorkspace?.connections.length && hasAccessToMultiConvo === true) ? <AddMultiConvo /> : null}
          {isSmallScreen && (
            <ExportAndShareMenu
              isSharedButtonEnabled={startupConfig?.sharedLinksEnabled ?? false}
            />
          )}
        </div>
        {!isSmallScreen && (
          <ExportAndShareMenu isSharedButtonEnabled={startupConfig?.sharedLinksEnabled ?? false} />
        )}
      </div>
      {/* Empty div for spacing */}
      <div />
    </div>
  );
}
