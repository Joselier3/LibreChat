import { useGetModelsQuery } from 'librechat-data-provider/react-query';
import type { TConversation } from 'librechat-data-provider';
import type { TSetOption } from '~/common';
import { multiChatOptions } from './options';
import { useWorkspace } from '~/components/dashboardFalitech/workspaceContext';

type TGoogleProps = {
  showExamples: boolean;
  isCodeChat: boolean;
};

type TSelectProps = {
  conversation: TConversation | null;
  setOption: TSetOption;
  extraProps?: TGoogleProps;
  showAbove?: boolean;
  popover?: boolean;
};

export default function ModelSelect({
  conversation,
  setOption,
  popover = false,
  showAbove = true,
}: TSelectProps) {
  const modelsQuery = useGetModelsQuery();

  const { selectedWorkspace } = useWorkspace();

  if (!conversation?.endpoint) {
    return null;
  }

  const { endpoint: _endpoint, endpointType } = conversation;
  const models = modelsQuery.data?.[_endpoint] ?? [];
  const endpoint = endpointType ?? _endpoint;

  const currentModel = selectedWorkspace?.connections.find(connect => connect.provider ===_endpoint);

  const OptionComponent = multiChatOptions[endpoint];

  if (!OptionComponent) {
    return null;
  }
  return (
    <OptionComponent
      conversation={conversation}
      setOption={setOption}
      models={currentModel?.models || []}
      showAbove={showAbove}
      popover={popover}
    />
  );
}
