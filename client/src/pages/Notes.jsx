import { Search, StickyNote } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

function NotesPage({ leads }) {
  const [search, setSearch] = useState('');

  const allNotes = useMemo(() => {
    const notes = leads.flatMap((lead) =>
      (lead.notes || []).map((note) => ({
        id: note.id,
        leadId: lead.id,
        leadName: lead.name,
        company: lead.company,
        content: note.content,
        createdBy: note.createdBy || 'Admin',
        createdAt: note.createdAt,
      }))
    );

    return notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [leads]);

  const filteredNotes = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return allNotes;

    return allNotes.filter((note) =>
      [note.content, note.leadName, note.company].some((value) => value?.toLowerCase().includes(key))
    );
  }, [allNotes, search]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Notes</h1>
        <p className="mt-1 text-sm text-slate-500">View and search all lead notes in one place.</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <label className="relative mb-4 block">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by note content, lead name, or company..."
            className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </label>

        {!filteredNotes.length ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-lg font-semibold text-slate-700">No notes found</p>
            <p className="mt-1 text-sm text-slate-500">Open a lead details page and add your first note.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotes.map((note) => (
              <article key={`${note.id}-${note.leadId}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{note.leadName}</p>
                    <p className="text-xs text-slate-500">{note.company}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    <StickyNote size={12} />
                    Note
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-700">{note.content}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">
                    {note.createdBy} • {new Date(note.createdAt).toLocaleString()}
                  </p>
                  <Link
                    to={`/leads/${note.leadId}`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-white hover:text-indigo-600"
                  >
                    View Lead
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default NotesPage;
