import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileNav, { MobileDrawer } from './components/layout/MobileNav';
import Toast from './components/ui/Toast';
import AddTransactionModal from './components/transactions/AddTransactionModal';
import DashboardPage from './components/dashboard/DashboardPage';
import TransactionTable from './components/transactions/TransactionTable';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import WalletPage from './components/analytics/WalletPage';

import useStore from './store/useStore';
import useMockApi from './hooks/useMockApi';

function App() {
  const page = useStore((s) => s.page);
  const role = useStore((s) => s.role);
  const theme = useStore((s) => s.theme);

  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pageRef = useRef(null);
  const prevPage = useRef(page);

  const { fetchData } = useMockApi();

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Intentionally broken theme logic — fixed in Commit 12
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.remove('light');
      document.body.classList.remove('light');
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.classList.add('light');
    }
  }, [theme]);

  // Page transition
  useEffect(() => {
    if (!pageRef.current || prevPage.current === page) return;
    prevPage.current = page;

    gsap.fromTo(
      pageRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
    );
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'dashboard':
        return <DashboardPage />;
      case 'transactions':
        return <TransactionTable />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'wallet':
        return <WalletPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className={`flex min-h-screen bg-bg-dark transition-colors duration-300 ${theme === 'light' ? 'light' : ''}`}>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-[230px] min-w-0">

        {/* Header */}
        <Header
          onMenuClick={() => setDrawerOpen(true)}
          onAddTransaction={() => setModalOpen(true)}
        />

        {/* Page Content */}
        <main
          ref={pageRef}
          className="flex-1 p-5 lg:p-8 pb-24 lg:pb-8 overflow-x-hidden"
        >
          {renderPage()}
        </main>

      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Add Transaction Modal — Admin only */}
      {modalOpen && role === 'admin' && (
        <AddTransactionModal onClose={() => setModalOpen(false)} />
      )}

      {/* Toast Notifications */}
      <Toast />

    </div>
  );
}

export default App;