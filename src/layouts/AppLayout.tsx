import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Sidebar } from '../components/common/Sidebar';
import { AITutorDrawer } from '../components/ai-tutor/AITutorDrawer';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-950 relative">
      <Header />
      <div className="flex flex-1 overflow-hidden min-w-0">
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
      <AITutorDrawer />
    </div>
  );
};
