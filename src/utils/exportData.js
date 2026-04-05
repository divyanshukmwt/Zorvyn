const CSV_HEADERS = ['ID', 'Date', 'Description', 'Amount', 'Type', 'Category'];

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportCSV(transactions) {
  const rows = transactions.map((t) => {
    const amount = t.type === 'expense' ? `-${t.amount}` : `${t.amount}`;
    const desc = `"${t.desc.replace(/"/g, '""')}"`;
    return [t.id, t.date, desc, amount, t.type, t.category].join(',');
  });

  const csvContent = [CSV_HEADERS.join(','), ...rows].join('\n');
  const timestamp = new Date().toISOString().split('T')[0];
  triggerDownload(csvContent, `Zorvyn-transactions-${timestamp}.csv`, 'text/csv');
}

export function exportJSON(transactions) {
  const jsonContent = JSON.stringify(
    {
      exported_at: new Date().toISOString(),
      total_transactions: transactions.length,
      transactions,
    },
    null,
    2
  );
  const timestamp = new Date().toISOString().split('T')[0];
  triggerDownload(jsonContent, `Zorvyn-transactions-${timestamp}.json`, 'application/json');
}
