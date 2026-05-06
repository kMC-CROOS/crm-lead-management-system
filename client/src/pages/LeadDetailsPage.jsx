import { Pencil, StickyNote } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';

function LeadDetailsPage({ leads, onAddNote }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const lead = useMemo(() => leads.find((item) => item.id === id), [leads, id]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!lead) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="mb-4">Lead not found.</p>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white" onClick={() => navigate('/leads')}>
          Back to Leads
        </button>
      </section>
    );
  }

  const submit = (event) => {
    event.preventDefault();
    if (!note.trim()) {
      setError('Note is required.');
      return;
    }
    onAddNote(lead.id, note.trim());
    setNote('');
    setError('');
  };

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <article className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{lead.name}</h2>
            <p className="mt-1 text-xs text-slate-500">Created {new Date(lead.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={lead.status} />
            <Link to={`/leads/${lead.id}/edit`} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100">
              <Pencil size={14} />
              Edit
            </Link>
          </div>
        </div>
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <Info label="Company" value={lead.company} />
          <Info label="Email" value={lead.email} />
          <Info label="Phone" value={lead.phone} />
          <Info label="Source" value={lead.source} />
          <Info label="Salesperson" value={lead.salesperson} />
          <Info label="Deal Value" value={`$ ${Number(lead.dealValue).toLocaleString()}`} />
          <Info label="Last Updated" value={lead.updatedAt ? new Date(lead.updatedAt).toLocaleString() : '-'} />
        </div>
      </article>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
          <StickyNote size={18} className="text-indigo-600" />
          Notes
        </h3>
        <form onSubmit={submit} className="space-y-2">
          <textarea
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (error) setError('');
            }}
            rows={3}
            className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
            placeholder="Add a note..."
          />
          {error && <p className="text-xs text-rose-600">{error}</p>}
          <button className="w-full rounded-xl bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-500" type="submit">Add Note</button>
        </form>

        <div className="mt-4 space-y-3">
          {(lead.notes || []).map((item) => (
            <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-sm">{item.content}</p>
              <p className="mt-1 text-xs text-slate-500">
                {item.createdBy || 'Admin'} • {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
          {!lead.notes?.length && <p className="text-sm text-slate-500">No notes yet.</p>}
        </div>
      </article>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <p>
      <span className="text-slate-500">{label}: </span>
      <span className="font-medium">{value || '-'}</span>
    </p>
  );
}

export default LeadDetailsPage;
