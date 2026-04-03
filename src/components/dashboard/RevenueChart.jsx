import useStore from "../../store/useStore";

export default function RevenueChart() {
  const transactions = useStore((s) => s.transactions) || [];

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h3 className="mb-2">Revenue Overview</h3>

      <p>Total Transactions: {transactions.length}</p>

      <p className="text-sm opacity-70 mt-2">
        Charts coming soon...
      </p>
    </div>
  );
}