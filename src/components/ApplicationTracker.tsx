import React, { useState, useMemo } from 'react';
import {
  KanbanSquare,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Mail,
  Edit2,
  Trash2,
  Send,
  X,
  FileSpreadsheet,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { ApplicationRecord, ApplicationStatus, ApplicationRoute } from '../types';
import {
  addApplication,
  updateApplication,
  deleteApplication,
  exportApplicationsToCSV,
  exportBackupJSON,
  calculateFollowUps
} from '../utils/storage';

interface ApplicationTrackerProps {
  applications: ApplicationRecord[];
  onRefreshApplications: () => void;
  onOpenEmailStudioWithApp?: (app: ApplicationRecord) => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({
  applications,
  onRefreshApplications,
  onOpenEmailStudioWithApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingApp, setEditingApp] = useState<ApplicationRecord | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // New application form state
  const initialFormState: Omit<ApplicationRecord, 'id' | 'createdAt' | 'updatedAt'> = {
    name: '',
    institution: '',
    researchArea: '',
    contactEmail: '',
    sourceLink: '',
    applicationRoute: 'direct_email',
    status: 'Shortlisted',
    appliedDate: '',
    lastContactDate: new Date().toISOString().split('T')[0],
    nextAction: 'Prepare email draft',
    nextActionDate: '',
    followUpCount: 0,
    deadline: '',
    notes: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Follow-up calculations
  const followUpSummary = useMemo(() => calculateFollowUps(applications), [applications]);

  // Filtered applications
  const filteredApps = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return applications.filter((app) => {
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;
      if (!q) return true;
      return (
        app.name.toLowerCase().includes(q) ||
        app.institution.toLowerCase().includes(q) ||
        app.researchArea.toLowerCase().includes(q) ||
        app.contactEmail.toLowerCase().includes(q) ||
        app.notes.toLowerCase().includes(q)
      );
    });
  }, [applications, searchQuery, statusFilter]);

  const allStatuses: ApplicationStatus[] = [
    'Shortlisted',
    'Reading their work',
    'Draft ready',
    'Applied',
    'Follow-up sent',
    'Replied',
    'Interview',
    'Offer',
    'Closed',
  ];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.institution.trim()) {
      alert('Please provide at least a recipient/lab name and institution.');
      return;
    }

    addApplication(formData);
    onRefreshApplications();
    setShowAddModal(false);
    setFormData(initialFormState);
    setNotification(`Added "${formData.name}" to your tracker.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingApp) return;

    updateApplication(editingApp.id, editingApp);
    onRefreshApplications();
    setEditingApp(null);
    setNotification(`Updated details for "${editingApp.name}".`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete application "${name}"?`)) {
      deleteApplication(id);
      onRefreshApplications();
      setNotification(`Removed "${name}" from applications.`);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // Helper to quickly log a follow-up
  const handleLogFollowUpSent = (app: ApplicationRecord) => {
    const today = new Date();
    const nextReminder = new Date();
    nextReminder.setDate(today.getDate() + 8); // 8 days default

    const updated = updateApplication(app.id, {
      status: 'Follow-up sent',
      lastContactDate: today.toISOString().split('T')[0],
      followUpCount: (app.followUpCount || 0) + 1,
      nextAction: 'Check for reply or close opportunity',
      nextActionDate: nextReminder.toISOString().split('T')[0],
    });

    onRefreshApplications();
    setNotification(`Follow-up logged for ${app.name}. Next reminder set for ${nextReminder.toISOString().split('T')[0]}.`);
    setTimeout(() => setNotification(null), 3500);
  };

  // Dismiss reminder
  const handleDismissReminder = (app: ApplicationRecord) => {
    updateApplication(app.id, {
      nextActionDate: '',
      nextAction: 'Reminder dismissed',
    });
    onRefreshApplications();
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const styles: Record<ApplicationStatus, string> = {
      Shortlisted: 'bg-stone-hover text-ink-secondary border-stone-line',
      'Reading their work': 'bg-blue-50 text-blue-800 border-blue-200',
      'Draft ready': 'bg-purple-50 text-purple-800 border-purple-200',
      Applied: 'bg-amber-50 text-amber-800 border-amber-200',
      'Follow-up sent': 'bg-orange-50 text-orange-800 border-orange-200',
      Replied: 'bg-teal-50 text-teal-800 border-teal-200',
      Interview: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
      Offer: 'bg-green-100 text-green-900 border-green-300 font-bold',
      Closed: 'bg-stone-100 text-ink-muted border-stone-200',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border font-mono ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-line">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-serif-title font-semibold text-ink-primary">
              My Applications
            </h2>
            <span className="wispr-pill bg-teal-50 text-teal-800 border-teal-200 text-[11px] font-mono">
              {applications.length} Tracked
            </span>
          </div>
          <p className="text-xs text-ink-secondary mt-1">
            <strong>Your tracker is saved in this browser.</strong> Export a backup to CSV or JSON if you want to keep it elsewhere.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportApplicationsToCSV(applications)}
            disabled={applications.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-line bg-white hover:bg-stone-hover text-xs font-medium text-ink-secondary shadow-subtle transition-all cursor-pointer disabled:opacity-40"
            title="Export CSV (with formula injection escaping)"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="text-xs py-2 px-3.5 bg-teal-50 border border-teal-200 text-teal-900 rounded-lg flex items-center justify-between shadow-subtle animate-fade-in">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="font-bold text-teal-700 ml-2">×</button>
        </div>
      )}

      {/* Due Follow-ups Alert Banner */}
      {followUpSummary.dueTodayOrOverdue.length > 0 && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4 shadow-subtle space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <h4 className="font-semibold text-xs text-amber-950 font-serif-title">
              Follow-ups Due Today ({followUpSummary.dueTodayOrOverdue.length} pending)
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {followUpSummary.dueTodayOrOverdue.map((item) => (
              <div
                key={item.id}
                className="p-2.5 bg-white/95 rounded-lg border border-amber-200 flex items-center justify-between gap-2 shadow-subtle"
              >
                <div>
                  <span className="font-semibold text-ink-primary block truncate max-w-[200px]">
                    {item.name} ({item.institution})
                  </span>
                  <span className="text-[10px] text-amber-800 block">
                    Last contact: {item.lastContactDate || 'Initial email'} • Count: {item.followUpCount}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleLogFollowUpSent(item)}
                    className="px-2 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-medium shadow-subtle cursor-pointer"
                    title="Mark follow-up email as sent and schedule next check"
                  >
                    Log Sent
                  </button>
                  <button
                    onClick={() => handleDismissReminder(item)}
                    className="p-1 text-ink-muted hover:text-ink-primary rounded text-[10px]"
                    title="Dismiss reminder"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Status Filters */}
      <div className="bg-white rounded-xl border border-stone-line p-3.5 shadow-subtle flex flex-col sm:flex-row gap-3 items-center justify-between text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-ink-muted absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by faculty, lab, notes..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-ink-muted shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-line bg-[#FAF8F5] text-xs outline-none"
          >
            <option value="all">All Statuses ({applications.length})</option>
            {allStatuses.map((s) => (
              <option key={s} value={s}>
                {s} ({applications.filter((a) => a.status === s).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Table / Cards */}
      {filteredApps.length === 0 ? (
        <div className="rounded-xl border border-stone-line bg-white p-12 text-center space-y-3">
          <KanbanSquare className="w-10 h-10 text-ink-faint mx-auto stroke-1" />
          <h3 className="text-base font-serif-title font-semibold text-ink-primary">
            No applications recorded yet
          </h3>
          <p className="text-xs text-ink-muted max-w-md mx-auto">
            Browse the Faculty Directory, DRDO Directory, or ISRO Directory to shortlist labs and add them directly to this tracker.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-medium rounded-lg shadow-sm cursor-pointer"
          >
            Add First Application
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-line overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-stone-line text-ink-secondary font-mono text-[11px]">
                <tr>
                  <th className="py-3 px-4">Faculty / Lab Name</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Last Contact</th>
                  <th className="py-3 px-4">Next Action / Due</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-line/70">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-stone-hover/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-ink-primary">
                        {app.name}
                      </div>
                      <span className="text-[11px] text-ink-muted block">
                        {app.institution} • {app.researchArea.slice(0, 45)}...
                      </span>
                      {app.contactEmail && (
                        <span className="text-[10px] font-mono text-ink-faint block mt-0.5">
                          {app.contactEmail}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-[11px] text-ink-secondary capitalize">
                        {app.applicationRoute.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-ink-muted">
                      {app.lastContactDate || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="text-ink-primary font-medium block">
                          {app.nextAction || '—'}
                        </span>
                        {app.nextActionDate && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 inline-block font-mono">
                            Due: {app.nextActionDate}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {['Applied', 'Follow-up sent'].includes(app.status) && (
                          <button
                            onClick={() => handleLogFollowUpSent(app)}
                            className="p-1.5 text-teal-700 hover:bg-teal-50 rounded"
                            title="Log follow-up email sent"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingApp(app)}
                          className="p-1.5 text-ink-muted hover:text-ink-primary rounded"
                          title="Edit application details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(app.id, app.name)}
                          className="p-1.5 text-ink-muted hover:text-red-700 rounded"
                          title="Delete application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-line max-w-xl w-full p-6 shadow-float space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-line">
              <h3 className="text-base font-serif-title font-semibold text-ink-primary">
                Add Research Application
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-ink-muted hover:text-ink-primary text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Faculty / Lab Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Prof. A. Tiwari or CAIR Lab"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Institution / Org *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. IIT Bombay / DRDO / ISRO URSC"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Research Area
                  </label>
                  <input
                    type="text"
                    value={formData.researchArea}
                    onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
                    placeholder="e.g. Computer Vision, Robotics"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="prof@iiti.ac.in"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Current Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ApplicationStatus })}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] text-xs outline-none"
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Application Route
                  </label>
                  <select
                    value={formData.applicationRoute}
                    onChange={(e) => setFormData({ ...formData, applicationRoute: e.target.value as ApplicationRoute })}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] text-xs outline-none"
                  >
                    <option value="direct_email">Direct Faculty Email</option>
                    <option value="formal_portal">Formal Institutional Portal</option>
                    <option value="official_notice">Official Circular / Notice</option>
                    <option value="lab_inquiry">General Lab Process Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Next Action
                  </label>
                  <input
                    type="text"
                    value={formData.nextAction}
                    onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
                    placeholder="e.g. Follow-up reminder"
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                    Next Action Date (Reminder)
                  </label>
                  <input
                    type="date"
                    value={formData.nextActionDate}
                    onChange={(e) => setFormData({ ...formData, nextActionDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                  Notes / Source URL
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Record paper title, specific requirements, or lab contact instructions..."
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] focus:bg-white text-xs outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded border border-stone-line text-ink-secondary hover:bg-stone-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-medium"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Application Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-primary/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-stone-line max-w-xl w-full p-6 shadow-float space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-line">
              <h3 className="text-base font-serif-title font-semibold text-ink-primary">
                Edit Record: {editingApp.name}
              </h3>
              <button
                onClick={() => setEditingApp(null)}
                className="text-ink-muted hover:text-ink-primary text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Status</label>
                  <select
                    value={editingApp.status}
                    onChange={(e) => setEditingApp({ ...editingApp, status: e.target.value as ApplicationStatus })}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] text-xs outline-none"
                  >
                    {allStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Follow-up Count</label>
                  <input
                    type="number"
                    value={editingApp.followUpCount}
                    onChange={(e) => setEditingApp({ ...editingApp, followUpCount: Number(e.target.value) })}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Next Action</label>
                  <input
                    type="text"
                    value={editingApp.nextAction}
                    onChange={(e) => setEditingApp({ ...editingApp, nextAction: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-ink-muted mb-1">Reminder Date</label>
                  <input
                    type="date"
                    value={editingApp.nextActionDate}
                    onChange={(e) => setEditingApp({ ...editingApp, nextActionDate: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] text-xs outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-ink-muted mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={editingApp.notes}
                  onChange={(e) => setEditingApp({ ...editingApp, notes: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded border border-stone-line bg-[#FAF8F5] text-xs outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-line flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-3 py-1.5 rounded border border-stone-line text-ink-secondary hover:bg-stone-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-medium"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
