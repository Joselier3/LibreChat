import type { FC } from 'react';
import { Close } from '@radix-ui/react-popover';
import { EModelEndpoint, alternateName } from 'librechat-data-provider';
import { useGetEndpointsQuery } from 'librechat-data-provider/react-query';
import MenuSeparator from '../UI/MenuSeparator';
import { getEndpointField } from '~/utils';
import MenuItem from './MenuItem';
import { useWorkspace } from '~/components/dashboardFalitech/workspaceContext';

const EndpointItems: FC<{
  endpoints: EModelEndpoint[];
  selected: EModelEndpoint | '';
}> = ({ endpoints, selected }) => {
  const { selectedWorkspace, selectWorkspace } = useWorkspace();
  const { data: endpointsConfig } = useGetEndpointsQuery();

  const ProviderConnection = selectedWorkspace?.connections.map(conn => conn.provider);
  // console.log(endpoints);

  return (
    <>
      {ProviderConnection &&
        ProviderConnection.map((endpoint, i) => {
          if (!endpoint) {
            return null;
          } else if (!endpointsConfig?.[endpoint]) {
            return null;
          }
          const userProvidesKey: boolean | null | undefined = getEndpointField(
            endpointsConfig,
            endpoint,
            'userProvide',
          );
          return (
            <Close asChild key={`endpoint-${endpoint}`}>
              <div key={`endpoint-${endpoint}`}>
                <MenuItem
                  key={`endpoint-item-${endpoint}`}
                  title={alternateName[endpoint] || endpoint}
                  value={endpoint}
                  selected={selected === endpoint}
                  data-testid={`endpoint-item-${endpoint}`}
                  userProvidesKey={!!userProvidesKey}
                  // description="With DALL·E, browsing and analysis"
                />
                {i !== endpoints.length - 1 && <MenuSeparator />}
              </div>
            </Close>
          );
        })}
    </>
  );
};

export default EndpointItems;