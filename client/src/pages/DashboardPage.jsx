import {
  BadgeDollarSign,
  CalendarDays,
  CheckCheck,
  CircleX,
  Handshake,
  Sparkles,
  UserPlus,
  Users,
  ChevronDown
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

function DashboardPage({ leads }) {
  const [dateFilter, setDateFilter] = useState('This Week');
  const [dateOpen, setDateOpen] = useState(false);

  const dateString = useMemo(() => {
    const today = new Date();
    const format = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    if (dateFilter === 'Today') {
      return format(today);
    } else if (dateFilter === 'This Month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return `${format(start)} - ${format(end)}`;
    } else {
      const start = new Date(today);
      start.setDate(today.getDate() - today.getDay());
      const end = new Date(today);
      end.setDate(today.getDate() - today.getDay() + 6);
      return `${format(start)} - ${format(end)}`;
    }
  }, [dateFilter]);

  const stats = useMemo(() => {
    const total = leads.length;
    const newLeads = leads.filter((lead) => lead.status === 'New').length;
    const qualified = leads.filter((lead) => lead.status === 'Qualified').length;
    const won = leads.filter((lead) => lead.status === 'Won').length;
    const lost = leads.filter((lead) => lead.status === 'Lost').length;
    const totalValue = leads.reduce((sum, lead) => sum + Number(lead.dealValue || 0), 0);
    const wonValue = leads
      .filter((lead) => lead.status === 'Won')
      .reduce((sum, lead) => sum + Number(lead.dealValue || 0), 0);

    return { total, newLeads, qualified, won, lost, totalValue, wonValue };
  }, [leads]);

  const recent = leads.slice(0, 5);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Admin 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening with your leads today.</p>
        </div>
        <div className="relative">
          <button onClick={() => setDateOpen(!dateOpen)} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
            <CalendarDays size={16} className="text-slate-400" />
            {dateString}
            <ChevronDown size={14} className="text-slate-400 ml-1" />
          </button>
          
          {dateOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDateOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg z-20">
                {['Today', 'This Week', 'This Month'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => { setDateFilter(f); setDateOpen(false); }} 
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${dateFilter === f ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <Card label="Total Leads" value={stats.total} trend="↑ 12% from last week" icon={Users} />
        <Card label="New Leads" value={stats.newLeads} trend="↑ 8% from last week" icon={UserPlus} />
        <Card label="Qualified Leads" value={stats.qualified} trend="↑ 15% from last week" icon={Sparkles} />
        <Card label="Won Leads" value={stats.won} trend="↑ 6% from last week" icon={Handshake} />
        <Card label="Lost Leads" value={stats.lost} trend="↓ 4% from last week" icon={CircleX} negative />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card label="Total Estimated Deal Value" value={`$ ${stats.totalValue.toLocaleString()}`} trend="↑ 14% from last week" icon={BadgeDollarSign} />
        <Card label="Total Value of Won Deals" value={`$ ${stats.wonValue.toLocaleString()}`} trend="↑ 9% from last week" icon={CheckCheck} />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Leads</h2>
          <Link to="/leads/new" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500">
            + Add Lead
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 text-slate-500">
              <tr>
                <th className="p-3">Lead Name</th><th className="p-3">Company</th><th className="p-3">Email</th><th className="p-3">Status</th><th className="p-3">Deal Value</th><th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100">
                  <td className="p-3 font-medium">{lead.name}</td>
                  <td className="p-3">{lead.company}</td>
                  <td className="p-3">{lead.email}</td>
                  <td className="p-3"><StatusBadge status={lead.status} /></td>
                  <td className="p-3">$ {Number(lead.dealValue).toLocaleString()}</td>
                  <td className="p-3"><Link className="text-indigo-600 hover:underline" to={`/leads/${lead.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Card({ label, value, trend, icon: Icon, negative = false }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon size={18} />
        </span>
      </div>
      <p className={`mt-3 text-xs font-semibold ${negative ? 'text-rose-500' : 'text-emerald-600'}`}>{trend}</p>
    </article>
  );
}

export default DashboardPage;
