import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MobileNav from "./components/layout/MobileNav";
import Toast from "./components/ui/Toast";

export default function App() {
  return (
    <div className="flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 min-h-screen bg-gray-900">
        <Header />

        <div className="p-4 text-white">
          <h2>Content Area</h2>
        </div>
      </div>

      <MobileNav />

      <Toast />
    </div>
  );
}