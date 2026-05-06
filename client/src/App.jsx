import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import LeadDetailsPage from './pages/LeadDetailsPage';
import LeadFormPage from './pages/LeadFormPage';
import LeadsPage from './pages/LeadsPage';
import LoginPage from './pages/LoginPage';
import NotesPage from './pages/Notes';
import ReportsPage from './pages/Reports';
import SettingsPage from './pages/Settings';
import UsersPage from './pages/Users';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { addNote, createLead, deleteLead, getLeads, updateLead } from './lib/storage';
import { getCurrentUser } from './lib/auth';
import { useMemo, useState } from 'react';

function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [leads, setLeads] = useState(getLeads());

  const sortedLeads = useMemo(
    () => [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [leads]
  );

  const onCreateLead = (payload) => {
    createLead(payload);
    setLeads(getLeads());
  };

  const onUpdateLead = (id, payload) => {
    updateLead(id, payload);
    setLeads(getLeads());
  };

  const onDeleteLead = (id) => {
    deleteLead(id);
    setLeads(getLeads());
  };

  const onAddNote = (leadId, content) => {
    addNote(leadId, content);
    setLeads(getLeads());
  };

  const appShell = (child) => <Layout user={user} onLogout={() => setUser(null)}>{child}</Layout>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={setUser} />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage onLogin={setUser} />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/dashboard" replace /> : <ForgotPasswordPage />} />

      <Route
        path="/dashboard"
        element={<ProtectedRoute>{appShell(<DashboardPage leads={sortedLeads} />)}</ProtectedRoute>}
      />
      <Route
        path="/leads"
        element={<ProtectedRoute>{appShell(<LeadsPage leads={sortedLeads} onDelete={onDeleteLead} />)}</ProtectedRoute>}
      />
      <Route
        path="/leads/new"
        element={<ProtectedRoute>{appShell(<LeadFormPage leads={sortedLeads} onCreate={onCreateLead} onUpdate={onUpdateLead} />)}</ProtectedRoute>}
      />
      <Route
        path="/leads/:id/edit"
        element={<ProtectedRoute>{appShell(<LeadFormPage leads={sortedLeads} onCreate={onCreateLead} onUpdate={onUpdateLead} />)}</ProtectedRoute>}
      />
      <Route
        path="/leads/:id"
        element={<ProtectedRoute>{appShell(<LeadDetailsPage leads={sortedLeads} onAddNote={onAddNote} />)}</ProtectedRoute>}
      />
      <Route
        path="/notes"
        element={<ProtectedRoute>{appShell(<NotesPage leads={sortedLeads} />)}</ProtectedRoute>}
      />
      <Route
        path="/users"
        element={<ProtectedRoute>{appShell(<UsersPage leads={sortedLeads} />)}</ProtectedRoute>}
      />
      <Route
        path="/reports"
        element={<ProtectedRoute>{appShell(<ReportsPage leads={sortedLeads} />)}</ProtectedRoute>}
      />
      <Route
        path="/settings"
        element={<ProtectedRoute>{appShell(<SettingsPage user={user} onLogout={() => setUser(null)} onUpdateUser={setUser} />)}</ProtectedRoute>}
      />

      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
