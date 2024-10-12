import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import {
  Login,
  Registration,
  RequestPasswordReset,
  ResetPassword,
  VerifyEmail,
  ApiErrorWatcher,
} from '~/components/Auth';
import { AuthContextProvider } from '~/hooks/AuthContext';
import StartupLayout from './Layouts/Startup';
import LoginLayout from './Layouts/Login';
import dashboardRoutes from './Dashboard';
import ShareRoute from './ShareRoute';
import ChatRoute from './ChatRoute';
import Search from './Search';
import Root from './Root';
import DashboardFalitech from '../components/dashboardFalitech';
import CreateWorkspace from '~/components/dashboardFalitech/CreateWorkspace';
import RootFalitech from '~/components/dashboardFalitech/RootFalitech';
import Teamworks from '~/components/dashboardFalitech/Teamworks';
import Profile from '~/components/dashboardFalitech/Profile';
import EditWorkspace from '~/components/dashboardFalitech/EditWorkspace';
import Integrations from '~/components/dashboardFalitech/Integrations';
import Chats from '~/components/dashboardFalitech/chats';
import OpenAI from '~/components/dashboardFalitech/Integrations/OpenAI';
import Assistants from '~/components/dashboardFalitech/Integrations/Assistants';
import DetailsChats from '~/components/dashboardFalitech/chats/DetailsChats';

const AuthLayout = () => (
  <AuthContextProvider>
    <Outlet />
    <ApiErrorWatcher />
  </AuthContextProvider>
);

export const router = createBrowserRouter([
  {
    path: 'share/:shareId',
    element: <ShareRoute />,
  },
  {
    path: '/',
    element: <StartupLayout />,
    children: [
      {
        path: 'register',
        element: <Registration />,
      },
      {
        path: 'forgot-password',
        element: <RequestPasswordReset />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: 'verify',
    element: <VerifyEmail />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/',
        element: <LoginLayout />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
        ],
      },
      dashboardRoutes,
      {
        path: '/',
        element: <Root />,
        children: [
          {
            index: true,
            element: <Navigate to="/c/new" replace={true} />,
          },
          {
            path: 'c/:conversationId?',
            element: <ChatRoute />,
          },
          {
            path: 'search',
            element: <Search />,
          },
        ],
      },
      {
        path: 'dashboard',
        element: <RootFalitech />,
        children: [
          {
            index: true,
            element: <Navigate to="workspaces" replace={true} />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'workspaces',
            element: <CreateWorkspace />,
          },
          {
            path: 'chats',
            element: <Chats />,
            children: [
              {
                path: ':chatId',
                element: <DetailsChats />,
              },
            ],
          },
          {
            path: 'integrations',
            element: <Integrations />,
            children: [
              {
                index: true,
                path: 'openai',
                element: <OpenAI />,
              },
              {
                path: 'assistants',
                element: <Assistants />,
              },
            ],
          },
          {
            path: 'members',
            element: <Teamworks />,
          },
          {
            path: 'setting',
            element: <EditWorkspace />,
          },
        ],
      },
    ],
  },
]);
