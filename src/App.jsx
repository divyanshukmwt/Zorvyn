import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import StatCard from "./components/dashboard/StatCard";
import CategoryChart from "./components/dashboard/CategoryChart";

export default function App() {
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
          <h1>Dashboard Working ✅</h1>

          {/* Stat Cards */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <StatCard type="income" />
            <StatCard type="expense" />
          </div>

          {/* 👇 YAHAN ADD KARNA HAI */}
          <div className="mt-4">
            <CategoryChart />
          </div>

        </div>
      </div>
    </div>
  );
}