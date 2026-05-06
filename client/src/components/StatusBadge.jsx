function StatusBadge({ status }) {
  const map = {
    New: 'bg-blue-100 text-blue-700',
    Contacted: 'bg-yellow-100 text-yellow-700',
    Qualified: 'bg-green-100 text-green-700',
    Won: 'bg-emerald-100 text-emerald-700',
    Lost: 'bg-red-100 text-red-700',
    'Proposal Sent': 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
