import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import useStore from './store/useStore';
import useMockApi from './hooks/useMockApi';

import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileNav, { MobileDrawer } from './components/layout/MobileNav';
import Toast from './components/ui/Toast';
import AddTransactionModal from './components/transactions/AddTransactionModal';

import DashboardPage from './components/dashboard/DashboardPage';
import TransactionTable from './components/transactions/TransactionTable';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import WalletPage from './components/analytics/WalletPage';

const PAGE_COMPONENTS = {
  dashboard: DashboardPage,
  transactions: TransactionTable,
  analytics: AnalyticsPage,
  wallet: WalletPage,
};

function PageContainer({ page }) {
  const contentRef = useRef(null);
  const prevPage = useRef(page);

  useEffect(() => {
    if (!contentRef.current) return;
    if (prevPage.current !== page) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
      prevPage.current = page;
    } else {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  }, [page]);

  const ActivePage = PAGE_COMPONENTS[page] || DashboardPage;

  return (
    <div ref={contentRef} className="min-h-[60vh]">
      <ActivePage />
    </div>
  );
}

function App() {
  const theme = useStore((s) => s.theme);
  const page = useStore((s) => s.page);
  const role = useStore((s) => s.role);

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [theme]);

  const { fetchData } = useMockApi();
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen transition-colors duration-300 bg-bg w-screen">
      <Sidebar />

      <MobileDrawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[230px] min-h-screen">
        <Header
          onMenuClick={() => setMobileDrawerOpen(true)}
          onAddTransaction={() => setShowModal(true)}
        />

        <main className="flex-1 p-5 lg:p-8 pb-24 lg:pb-8">
          <PageContainer page={page} />
        </main>
      </div>

      <MobileNav />

      {showModal && role === 'admin' && (
        <AddTransactionModal onClose={() => setShowModal(false)} />
      )}

      <Toast />
    </div>
  );
}

export default App;