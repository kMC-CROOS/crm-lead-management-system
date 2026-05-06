import { Eye, Pencil, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

function LeadsPage({ leads, onDelete }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All Status');
  const [source, setSource] = useState('All Sources');
  const [salesperson, setSalesperson] = useState('All Salespeople');
  const [page, setPage] = useState(1);
  const perPage = 6;

  const statuses = useMemo(() => ['All Status', ...new Set(leads.map((lead) => lead.status))], [leads]);
  const sources = useMemo(() => ['All Sources', ...new Set(leads.map((lead) => lead.source))], [leads]);
  const salespeople = useMemo(() => ['All Salespeople', ...new Set(leads.map((lead) => lead.salesperson).filter(Boolean))], [leads]);

  const filtered = leads.filter((lead) => {
    const key = search.trim().toLowerCase();
    const matchesSearch = !key || [lead.name, lead.company, lead.email].some((value) => value.toLowerCase().includes(key));
    const matchesStatus = status === 'All Status' || lead.status === status;
    const matchesSource = source === 'All Sources' || lead.source === source;
    const matchesSalesperson = salesperson === 'All Salespeople' || lead.salesperson === salesperson;
    return matchesSearch && matchesStatus && matchesSource && matchesSalesperson;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const pagedLeads = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const resetFilters = () => {
    setSearch('');
    setStatus('All Status');
    setSource('All Sources');
    setSalesperson('All Salespeople');
    setPage(1);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Recent Leads</h2>
        <Link to="/leads/new" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
          + Add Lead
        </Link>
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-6">
        <label className="relative lg:col-span-2">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search leads by name, company or email..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          {statuses.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          {sources.map((option) => <option key={option}>{option}</option>)}
        </select>
        <select
          value={salesperson}
          onChange={(e) => {
            setSalesperson(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        >
          {salespeople.map((option) => <option key={option}>{option}</option>)}
        </select>
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Reset Filters
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-100 text-slate-500">
            <tr>
              <th className="p-3">Lead Name</th><th className="p-3">Company</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Status</th><th className="p-3">Source</th><th className="p-3">Salesperson</th><th className="p-3">Deal Value</th><th className="p-3">Created At</th><th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pagedLeads.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-100">
                <td className="p-3 font-medium">{lead.name}</td>
                <td className="p-3">{lead.company}</td>
                <td className="p-3">{lead.email}</td>
                <td className="p-3">{lead.phone}</td>
                <td className="p-3"><StatusBadge status={lead.status} /></td>
                <td className="p-3">{lead.source}</td>
                <td className="p-3">{lead.salesperson}</td>
                <td className="p-3">$ {Number(lead.dealValue).toLocaleString()}</td>
                <td className="p-3">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Link to={`/leads/${lead.id}`} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600" aria-label="View lead">
                      <Eye size={16} />
                    </Link>
                    <Link to={`/leads/${lead.id}/edit`} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600" aria-label="Edit lead">
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => onDelete(lead.id)} className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600" aria-label="Delete lead">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!pagedLeads.length && (
              <tr>
                <td className="p-8 text-center text-sm text-slate-500" colSpan={10}>
                  No leads found for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-sm">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[1, 2, 3].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setPage(num)}
            className={`rounded-lg px-3 py-1.5 ${currentPage === num ? 'bg-indigo-600 text-white' : 'border border-slate-200 text-slate-600'}`}
            disabled={num > totalPages}
          >
            {num}
          </button>
        ))}
        <span className="px-1 text-slate-400">...</span>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default LeadsPage;
