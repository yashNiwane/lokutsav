'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Lock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Database,
  Users,
  Activity,
  Award,
  Video,
  Image as ImageIcon,
  Copy,
  Check,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from 'lucide-react';

type TableKey = 'participants' | 'leads' | 'evaluations' | 'events';

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Table & View State
  const [activeTable, setActiveTable] = useState<TableKey>('participants');
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Modals & Actions
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const [newFormData, setNewFormData] = useState<any>({
    fullName: '',
    phone: '',
    email: '',
    district: 'Pune',
    city: '',
    address: '',
    category: 'HOUSEHOLD',
    idolType: 'SHADU_MATI_CLAY',
    themeTitle: '',
    themeDescription: '',
    photoUrls: [],
    videoUrl: '',
    paymentStatus: 'COMPLETED',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Remember login in session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('lokutsav_admin_pass');
      if (saved) {
        setPasscode(saved);
        verifyAndFetch(saved, activeTable, 1, search, sortBy, sortOrder, paymentFilter);
      }
    }
  }, []);

  const verifyAndFetch = async (
    pass: string,
    table: TableKey = activeTable,
    p: number = page,
    s: string = search,
    sb: string = sortBy,
    so: 'asc' | 'desc' = sortOrder,
    payFilter: string = paymentFilter
  ) => {
    if (!pass) return;
    setLoading(true);
    setAuthError('');

    try {
      const params = new URLSearchParams({
        passcode: pass,
        table,
        page: p.toString(),
        pageSize: pageSize.toString(),
        search: s,
        sortBy: sb,
        sortOrder: so,
      });

      if (table === 'participants' && payFilter !== 'ALL') {
        params.set('paymentStatus', payFilter);
      }

      const res = await fetch(`/api/admin?${params.toString()}`, {
        signal: AbortSignal.timeout(20000),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setIsAuthenticated(true);
        setData(json.data || []);
        setTotal(json.total || 0);
        setPage(json.page || 1);
        setTotalPages(json.totalPages || 1);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('lokutsav_admin_pass', pass);
        }
      } else {
        setAuthError(json.error || 'अवैध पासवर्ड / Invalid credentials');
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
        setAuthError('विनंती वेळ संपली (Timeout). कृपया पुन्हा प्रयत्न करा.');
      } else {
        setAuthError('डेटा लोड करताना त्रुटी आली / Server communication error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    verifyAndFetch(passcode, activeTable, 1);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasscode('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('lokutsav_admin_pass');
    }
  };

  const handleTableSwitch = (tbl: TableKey) => {
    setActiveTable(tbl);
    setPage(1);
    setSearch('');
    verifyAndFetch(passcode, tbl, 1, '', 'createdAt', 'desc', 'ALL');
  };

  const handleSort = (column: string) => {
    const nextOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortOrder(nextOrder);
    verifyAndFetch(passcode, activeTable, page, search, column, nextOrder, paymentFilter);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    verifyAndFetch(passcode, activeTable, 1, search, sortBy, sortOrder, paymentFilter);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    verifyAndFetch(passcode, activeTable, newPage, search, sortBy, sortOrder, paymentFilter);
  };

  // Quick Action: Mark Paid
  const handleMarkPaid = async (ticketId: string) => {
    if (!confirm(`Confirm payment for ${ticketId}? This will move them to the Jury panel immediately.`)) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${passcode}` },
        body: JSON.stringify({ ticketId, action: 'MARK_PAID' }),
      });
      const json = await res.json();
      if (json.success) {
        alert('Payment verified & entry approved!');
        verifyAndFetch(passcode, activeTable, page);
      } else {
        alert(json.error || 'Failed to update');
      }
    } catch {
      alert('Error updating record');
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Action: Delete Record
  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`⚠️ ARE YOU SURE you want to DELETE ${label}? This cannot be undone.`)) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin?passcode=${encodeURIComponent(passcode)}&id=${encodeURIComponent(id)}&table=${activeTable}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        alert(json.message || 'Deleted successfully');
        verifyAndFetch(passcode, activeTable, page);
      } else {
        alert(json.error || 'Delete failed');
      }
    } catch {
      alert('Error deleting record');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${passcode}` },
        body: JSON.stringify(editFormData),
      });
      const json = await res.json();
      if (json.success) {
        alert('Participant updated successfully!');
        setIsEditModalOpen(false);
        verifyAndFetch(passcode, activeTable, page);
      } else {
        alert(json.error || 'Update failed');
      }
    } catch {
      alert('Error saving changes');
    } finally {
      setActionLoading(false);
    }
  };

  // Add Direct Entry
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${passcode}` },
        body: JSON.stringify(newFormData),
      });
      const json = await res.json();
      if (json.success) {
        alert('New participant created successfully!');
        setIsAddModalOpen(false);
        verifyAndFetch(passcode, 'participants', 1);
      } else {
        alert(json.error || 'Creation failed');
      }
    } catch {
      alert('Error adding record');
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV
  const exportCsv = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }
    const headers = Object.keys(data[0]).filter((k) => typeof data[0][k] !== 'object' || Array.isArray(data[0][k]));
    const csvRows = [
      headers.join(','),
      ...data.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            const str = Array.isArray(val) ? val.join(';') : (val ?? '').toString();
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(',')
      ),
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lokutsav_${activeTable}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="py-24 bg-[#FAF7F2] min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E5D7C0] shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#9B1B1E] text-white flex items-center justify-center mx-auto shadow-md">
            <Database className="w-8 h-8 text-amber-300" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#9B1B1E] bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Master Administration
            </span>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 mt-3">
              प्रशासक नियंत्रण कक्ष
            </h1>
            <p className="text-xs text-stone-600 mt-1">
              संपूर्ण डेटाबेस, नोंदी, पेमेंट्स व नियंत्रण व्यवस्था
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Admin Passcode"
                className="w-full px-4 py-3.5 rounded-xl border border-stone-300 text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#9B1B1E] text-sm"
              />
            </div>

            {authError && <p className="text-xs text-red-600 font-bold">{authError}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#9B1B1E] hover:bg-[#781416] text-white font-bold py-3.5 rounded-xl shadow-xs transition-colors text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'पडताळणी करत आहे...' : 'कक्ष उघडा (Login Admin)'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#FAF7F2] min-h-screen text-stone-900">
      <div className="max-w-[98%] mx-auto px-2 sm:px-4">
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-5 border border-[#E5D7C0] shadow-2xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#9B1B1E] text-white flex items-center justify-center shadow-xs shrink-0">
              <Database className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Master Control Center
                </span>
              </div>
              <h1 className="font-serif font-black text-2xl text-stone-900">
                Lokutsav सर्वसमावेशक डेटाबेस व्यवस्थापन
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>नवीन नोंद जोडा (Add Entry)</span>
            </button>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-stone-300 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>CSV Export</span>
            </button>
            <button
              type="button"
              onClick={() => verifyAndFetch(passcode, activeTable, page)}
              className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold px-3 py-2 rounded-xl border border-stone-300 transition-colors cursor-pointer"
              title="Refresh table"
            >
              <RefreshCw className={`w-4 h-4 text-stone-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-900 transition-colors"
            >
              लॉगआउट
            </button>
          </div>
        </div>

        {/* Table Selector Tabs */}
        <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => handleTableSwitch('participants')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTable === 'participants'
                ? 'bg-[#9B1B1E] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#E5D7C0]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>स्पर्धक नोंदी (Participants)</span>
            {activeTable === 'participants' && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{total}</span>}
          </button>

          <button
            type="button"
            onClick={() => handleTableSwitch('leads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTable === 'leads'
                ? 'bg-[#9B1B1E] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#E5D7C0]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>अपूर्ण / सर्व फॉर्म सेशन्स (Sessions & Leads)</span>
            {activeTable === 'leads' && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{total}</span>}
          </button>

          <button
            type="button"
            onClick={() => handleTableSwitch('evaluations')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTable === 'evaluations'
                ? 'bg-[#9B1B1E] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#E5D7C0]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>ज्युरी गुणदान नोंदी (Evaluations)</span>
            {activeTable === 'evaluations' && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{total}</span>}
          </button>

          <button
            type="button"
            onClick={() => handleTableSwitch('events')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTable === 'events'
                ? 'bg-[#9B1B1E] text-white shadow-xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border border-[#E5D7C0]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>युझर इव्हेंट लॉग (Event Stream)</span>
            {activeTable === 'events' && <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px]">{total}</span>}
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5D7C0] mb-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-xl border border-stone-200">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by Name, Phone, Ticket ID, District, Payment ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-transparent focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  verifyAndFetch(passcode, activeTable, 1, '', sortBy, sortOrder, paymentFilter);
                }}
                className="text-stone-400 hover:text-stone-700 text-xs px-1.5"
              >
                ✕
              </button>
            )}
            <button
              type="submit"
              className="bg-stone-800 text-white text-xs px-3 py-1 rounded-lg font-bold hover:bg-stone-900 cursor-pointer"
            >
              शोधा
            </button>
          </form>

          {activeTable === 'participants' && (
            <div className="flex items-center gap-1.5 flex-wrap text-xs">
              <span className="text-stone-400 font-bold text-[11px] mr-1">पेमेंट:</span>
              <button
                type="button"
                onClick={() => {
                  setPaymentFilter('ALL');
                  verifyAndFetch(passcode, 'participants', 1, search, sortBy, sortOrder, 'ALL');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  paymentFilter === 'ALL' ? 'bg-[#9B1B1E] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                सर्व
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentFilter('COMPLETED');
                  verifyAndFetch(passcode, 'participants', 1, search, sortBy, sortOrder, 'COMPLETED');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  paymentFilter === 'COMPLETED' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                ✓ Paid
              </button>
              <button
                type="button"
                onClick={() => {
                  setPaymentFilter('PENDING');
                  verifyAndFetch(passcode, 'participants', 1, search, sortBy, sortOrder, 'PENDING');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                  paymentFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                ⏳ Pending/Failed
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-[#E5D7C0] overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/80 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider select-none">
                {activeTable === 'participants' && (
                  <tr>
                    <th className="py-3.5 px-3 cursor-pointer hover:text-stone-900" onClick={() => handleSort('ticketId')}>
                      <div className="flex items-center gap-1">
                        <span>तिकीट क्र.</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 cursor-pointer hover:text-stone-900" onClick={() => handleSort('fullName')}>
                      <div className="flex items-center gap-1">
                        <span>स्पर्धकाचे नाव</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3">संपर्क (Phone / Email)</th>
                    <th className="py-3.5 px-3 cursor-pointer hover:text-stone-900" onClick={() => handleSort('district')}>
                      <div className="flex items-center gap-1">
                        <span>जिल्हा व गाव</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3">देखावा व वर्ग</th>
                    <th className="py-3.5 px-3">मीडिया (फोटो/व्हिडिओ)</th>
                    <th className="py-3.5 px-3 cursor-pointer hover:text-stone-900" onClick={() => handleSort('paymentStatus')}>
                      <div className="flex items-center gap-1">
                        <span>पेमेंट स्थिती</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 cursor-pointer hover:text-stone-900" onClick={() => handleSort('finalScore')}>
                      <div className="flex items-center gap-1">
                        <span>गुण</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3.5 px-3 text-right">प्रशासक कृती (Actions)</th>
                  </tr>
                )}

                {activeTable === 'leads' && (
                  <tr>
                    <th className="py-3.5 px-3">Session ID</th>
                    <th className="py-3.5 px-3">नाव व संपर्क</th>
                    <th className="py-3.5 px-3">जिल्हा</th>
                    <th className="py-3.5 px-3">शेवटचा टप्पा</th>
                    <th className="py-3.5 px-3">अडथळा (Drop Field)</th>
                    <th className="py-3.5 px-3">पूर्ण झाले?</th>
                    <th className="py-3.5 px-3">अपलोड फोटो</th>
                    <th className="py-3.5 px-3">वेळ</th>
                    <th className="py-3.5 px-3 text-right">कृती</th>
                  </tr>
                )}

                {activeTable === 'evaluations' && (
                  <tr>
                    <th className="py-3.5 px-3">Evaluation ID</th>
                    <th className="py-3.5 px-3">तिकीट व स्पर्धक</th>
                    <th className="py-3.5 px-3">जिल्हा</th>
                    <th className="py-3.5 px-3">एकूण गुण (Total Score)</th>
                    <th className="py-3.5 px-3">शेरा (Remarks)</th>
                    <th className="py-3.5 px-3">तारीख</th>
                  </tr>
                )}

                {activeTable === 'events' && (
                  <tr>
                    <th className="py-3.5 px-3">Event Type</th>
                    <th className="py-3.5 px-3">Session ID</th>
                    <th className="py-3.5 px-3">टप्पा</th>
                    <th className="py-3.5 px-3">Field</th>
                    <th className="py-3.5 px-3">वेळ</th>
                  </tr>
                )}
              </thead>

              <tbody className="divide-y divide-stone-100 font-sans">
                {data.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-stone-400">
                      {loading ? 'डेटा लोड होत आहे...' : 'कोणतीही नोंद सापडली नाही / No records found'}
                    </td>
                  </tr>
                )}

                {/* PARTICIPANTS ROWS */}
                {activeTable === 'participants' &&
                  data.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-stone-800">
                        <div className="flex items-center gap-1">
                          <span>{row.ticketId}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(row.ticketId, row.ticketId)}
                            className="text-stone-400 hover:text-stone-700 p-0.5"
                            title="Copy Ticket ID"
                          >
                            {copiedId === row.ticketId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <span className="text-[10px] text-stone-400 block font-normal">
                          {new Date(row.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-bold text-stone-900">{row.fullName}</p>
                        <span className="text-[10px] text-stone-500 block truncate max-w-[180px]">{row.address}</span>
                      </td>

                      <td className="py-3 px-3">
                        <a
                          href={`https://wa.me/91${row.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{row.phone}</span>
                        </a>
                        <span className="text-[10px] text-stone-400 block truncate max-w-[150px]">{row.email}</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-semibold text-stone-800">{row.district}</span>
                        <span className="text-[10px] text-stone-400 block">{row.city}</span>
                      </td>

                      <td className="py-3 px-3">
                        <p className="font-medium text-stone-900 truncate max-w-[160px]">{row.themeTitle}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                            {row.category === 'HOUSEHOLD' ? 'घरगुती' : 'मंडळ'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800">
                            {row.idolType === 'SHADU_MATI_CLAY' ? 'शाडू माती' : 'पारंपारिक'}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {row.photoUrls && row.photoUrls.length > 0 ? (
                            <a
                              href={row.photoUrls[0]}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-1 rounded-lg border border-stone-200 font-bold"
                            >
                              <ImageIcon className="w-3 h-3 text-stone-500" />
                              <span>{row.photoUrls.length} फोटो</span>
                            </a>
                          ) : (
                            <span className="text-stone-400 text-[10px] italic">फोटो नाही</span>
                          )}

                          {row.videoUrl ? (
                            <a
                              href={row.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-1 rounded-lg font-bold border border-amber-300"
                            >
                              <Video className="w-3 h-3 text-amber-700" />
                              <span>व्हिडिओ</span>
                            </a>
                          ) : null}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {row.paymentStatus === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>PAID (₹99)</span>
                          </span>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                              <AlertTriangle className="w-3 h-3 text-amber-700" />
                              <span>PENDING</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => handleMarkPaid(row.ticketId)}
                              className="block text-[10px] font-bold text-blue-700 hover:underline cursor-pointer"
                            >
                              ✓ Mark Paid
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono font-bold">
                        {row.finalScore ? (
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                            {row.finalScore}/10 {row.finalRank && `(#${row.finalRank})`}
                          </span>
                        ) : (
                          <span className="text-stone-400 italic font-normal">प्रतीक्षाधीन</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setEditFormData({
                              id: row.id,
                              ticketId: row.ticketId,
                              fullName: row.fullName,
                              phone: row.phone,
                              email: row.email,
                              district: row.district,
                              city: row.city,
                              address: row.address,
                              category: row.category,
                              idolType: row.idolType,
                              themeTitle: row.themeTitle,
                              themeDescription: row.themeDescription,
                              videoUrl: row.videoUrl || '',
                              paymentStatus: row.paymentStatus,
                              status: row.status,
                            });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg inline-block transition-colors cursor-pointer"
                          title="Edit participant"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(row.id, `${row.fullName} (${row.ticketId})`)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg inline-block transition-colors cursor-pointer"
                          title="Delete participant"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* LEADS ROWS */}
                {activeTable === 'leads' &&
                  data.map((row) => (
                    <tr key={row.id || row.sessionId} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-3 font-mono text-[11px] text-stone-600">
                        {row.sessionId.slice(0, 16)}...
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-stone-900">{row.fullName || 'अनामिक (Unknown)'}</p>
                        {row.phone && (
                          <a
                            href={`https://wa.me/91${row.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="font-mono text-emerald-700 font-bold hover:underline"
                          >
                            {row.phone}
                          </a>
                        )}
                      </td>
                      <td className="py-3 px-3">{row.district || '—'}</td>
                      <td className="py-3 px-3 font-bold text-stone-800">
                        टप्पा {row.maxStepReached || row.currentStep || 1}
                      </td>
                      <td className="py-3 px-3">
                        <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-bold">
                          {row.dropOffField || row.droppedOffAt || 'Form Started'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {row.isCompleted ? (
                          <span className="text-emerald-700 font-bold">✓ होय (Completed)</span>
                        ) : (
                          <span className="text-amber-700 font-bold">अपूर्ण (Abandoned)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold">{row.photosCount || 0}</td>
                      <td className="py-3 px-3 text-[10px] text-stone-400">
                        {new Date(row.updatedAt || row.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(row.sessionId, `Session ${row.sessionId}`)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg inline-block cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                {/* EVALUATIONS ROWS */}
                {activeTable === 'evaluations' &&
                  data.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-3 font-mono text-[11px]">{row.id.slice(0, 12)}</td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-stone-800 mr-2">{row.participant?.ticketId}</span>
                        <span className="font-bold text-stone-900">{row.participant?.fullName}</span>
                      </td>
                      <td className="py-3 px-3">{row.participant?.district}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800 text-sm">
                        {row.totalScore}/10
                      </td>
                      <td className="py-3 px-3 text-stone-600 italic max-w-xs truncate">{row.remarks || '—'}</td>
                      <td className="py-3 px-3 text-stone-400 text-[10px]">
                        {new Date(row.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}

                {/* EVENTS ROWS */}
                {activeTable === 'events' &&
                  data.map((row) => (
                    <tr key={row.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-stone-800">{row.eventType}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-stone-500">{row.sessionId?.slice(0, 14)}...</td>
                      <td className="py-3 px-3 font-bold">Step {row.step} ({row.stageName})</td>
                      <td className="py-3 px-3 text-amber-800 font-medium">{row.field || '—'}</td>
                      <td className="py-3 px-3 text-stone-400 text-[10px]">
                        {new Date(row.createdAt).toLocaleTimeString('en-IN')}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
            <div>
              Showing <span className="font-bold text-stone-900">{data.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{' '}
              <span className="font-bold text-stone-900">{Math.min(page * pageSize, total)}</span> of{' '}
              <span className="font-bold text-stone-900">{total}</span> records
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-bold text-stone-800">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-300 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                  {editFormData.ticketId}
                </span>
                <h3 className="font-serif font-black text-xl text-stone-900 mt-1">
                  स्पर्धक माहिती संपादन (Edit Record)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">पूर्ण नाव (Full Name)</label>
                  <input
                    type="text"
                    value={editFormData.fullName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">फोन नंबर (WhatsApp Phone)</label>
                  <input
                    type="text"
                    value={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">जिल्हा (District)</label>
                  <input
                    type="text"
                    value={editFormData.district || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">शहर / तालुका (City / Taluka)</label>
                  <input
                    type="text"
                    value={editFormData.city || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">पत्ता (Address)</label>
                <textarea
                  rows={2}
                  value={editFormData.address || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">वर्ग (Category)</label>
                  <select
                    value={editFormData.category || 'HOUSEHOLD'}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                  >
                    <option value="HOUSEHOLD">घरगुती (Household)</option>
                    <option value="SARVAJANIK_MANDAL">सार्वजनिक मंडळ (Sarvajanik Mandal)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">मूर्ती प्रकार (Idol Type)</label>
                  <select
                    value={editFormData.idolType || 'SHADU_MATI_CLAY'}
                    onChange={(e) => setEditFormData({ ...editFormData, idolType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                  >
                    <option value="SHADU_MATI_CLAY">शाडू माती मूर्ती</option>
                    <option value="ECO_FRIENDLY_PAPER_PULP">कागदी लगदा / पर्यावरणपूरक</option>
                    <option value="TRADITIONAL_OTHER">पारंपारिक / इतर</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">पेमेंट स्थिती (Payment Status)</label>
                  <select
                    value={editFormData.paymentStatus || 'COMPLETED'}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentStatus: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                  >
                    <option value="COMPLETED">COMPLETED (Paid)</option>
                    <option value="PENDING">PENDING (Unpaid)</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">प्रवेश स्थिती (Entry Status)</label>
                  <select
                    value={editFormData.status || 'APPROVED'}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                  >
                    <option value="APPROVED">APPROVED (दिसणार)</option>
                    <option value="PENDING_VERIFICATION">PENDING_VERIFICATION</option>
                    <option value="FLAGGED">FLAGGED (संशयास्पद)</option>
                    <option value="REJECTED">REJECTED (अपात्र)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">देखावा शीर्षक (Theme Title)</label>
                <input
                  type="text"
                  value={editFormData.themeTitle || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, themeTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">व्हिडिओ लिंक / URL</label>
                <input
                  type="text"
                  value={editFormData.videoUrl || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, videoUrl: e.target.value })}
                  placeholder="https://youtu.be/... or /uploads/..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 rounded-xl bg-[#9B1B1E] hover:bg-[#781416] text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'जतन करत आहे...' : 'बदल जतन करा (Save Changes)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD NEW ENTRY MODAL ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-stone-300 shadow-2xl space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Direct / Offline Entry
                </span>
                <h3 className="font-serif font-black text-xl text-stone-900 mt-1">
                  नवीन थेट स्पर्धक नोंद जोडा (Add Direct Participant)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">पूर्ण नाव (Full Name) *</label>
                  <input
                    type="text"
                    value={newFormData.fullName}
                    onChange={(e) => setNewFormData({ ...newFormData, fullName: e.target.value })}
                    placeholder="उदा. राहुल रमेश पाटील"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">फोन नंबर (WhatsApp Phone) *</label>
                  <input
                    type="text"
                    value={newFormData.phone}
                    onChange={(e) => setNewFormData({ ...newFormData, phone: e.target.value })}
                    placeholder="उदा. 9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">जिल्हा (District) *</label>
                  <input
                    type="text"
                    value={newFormData.district}
                    onChange={(e) => setNewFormData({ ...newFormData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">शहर / तालुका</label>
                  <input
                    type="text"
                    value={newFormData.city}
                    onChange={(e) => setNewFormData({ ...newFormData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">पत्ता (Full Address)</label>
                <input
                  type="text"
                  value={newFormData.address}
                  onChange={(e) => setNewFormData({ ...newFormData, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">वर्ग (Category)</label>
                  <select
                    value={newFormData.category}
                    onChange={(e) => setNewFormData({ ...newFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                  >
                    <option value="HOUSEHOLD">घरगुती देखावा (Household)</option>
                    <option value="SARVAJANIK_MANDAL">सार्वजनिक मंडळ (Mandal)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-stone-700 block mb-1">मूर्ती प्रकार (Idol Type)</label>
                  <select
                    value={newFormData.idolType}
                    onChange={(e) => setNewFormData({ ...newFormData, idolType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                  >
                    <option value="SHADU_MATI_CLAY">शाडू माती मूर्ती</option>
                    <option value="ECO_FRIENDLY_PAPER_PULP">कागदी लगदा / पर्यावरणपूरक</option>
                    <option value="TRADITIONAL_OTHER">पारंपारिक / इतर</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">देखावा शीर्षक (Theme Title)</label>
                <input
                  type="text"
                  value={newFormData.themeTitle}
                  onChange={(e) => setNewFormData({ ...newFormData, themeTitle: e.target.value })}
                  placeholder="उदा. छत्रपती शिवाजी महाराज राज्याभिषेक देखावा"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">व्हिडिओ URL (YouTube or link)</label>
                <input
                  type="text"
                  value={newFormData.videoUrl}
                  onChange={(e) => setNewFormData({ ...newFormData, videoUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-[#9B1B1E] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-100 cursor-pointer"
                >
                  रद्द करा
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'नोंद होत आहे...' : 'स्पर्धक जोडा (Create Participant)'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
