import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

// Dashboard
import StatCard from "./components/dashboard/StatCard";
import CategoryChart from "./components/dashboard/CategoryChart";

// Transactions
import TransactionTable from "./components/transactions/TransactionTable";
import TransactionForm from "./components/transactions/TransactionForm";
import TransactionFilters from "./components/transactions/TransactionFilters";

import useStore from "./store/useStore";

export default function App() {
  const page = useStore((s) => s.page);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1">
        <Header />

        <div className="p-4">

          {/* 🔥 PAGE SWITCHING */}
          {page === "dashboard" && (
            <>
              <h1>Dashboard</h1>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <StatCard type="income" />
                <StatCard type="expense" />
              </div>

              <div className="mt-4">
                <CategoryChart />
              </div>
            </>
          )}

          {page === "transactions" && (
            <>
              <h1>Transactions</h1>

              <TransactionFilters />

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <TransactionForm />
                <TransactionTable />
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}