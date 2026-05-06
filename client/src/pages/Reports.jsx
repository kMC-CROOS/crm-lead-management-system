import { useState, useMemo, useEffect } from 'react';
import { BarChart3, CircleDollarSign, PieChart, Scale, Plus, Search, Edit2, Trash2, Eye, X, Check, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultReports = [
  { id: '1', name: 'Weekly Lead Summary', type: 'Lead Summary', dateRange: 'This Week', description: 'Overview of all leads added this week.', createdBy: 'Admin', createdAt: new Date().toISOString() },
  { id: '2', name: 'Monthly Sales Performance', type: 'Sales Performance', dateRange: 'This Month', description: 'Total won deals and revenue.', createdBy: 'Admin', createdAt: new Date().toISOString() },
  { id: '3', name: 'Lead Source Analysis', type: 'Lead Source Analysis', dateRange: 'This Year', description: 'Where our best leads come from.', createdBy: 'Admin', createdAt: new Date().toISOString() }
];

function ReportsPage({ leads }) {
  const [reports, setReports] = useState(() => {
    const saved = localStorage.getItem('crm_reports');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('crm_reports', JSON.stringify(defaultReports));
    return defaultReports;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReportId, setEditingReportId] = useState(null);
  const [viewingReport, setViewingReport] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', type: 'Lead Summary', dateRange: 'This Month', description: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('crm_reports', JSON.stringify(reports));
  }, [reports]);

  // Calculations for summary cards
  const { totalValue, wonValue, lostValue, wonCount, lostCount, byStatus, bySource } = useMemo(() => {
    let tv = 0, wv = 0, lv = 0, wc = 0, lc = 0;
    const stat = {}, src = {};
    leads.forEach(l => {
      const val = Number(l.dealValue) || 0;
      tv += val;
      if (l.status === 'Won') { wv += val; wc++; }
      if (l.status === 'Lost') { lv += val; lc++; }
      stat[l.status] = (stat[l.status] || 0) + 1;
      src[l.source] = (src[l.source] || 0) + 1;
    });
    return { totalValue: tv, wonValue: wv, lostValue: lv, wonCount: wc, lostCount: lc, byStatus: stat, bySource: src };
  }, [leads]);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === 'All' || r.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [reports, searchQuery, typeFilter]);

  const openModal = (report = null) => {
    setFormErrors({});
    if (report) {
      setEditingReportId(report.id);
      setFormData({ name: report.name, type: report.type, dateRange: report.dateRange, description: report.description });
    } else {
      setEditingReportId(null);
      setFormData({ name: '', type: 'Lead Summary', dateRange: 'This Month', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.dateRange) errors.dateRange = 'Date range is required';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    if (editingReportId) {
      setReports(prev => prev.map(r => r.id === editingReportId ? { ...r, ...formData } : r));
    } else {
      setReports(prev => [{
        id: crypto.randomUUID(),
        ...formData,
        createdBy: 'Admin',
        createdAt: new Date().toISOString()
      }, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(prev => prev.filter(r => r.id !== id));
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Live insights and saved reports.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 active:scale-95"
        >
          <Plus size={18} /> Create Report
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Total Deal Value</p>
          <p className="text-2xl font-bold text-slate-900">${totalValue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Won Deal Value</p>
          <p className="text-2xl font-bold text-emerald-600">${wonValue.toLocaleString()}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Total Leads</p>
          <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-1">Conversion Rate</p>
          <p className="text-2xl font-bold text-indigo-600">{leads.length ? Math.round((wonCount / leads.length) * 100) : 0}%</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-4 sm:flex sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text" placeholder="Search reports..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="rounded-xl border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm outline-none focus:border-indigo-500 cursor-pointer">
              <option value="All">All Types</option>
              <option value="Lead Summary">Lead Summary</option>
              <option value="Sales Performance">Sales Performance</option>
              <option value="Lead Source Analysis">Lead Source Analysis</option>
              <option value="Salesperson Performance">Salesperson Performance</option>
              <option value="Won/Lost Analysis">Won/Lost Analysis</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-4">Report Name</th>
                <th className="px-6 py-4">Report Type</th>
                <th className="px-6 py-4">Date Range</th>
                <th className="px-6 py-4">Created By</th>
                <th className="px-6 py-4">Created Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map(report => (
                <tr key={report.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-semibold text-slate-900">{report.name}</td>
                  <td className="px-6 py-4"><span className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium">{report.type}</span></td>
                  <td className="px-6 py-4 text-slate-600">{report.dateRange}</td>
                  <td className="px-6 py-4 text-slate-600">{report.createdBy}</td>
                  <td className="px-6 py-4 text-slate-600">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setViewingReport(report)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Eye size={16} /></button>
                      <button onClick={() => openModal(report)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(report.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">No reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h3 className="text-lg font-bold text-slate-900">{editingReportId ? 'Edit Report' : 'Create Report'}</h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Report Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500" placeholder="e.g. Q3 Lead Performance" />
                  {formErrors.name && <p className="text-xs text-rose-500 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Report Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500">
                    <option value="Lead Summary">Lead Summary</option>
                    <option value="Sales Performance">Sales Performance</option>
                    <option value="Lead Source Analysis">Lead Source Analysis</option>
                    <option value="Salesperson Performance">Salesperson Performance</option>
                    <option value="Won/Lost Analysis">Won/Lost Analysis</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Date Range</label>
                  <select value={formData.dateRange} onChange={e => setFormData({...formData, dateRange: e.target.value})} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500">
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                    <option value="This Month">This Month</option>
                    <option value="This Year">This Year</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">Description (Optional)</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-sm outline-none focus:border-indigo-500" placeholder="Brief description of the report's purpose"></textarea>
                </div>
                <div className="pt-4 flex gap-3 justify-end">
                  <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-2"><Check size={16}/> Save Report</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {viewingReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-lg rounded-2xl bg-white shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><FileText size={20} /></div>
                  <h3 className="text-lg font-bold text-slate-900">{viewingReport.name}</h3>
                </div>
                <button onClick={() => setViewingReport(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="p-6">
                <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-slate-500 block mb-1">Type</span><span className="font-semibold text-slate-900">{viewingReport.type}</span></div>
                  <div><span className="text-slate-500 block mb-1">Date Range</span><span className="font-semibold text-slate-900">{viewingReport.dateRange}</span></div>
                  <div className="col-span-2"><span className="text-slate-500 block mb-1">Description</span><span className="text-slate-700">{viewingReport.description || 'No description provided.'}</span></div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-semibold text-slate-900 mb-3">Live Data Preview</h4>
                  
                  {viewingReport.type === 'Lead Source Analysis' && (
                    <div className="space-y-2">
                      {Object.entries(bySource).map(([src, count]) => (
                        <div key={src} className="flex justify-between text-sm"><span className="text-slate-600">{src}</span><span className="font-semibold">{count}</span></div>
                      ))}
                    </div>
                  )}
                  
                  {viewingReport.type === 'Won/Lost Analysis' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-slate-600">Won Leads</span><span className="font-bold text-emerald-600">{wonCount} (${wonValue.toLocaleString()})</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-600">Lost Leads</span><span className="font-bold text-rose-600">{lostCount} (${lostValue.toLocaleString()})</span></div>
                    </div>
                  )}

                  {viewingReport.type === 'Sales Performance' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-slate-600">Total Deals</span><span className="font-semibold">{leads.length}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-600">Total Pipeline Value</span><span className="font-semibold">${totalValue.toLocaleString()}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-slate-600">Conversion Rate</span><span className="font-semibold">{leads.length ? Math.round((wonCount / leads.length) * 100) : 0}%</span></div>
                    </div>
                  )}

                  {viewingReport.type === 'Salesperson Performance' && (
                    <div className="space-y-2">
                       {/* Mocking salesperson distribution from leads */}
                       {Object.entries(leads.reduce((acc, l) => { acc[l.salesperson] = (acc[l.salesperson] || 0) + 1; return acc; }, {})).map(([sp, count]) => (
                         <div key={sp} className="flex justify-between text-sm"><span className="text-slate-600">{sp}</span><span className="font-semibold">{count}</span></div>
                       ))}
                    </div>
                  )}

                  {viewingReport.type === 'Lead Summary' && (
                    <div className="space-y-2">
                       {Object.entries(byStatus).map(([st, count]) => (
                         <div key={st} className="flex justify-between text-sm"><span className="text-slate-600">{st}</span><span className="font-semibold">{count}</span></div>
                       ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}

export default ReportsPage;
