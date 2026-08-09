import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
    HiOutlineOfficeBuilding, HiOutlineUser, HiOutlineMail, 
    HiOutlineBriefcase, HiTrash, HiOutlineSearch, HiMoon, HiSun, 
    HiOutlineLogout, HiUserGroup, HiOutlineGlobeAlt, HiX 
} from 'react-icons/hi';
import Profile from './Profile.jsx';

function AdminDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // Auth check
    const user = (() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        if (!token || user?.role !== 'admin') {
            toast.error("Unauthorized access.");
            navigate('/login');
        }
    }, [token, user, navigate]);

    // Dashboard state
    const [activeTab, setActiveTab] = useState('recruiters'); // 'recruiters' | 'users' | 'jobs'
    const [recruiters, setRecruiters] = useState([]);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProfileUser, setSelectedProfileUser] = useState(null);
    
    // Delete Confirmation states
    const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'user' | 'job', id: string, name: string }

    // Fetch data based on active tab
    const fetchData = async () => {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };
        try {
            if (activeTab === 'recruiters') {
                const res = await axios.get('http://localhost:5000/admin/recruiters', { headers });
                setRecruiters(res.data);
            } else if (activeTab === 'users') {
                const res = await axios.get('http://localhost:5000/admin/users', { headers });
                setUsers(res.data);
            } else if (activeTab === 'jobs') {
                const res = await axios.get('http://localhost:5000/admin/jobs', { headers });
                setJobs(res.data);
            }
        } catch (error) {
            console.error("Admin fetch error:", error);
            toast.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && user?.role === 'admin') {
            fetchData();
        }
    }, [activeTab]);

    // Handle delete action
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        const headers = { Authorization: `Bearer ${token}` };
        try {
            if (deleteTarget.type === 'user') {
                await axios.delete(`http://localhost:5000/admin/user/${deleteTarget.id}`, { headers });
                toast.success("User deleted successfully.");
                if (activeTab === 'recruiters') {
                    setRecruiters(prev => prev.filter(r => r._id !== deleteTarget.id));
                } else {
                    setUsers(prev => prev.filter(u => u._id !== deleteTarget.id));
                }
            } else if (deleteTarget.type === 'job') {
                await axios.delete(`http://localhost:5000/admin/job/${deleteTarget.id}`, { headers });
                toast.success("Job posting deleted successfully.");
                setJobs(prev => prev.filter(j => j._id !== deleteTarget.id));
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Operation failed.");
        } finally {
            setDeleteTarget(null);
        }
    };

    // Logout function
    const handleLogout = () => {
        localStorage.clear();
        toast.success("Logged out successfully.");
        navigate('/login');
    };

    // Filter lists based on search
    const getFilteredList = () => {
        const query = searchQuery.toLowerCase().trim();
        if (activeTab === 'recruiters') {
            return recruiters.filter(r => 
                r.name?.toLowerCase().includes(query) || 
                r.email?.toLowerCase().includes(query) ||
                r.companyName?.toLowerCase().includes(query)
            );
        } else if (activeTab === 'users') {
            return users.filter(u => 
                u.name?.toLowerCase().includes(query) || 
                u.email?.toLowerCase().includes(query) ||
                u.skills?.toLowerCase().includes(query)
            );
        } else {
            return jobs.filter(j => 
                j.title?.toLowerCase().includes(query) || 
                j.company?.toLowerCase().includes(query) ||
                j.location?.toLowerCase().includes(query)
            );
        }
    };

    const filteredItems = getFilteredList();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2 leading-none">
                        Admin Control Panel 
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-wider">Super Admin</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5">Manage system recruiters, candidates, and job postings.</p>
                </div>

                {/* Search and Navigation tabs row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-200/60 dark:bg-slate-900 rounded-2xl w-full md:w-auto">
                        <button
                            onClick={() => { setActiveTab('recruiters'); setSearchQuery(''); }}
                            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeTab === 'recruiters' 
                                    ? "bg-white dark:bg-slate-850 text-brand-primary shadow-sm" 
                                    : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-300"
                            }`}
                        >
                            <HiOutlineOfficeBuilding className="text-sm" /> Recruiters
                        </button>
                        <button
                            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
                            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeTab === 'users' 
                                    ? "bg-white dark:bg-slate-850 text-brand-primary shadow-sm" 
                                    : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-300"
                            }`}
                        >
                            <HiOutlineUser className="text-sm" /> Candidates
                        </button>
                        <button
                            onClick={() => { setActiveTab('jobs'); setSearchQuery(''); }}
                            className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 ${
                                activeTab === 'jobs' 
                                    ? "bg-white dark:bg-slate-850 text-brand-primary shadow-sm" 
                                    : "text-slate-500 hover:text-slate-850 dark:hover:text-slate-300"
                            }`}
                        >
                            <HiOutlineBriefcase className="text-sm" /> Jobs
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
                        />
                    </div>
                </div>

                {/* Content Grid */}
                {loading ? (
                    <div className="flex justify-center items-center h-[40vh]">
                        <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 p-16 rounded-3xl text-center shadow-sm max-w-lg mx-auto">
                        <h3 className="text-lg font-bold text-slate-850 dark:text-white mb-1">No matches found</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Try broadening your search term or select another tab.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item, idx) => (
                            <div 
                                key={item._id}
                                className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 border-t-4 border-t-brand-primary rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Card Header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center text-base font-black shrink-0">
                                            {item.name?.charAt(0).toUpperCase() || (activeTab === 'jobs' ? item.title?.charAt(0).toUpperCase() : "?")}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-extrabold text-slate-850 dark:text-white truncate leading-tight">
                                                {activeTab === 'jobs' ? item.title : item.name}
                                            </h3>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-450 truncate flex items-center gap-1.5 mt-1">
                                                {activeTab === 'jobs' ? (
                                                    <>
                                                        <HiOutlineOfficeBuilding className="shrink-0" /> {item.company}
                                                    </>
                                                ) : (
                                                    <>
                                                        <HiOutlineMail className="shrink-0" /> {item.email}
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Card details based on Tab */}
                                    <div className="space-y-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                                        {activeTab === 'recruiters' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Company:</span>
                                                    <span className="font-semibold">{item.companyName || "Not Specified"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Website:</span>
                                                    <span className="font-semibold text-brand-primary truncate max-w-[150px]">
                                                        {item.companyWebsite ? (
                                                            <a href={item.companyWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline text-brand-primary no-underline">Link</a>
                                                        ) : "None"}
                                                    </span>
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'users' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Skills:</span>
                                                    <span className="font-semibold truncate max-w-[160px]">{item.skills || "No skills listed"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Location:</span>
                                                    <span className="font-semibold">{item.location || "Not Specified"}</span>
                                                </div>
                                            </>
                                        )}

                                        {activeTab === 'jobs' && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Location:</span>
                                                    <span className="font-semibold">{item.location || "Remote"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Type:</span>
                                                    <span className="font-semibold uppercase text-brand-secondary">{item.jobType || "Full Time"}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Actions row */}
                                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2.5">
                                    {/* Profile view (Recruiter or Candidate) */}
                                    {activeTab !== 'jobs' ? (
                                        <button
                                            onClick={() => setSelectedProfileUser(item)}
                                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-[10px] uppercase tracking-wider transition border-none cursor-pointer flex-1"
                                        >
                                            View Details
                                        </button>
                                    ) : (
                                        <div className="flex-1"></div>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => setDeleteTarget({
                                            type: activeTab === 'jobs' ? 'job' : 'user',
                                            id: item._id,
                                            name: activeTab === 'jobs' ? item.title : item.name
                                        })}
                                        className="p-1.5 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg transition border-none cursor-pointer flex items-center justify-center shrink-0"
                                        aria-label="Delete item"
                                    >
                                        <HiTrash className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Profile Viewer Modal Wrapper */}
            {selectedProfileUser && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto animate-scale-in">
                        <Profile isModal={true} viewUser={selectedProfileUser} onClose={() => setSelectedProfileUser(null)} />
                    </div>
                </div>,
                document.body
            )}

            {/* Delete Confirmation Modal */}
            {deleteTarget && createPortal(
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl relative animate-scale-in">
                        <h3 className="text-base font-black text-slate-850 dark:text-white mb-2 uppercase tracking-wider">Confirm Delete</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                            Are you sure you want to delete <strong className="text-slate-700 dark:text-slate-200">"{deleteTarget.name}"</strong>? This action cannot be undone and will permanently remove all associated details from the database.
                        </p>
                        
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="w-1/2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 rounded-xl font-bold transition text-xs border-none cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="w-1/2 bg-rose-500 hover:bg-rose-600 text-white py-2.5 rounded-xl font-bold transition text-xs border-none cursor-pointer shadow-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default AdminDashboard;
