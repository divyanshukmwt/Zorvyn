export function getTotalIncome(transactions) {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getTotalExpenses(transactions) {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getNetBalance(transactions) {
  return getTotalIncome(transactions) - getTotalExpenses(transactions);
}

export function getSavingsRate(transactions) {
  const income = getTotalIncome(transactions);
  if (income === 0) return 0;
  const expenses = getTotalExpenses(transactions);
  return ((income - expenses) / income) * 100;
}

export function getAvgTransaction(transactions) {
  if (transactions.length === 0) return 0;
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  return total / transactions.length;
}

export function getExpensesByCategory(transactions) {
  const map = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function getTopSpendingCategory(transactions) {
  const byCategory = getExpensesByCategory(transactions);
  return byCategory.length > 0 ? byCategory[0] : null;
}

export function getTransactionsByMonth(transactions, yearMonth) {
  return transactions.filter((t) => t.date.startsWith(yearMonth));
}

export function getCurrentAndPreviousMonth() {
  const now = new Date();
  const current = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previous = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
  return { current, previous };
}

export function getPercentChange(newValue, oldValue) {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

export function getStatCardMetrics(transactions) {
  const { current, previous } = getCurrentAndPreviousMonth();

  const currTx = getTransactionsByMonth(transactions, current);
  const prevTx = getTransactionsByMonth(transactions, previous);

  const income = getTotalIncome(currTx);
  const expenses = getTotalExpenses(currTx);
  const balance = getNetBalance(transactions);

  const prevIncome = getTotalIncome(prevTx);
  const prevExpenses = getTotalExpenses(prevTx);
  const prevBalance = getNetBalance(
    transactions.filter((t) => !t.date.startsWith(current))
  );

  return {
    balance,
    income,
    expenses,
    balanceChange: getPercentChange(balance, prevBalance),
    incomeChange: getPercentChange(income, prevIncome),
    expenseChange: getPercentChange(expenses, prevExpenses),
  };
}

export function getMonthlySavingsTrend(transactions) {
  const monthMap = {};

  transactions.forEach((t) => {
    const [year, month] = t.date.split('-');
    const key = `${year}-${month}`;
    if (!monthMap[key]) {
      monthMap[key] = { income: 0, expenses: 0 };
    }
    if (t.type === 'income') monthMap[key].income += t.amount;
    else monthMap[key].expenses += t.amount;
  });

  return Object.entries(monthMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, { income, expenses }]) => {
      const [, month] = key.split('-');
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return {
        month: monthNames[parseInt(month, 10) - 1],
        savings: income - expenses,
        income,
        expenses,
      };
    });
}

export function getMonthlyAnalytics(transactions) {
  const trend = getMonthlySavingsTrend(transactions);
  if (trend.length === 0) return { best: null, worst: null, avgSavings: 0 };

  const best = trend.reduce((a, b) => (a.savings >= b.savings ? a : b));
  const worst = trend.reduce((a, b) => (a.savings <= b.savings ? a : b));
  const avgSavings = trend.reduce((sum, m) => sum + m.savings, 0) / trend.length;

  return { best, worst, avgSavings };
}
