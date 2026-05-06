import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const defaultForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  source: 'Website',
  salesperson: '',
  status: 'New',
  dealValue: 0,
};

function LeadFormPage({ leads, onCreate, onUpdate }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const existing = useMemo(() => leads.find((lead) => lead.id === id), [id, leads]);
  const isEdit = Boolean(id);
  const [form, setForm] = useState(existing || defaultForm);
  const [errors, setErrors] = useState({});

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.company.trim()) next.company = 'Company is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Valid email is required';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    if (!form.salesperson.trim()) next.salesperson = 'Salesperson is required';
    if (Number(form.dealValue) < 0) next.dealValue = 'Deal value must be positive';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    if (isEdit) {
      onUpdate(id, form);
    } else {
      onCreate(form);
    }

    navigate('/leads');
  };

  return (
    <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Lead' : 'Add New Lead'}</h2>
      <p className="mt-1 text-sm text-slate-500">
        {isEdit ? 'Update lead details and keep records accurate.' : 'Create a new sales lead and assign it to a salesperson.'}
      </p>
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <Field label="Name" value={form.name} onChange={(v) => setField('name', v)} error={errors.name} />
        <Field label="Company" value={form.company} onChange={(v) => setField('company', v)} error={errors.company} />
        <Field label="Email" type="email" value={form.email} onChange={(v) => setField('email', v)} error={errors.email} />
        <Field label="Phone" value={form.phone} onChange={(v) => setField('phone', v)} error={errors.phone} />
        <Field label="Source" value={form.source} onChange={(v) => setField('source', v)} />
        <Field label="Salesperson" value={form.salesperson} onChange={(v) => setField('salesperson', v)} error={errors.salesperson} />

        <label className="space-y-1 text-sm font-medium text-slate-700">
          Status
          <select value={form.status} onChange={(e) => setField('status', e.target.value)} className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
            <option>New</option><option>Contacted</option><option>Qualified</option><option>Proposal Sent</option><option>Won</option><option>Lost</option>
          </select>
        </label>

        <Field label="Deal Value" type="number" value={form.dealValue} onChange={(v) => setField('dealValue', v)} error={errors.dealValue} />

        <div className="mt-2 flex gap-3 md:col-span-2">
          <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 font-medium text-white transition hover:opacity-95" type="submit">
            {isEdit ? 'Update Lead' : 'Create Lead'}
          </button>
          <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50" type="button" onClick={() => navigate('/leads')}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({ label, value, onChange, type = 'text', error }) {
  return (
    <label className="space-y-1 text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-4 py-2.5 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
      />
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </label>
  );
}

export default LeadFormPage;
