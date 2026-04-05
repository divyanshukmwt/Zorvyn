import useStore from "../../store/useStore";
import { CATEGORIES } from "../../data/mockData";
import { formatCurrency } from "../../utils/formatters";

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
      <h3 className="mb-3 text-sm font-semibold text-slate-200">
        Category Breakdown
      </h3>

      {Object.keys(categories).length === 0 ? (
        <p className="text-sm opacity-60">No expense data yet</p>
      ) : (
        <div className="flex flex-col gap-2">
          {Object.entries(categories).map(([cat, amt]) => {
            const catMeta = CATEGORIES[cat];
            const Icon = catMeta?.icon;

            return (
              <div
                key={cat}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center"
                    style={{
                      background: `${catMeta?.color || "#818CF8"}20`,
                    }}
                  >
                    {Icon && (
                      <Icon
                        size={14}
                        style={{ color: catMeta?.color }}
                      />
                    )}
                  </div>

                  <span className="text-sm text-slate-200">
                    {cat}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-300">
                  {formatCurrency(amt, { compact: true })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}