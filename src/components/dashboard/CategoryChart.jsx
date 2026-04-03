import useStore from "../../store/useStore";

export default function CategoryChart() {
  const transactions = useStore((s) => s.transactions) || [];

  const categories = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      categories[t.category] =
        (categories[t.category] || 0) + t.amount;
    }
  });

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-white">
      <h3 className="mb-2">Category Breakdown</h3>

      {Object.keys(categories).length === 0 ? (
        <p className="text-sm opacity-60">No expense data yet</p>
      ) : (
        Object.entries(categories).map(([cat, amt]) => (
          <div key={cat} className="flex justify-between">
            <span>{cat}</span>
            <span>{amt}</span>
          </div>
        ))
      )}
    </div>
  );
}