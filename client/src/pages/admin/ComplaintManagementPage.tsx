import React, { useState, useEffect } from 'react';
import { complaintsApi } from '../../services/api.js';
import { Complaint } from '../../types/index.js';
import { Modal } from '../../components/common/Modal.js';
import {
  MessageSquareWarning,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Send,
  AlertTriangle,
  User,
} from 'lucide-react';

const STATUS_LIST = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved'];
const CATEGORY_LIST = [
  'All',
  'Food Quality',
  'Hygiene',
  'Quantity',
  'Temperature',
  'Foreign Object',
  'Late Serving',
  'Menu Repetition',
  'Other',
];
const PRIORITY_LIST = ['All', 'Low', 'Medium', 'High', 'Critical'];

export const ComplaintManagementPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Resolution Modal State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<string>('In Progress');
  const [newPriority, setNewPriority] = useState<string>('Medium');
  const [adminResponse, setAdminResponse] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    loadComplaints();
  }, [selectedStatus, selectedCategory, selectedPriority, searchQuery]);

  const loadComplaints = async () => {
    setIsLoading(true);
    try {
      const res = await complaintsApi.getAllComplaints({
        status: selectedStatus,
        category: selectedCategory,
        priority: selectedPriority,
        search: searchQuery || undefined,
      });
      if (res.data.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openResolutionModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNewPriority(complaint.priority);
    setAdminResponse(complaint.adminResponse || '');
  };

  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setIsUpdating(true);
    try {
      await complaintsApi.updateComplaintStatus(selectedComplaint._id, {
        status: newStatus,
        priority: newPriority,
        adminResponse: adminResponse.trim(),
      });
      setSuccessMsg(`Complaint #${selectedComplaint._id.slice(-6).toUpperCase()} updated successfully.`);
      setSelectedComplaint(null);
      await loadComplaints();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Under Review':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <MessageSquareWarning className="w-7 h-7 text-emerald-600" />
          <span>Student Complaint Resolution Hub</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review grievances, adjust priorities, issue official corrective actions, and resolve student complaints.
        </p>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {successMsg}
          </span>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Status Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Status Filter
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {STATUS_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Category Filter
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {CATEGORY_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Priority Filter
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {PRIORITY_LIST.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Search Text
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-base">
            Complaints Queue ({complaints.length})
          </h3>
          <span className="text-xs text-slate-400">
            Click "Action" on any row to respond or resolve
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Student / Hostel</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading complaints queue...
                  </td>
                </tr>
              ) : complaints.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No complaints found matching selected filters
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-extrabold text-slate-900">
                      #{c._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{c.category}</td>
                    <td className="py-3 px-4">
                      {c.anonymous ? (
                        <span className="inline-flex items-center gap-1 text-slate-500 font-semibold text-[11px]">
                          <Shield className="w-3 h-3 text-slate-400" /> Anonymous
                        </span>
                      ) : (
                        <div>
                          <p className="font-bold text-slate-900">{c.userId?.name || 'Student'}</p>
                          <span className="text-[10px] text-slate-400">
                            {c.userId?.hostel || 'Hostel'} (Rm {c.userId?.room || '—'})
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getPriorityBadge(
                          c.priority
                        )}`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusBadge(
                          c.status
                        )}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                      {c.description}
                    </td>
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => openResolutionModal(c)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
                      >
                        Respond / Resolve
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complaint Resolution Modal */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Complaint #${selectedComplaint._id.slice(-6).toUpperCase()}`}
          subtitle={`Category: ${selectedComplaint.category} • Reported on ${new Date(
            selectedComplaint.createdAt
          ).toLocaleString()}`}
          maxWidth="xl"
        >
          <form onSubmit={handleUpdateComplaint} className="space-y-5">
            {/* Student details & description */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Student: {selectedComplaint.anonymous ? 'Anonymous Resident' : selectedComplaint.userId?.name}
                </span>
                <span className="text-slate-500 font-medium">
                  {selectedComplaint.userId?.hostel} (Room {selectedComplaint.userId?.room || '—'})
                </span>
              </div>
              <p className="text-xs text-slate-800 leading-relaxed pt-1">
                "{selectedComplaint.description}"
              </p>
              {selectedComplaint.imageUrl && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Student Attached Photo:
                  </span>
                  <img
                    src={selectedComplaint.imageUrl}
                    alt="Proof"
                    className="w-44 h-32 object-cover rounded-xl border border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Status & Priority select */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Update Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Priority Level
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            {/* Admin Response Note */}
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Official Admin Action / Resolution Response
              </label>
              <textarea
                rows={3}
                required
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder="Explain action taken (e.g. Kitchen inspected, vendor warned, batch replaced, oven calibrated)..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                This response will immediately notify the student and appear in their tracking timeline.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isUpdating ? 'Saving...' : 'Update & Notify Student'}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
