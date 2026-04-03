import useStore from "../../store/useStore";
import { getTotalIncome, getTotalExpenses } from "../../utils/calculations";
import { formatCurrency } from "../../utils/formatters";

export default function StatCard({ type }) {
  const transactions = useStore((s) => s.transactions) || [];

  const total =
    type === "income"
      ? getTotalIncome(transactions)
      : getTotalExpenses(transactions);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow text-white">
      <h3 className="text-sm opacity-70 capitalize">{type}</h3>

      <p className="text-xl font-bold mt-2">
        {formatCurrency(total)}
      </p>
    </div>
  );
}