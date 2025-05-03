import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  theme: string;
  toggleTheme: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ theme, toggleTheme }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout; 