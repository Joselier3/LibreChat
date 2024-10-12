import React from 'react';
import LayoutFalitech from './Layout';
import { WorkspaceProvider } from './workspaceContext';

export default function RootFalitech() {
  return (
    <WorkspaceProvider>
      <LayoutFalitech />
    </WorkspaceProvider>
  );
}
