/* eslint-disable no-nested-ternary */
import { useMemo } from 'react';
import { EModelEndpoint, isAssistantsEndpoint, Constants } from 'librechat-data-provider';
import { useGetEndpointsQuery, useGetStartupConfig } from 'librechat-data-provider/react-query';
import type { ReactNode } from 'react';
import { useChatContext, useAssistantsMapContext } from '~/Providers';
import { useGetAssistantDocsQuery } from '~/data-provider';
import ConvoIcon from '~/components/Endpoints/ConvoIcon';
import { useLocalize, useSubmitMessage } from '~/hooks';
import { TooltipAnchor } from '~/components/ui';
import { BirthdayIcon } from '~/components/svg';
import { getIconEndpoint, cn } from '~/utils';
import ConvoStarter from './ConvoStarter';
import { useWorkspace } from '../dashboardFalitech/workspaceContext';

export default function Landing({ Header }: { Header?: ReactNode }) {
  const { conversation } = useChatContext();
  const assistantMap = useAssistantsMapContext();
  const { data: startupConfig } = useGetStartupConfig();
  const { data: endpointsConfig } = useGetEndpointsQuery();
  const { selectedWorkspace, selectWorkspace } = useWorkspace();

  const localize = useLocalize();

  let { endpoint = '' } = conversation ?? {};
  const { assistant_id = null } = conversation ?? {};

  if (
    endpoint === EModelEndpoint.chatGPTBrowser ||
    endpoint === EModelEndpoint.azureOpenAI ||
    endpoint === EModelEndpoint.gptPlugins
  ) {
    endpoint = EModelEndpoint.openAI;
  }

  const iconURL = conversation?.iconURL;
  endpoint = getIconEndpoint({ endpointsConfig, iconURL, endpoint });
  const { data: documentsMap = new Map() } = useGetAssistantDocsQuery(endpoint, {
    select: (data) => new Map(data.map((dbA) => [dbA.assistant_id, dbA])),
  });

  const isAssistant = isAssistantsEndpoint(endpoint);
  const assistant = isAssistant ? assistantMap?.[endpoint][assistant_id ?? ''] : undefined;
  const assistantName = assistant?.name ?? '';
  const assistantDesc = assistant?.description ?? '';
  const avatar = assistant?.metadata?.avatar ?? '';
  const conversation_starters = useMemo(() => {
    /* The user made updates, use client-side cache,  */
    if (assistant?.conversation_starters) {
      return assistant.conversation_starters;
    }
    /* If none in cache, we use the latest assistant docs */
    const assistantDocs = documentsMap.get(assistant_id ?? '');
    return assistantDocs?.conversation_starters ?? [];
  }, [documentsMap, assistant_id, assistant?.conversation_starters]);

  const containerClassName =
    'shadow-stroke relative flex h-full items-center justify-center rounded-full bg-white text-black';

  const { submitMessage } = useSubmitMessage();
  const sendConversationStarter = (text: string) => submitMessage({ text });

  return (
    <div className="relative h-full">
      <div className="absolute left-0 right-0">{Header != null ? Header : null}</div>
      <div className="flex h-full flex-col items-center justify-center">
        <div className={cn('relative h-12 w-12', assistantName && avatar ? 'mb-0' : 'mb-3')}>
          <ConvoIcon
            conversation={conversation}
            assistantMap={assistantMap}
            endpointsConfig={endpointsConfig}
            containerClassName={containerClassName}
            context="landing"
            className="h-2/3 w-2/3"
            size={41}
          />
          {startupConfig?.showBirthdayIcon === true ? (
            <TooltipAnchor
              className="absolute bottom-8 right-2.5"
              description={localize('com_ui_happy_birthday')}
            >
              <BirthdayIcon />
            </TooltipAnchor>
          ) : null}
        </div>
        {assistantName ? (
          <div className="flex flex-col items-center gap-0 p-2">
            <div className="text-center text-2xl font-medium dark:text-white">{assistantName}</div>
            <div className="max-w-md text-center text-sm font-normal text-text-primary ">
              {assistantDesc ? assistantDesc : localize('com_nav_welcome_message')}
            </div>
            {/* <div className="mt-1 flex items-center gap-1 text-token-text-tertiary">
            <div className="text-sm text-token-text-tertiary">By Daniel Avila</div>
          </div> */}
          </div>
        ) : (
          selectedWorkspace?.connections.length === 0
            ? <div className='flex flex-col items-center justify-center'>
              <h2 className="mb-5 max-w-[75vh] px-12 text-center text-lg font-medium dark:text-white md:px-0 md:text-2xl">Configura tu cuenta</h2>
              <a href="/dashboard/workspaces"  rel="noopener noreferrer" className='text-text-secondary underline'>Ir al panel</a>
            </div>
            : <h2 className="mb-5 max-w-[75vh] px-12 text-center text-lg font-medium dark:text-white md:px-0 md:text-2xl">
              {isAssistant
                ? conversation?.greeting ?? localize('com_nav_welcome_assistant')
                : conversation?.greeting ?? localize('com_nav_welcome_message')}
            </h2>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3 px-4">
          {conversation_starters.length > 0 &&
            conversation_starters
              .slice(0, Constants.MAX_CONVO_STARTERS)
              .map((text, index) => (
                <ConvoStarter
                  key={index}
                  text={text}
                  onClick={() => sendConversationStarter(text)}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
