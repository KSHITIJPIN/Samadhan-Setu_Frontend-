import React, { useState, useEffect } from 'react';
import { getIssues, getWorkers, assignIssue, getSummary, verifyIssue, dismissIssue } from '../services/api';
import { Users, FileText, CheckCircle, Menu, X, Filter, BarChart2, CheckSquare, Eye, Check, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboard = () => {
    const { t } = useLanguage();
    const [issues, setIssues] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [summary, setSummary] = useState('');
    const [generatedSummary, setGeneratedSummary] = useState(false);

    // Navigation State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [issuesRes, workersRes] = await Promise.all([getIssues(), getWorkers()]);
        setIssues(issuesRes.data);
        setWorkers(workersRes.data);
    };

    const handleAssign = async (issueId, workerId) => {
        if (!workerId) return;
        try {
            await assignIssue(issueId, workerId);
            fetchData(); // Refresh to show updated status
        } catch (error) {
            alert('Assignment failed');
        }
    };

    const handleSummary = async () => {
        try {
            setGeneratedSummary(true);
            const { data } = await getSummary();
            setSummary(data.summary);
        } catch (error) {
            setSummary('Failed to generate summary.');
        }
    };

    // --- VIEW RENDERERS ---

    // KPI Filter State
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Pending', 'Resolved', 'Failed'

    // Derived Stats
    const stats = {
        total: issues.length,
        pending: issues.filter(i => i.status === 'Pending').length,
        successful: issues.filter(i => i.status === 'Resolved').length,
        failed: issues.filter(i => i.status === 'Failed').length
    };

    // Filtered Issues for Display
    const displayedIssues = issues.filter(issue => {
        if (filterStatus === 'All') return true;
        if (filterStatus === 'Successful') return issue.status === 'Resolved';
        return issue.status === filterStatus;
    });

    const renderDashboard = () => (
        <div>
            {/* KPI CARDS ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>

                {/* Total Stats Card */}
                <div
                    onClick={() => setFilterStatus('All')}
                    style={{
                        background: 'white', padding: '1.5rem', borderRadius: '12px', cursor: 'pointer',
                        borderLeft: '5px solid #2563eb', // Blue
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        opacity: filterStatus === 'All' ? 1 : 0.7,
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{stats.total}</h2>
                        <span style={{ color: '#2563eb' }}>📊</span>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: '#64748b', fontWeight: '500' }}>Total Reports</p>
                </div>

                {/* Pending Card */}
                <div
                    onClick={() => setFilterStatus('Pending')}
                    style={{
                        background: 'white', padding: '1.5rem', borderRadius: '12px', cursor: 'pointer',
                        borderLeft: '5px solid #f59e0b', // Orange
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        opacity: filterStatus === 'Pending' ? 1 : 0.7,
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{stats.pending}</h2>
                        <span style={{ color: '#f59e0b' }}>🕒</span>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: '#64748b', fontWeight: '500' }}>Pending</p>
                </div>

                {/* Successful Card */}
                <div
                    onClick={() => setFilterStatus('Successful')}
                    style={{
                        background: 'white', padding: '1.5rem', borderRadius: '12px', cursor: 'pointer',
                        borderLeft: '5px solid #10b981', // Green
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        opacity: filterStatus === 'Successful' ? 1 : 0.7,
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{stats.successful}</h2>
                        <span style={{ color: '#10b981' }}>✅</span>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: '#64748b', fontWeight: '500' }}>Successful</p>
                </div>

                {/* Failed Card */}
                <div
                    onClick={() => setFilterStatus('Failed')}
                    style={{
                        background: 'white', padding: '1.5rem', borderRadius: '12px', cursor: 'pointer',
                        borderLeft: '5px solid #ef4444', // Red
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        opacity: filterStatus === 'Failed' ? 1 : 0.7,
                        transition: 'all 0.2s'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>{stats.failed}</h2>
                        <span style={{ color: '#ef4444' }}>❌</span>
                    </div>
                    <p style={{ marginTop: '0.5rem', color: '#64748b', fontWeight: '500' }}>Failed</p>
                </div>
            </div>

            {/* SCHEDULE WIDGET */}
            <div className="card" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden' }}>
                <div style={{
                    padding: '1.5rem',
                    background: '#ecfdf5', // Light green bg for header area match
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #d1fae5'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#064e3b' }}>{t('todays_schedule')}</h3>
                    <div style={{
                        background: '#fff',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        color: '#64748b',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>

                <div style={{ padding: '0' }}>
                    {[
                        { time: '09:00 AM', title: 'Morning Briefing with Sanitation Dept', loc: 'Conference Room A' },
                        { time: '11:30 AM', title: 'Site Inspection: Sector 4 Potholes', loc: 'Sector 4, Main Road' },
                        { time: '02:00 PM', title: 'Review Meeting: Pending Escalations', loc: 'Admin Office' },
                        { time: '04:30 PM', title: 'Public Grievance Hearing', loc: 'Town Hall' }
                    ].map((item, idx) => (
                        <div key={idx} style={{
                            display: 'flex',
                            padding: '1.5rem',
                            borderBottom: idx !== 3 ? '1px solid #f1f5f9' : 'none',
                            alignItems: 'stretch' // Ensure full height for border
                        }}>
                            <div style={{
                                width: '100px', // Fixed strict width
                                flexShrink: 0,
                                fontWeight: '700',
                                color: '#ffffff', // Bright white
                                fontSize: '0.95rem',
                                fontFamily: 'monospace', // Monospace helps alignment for numbers
                                display: 'flex', // Enable flex
                                alignItems: 'center' // Center vertically
                            }}>
                                {item.time}
                            </div>
                            <div style={{
                                borderLeft: '2px solid #ffffff', // Also make vertical line white/visible
                                paddingLeft: '2rem', // More space
                                flex: 1,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center' // Center content vertically relative to border
                            }}>
                                <h4 style={{
                                    margin: '0 0 0.25rem 0',
                                    color: '#ffffff', // Bright white
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                }}>{item.title}</h4>
                                <p style={{ margin: 0, color: '#ffffff', fontSize: '0.875rem' }}>{item.loc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RECENT ACTIVITY WIDGET */}
            <div className="card" style={{ marginBottom: '2rem', padding: '0', overflow: 'hidden' }}>
                <div style={{
                    padding: '1.5rem',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>{t('recent_activity')}</h3>
                </div>

                <div style={{ padding: '0' }}>
                    {issues
                        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                        .slice(0, 5)
                        .map((item, idx) => (
                            <div key={item._id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '1.5rem',
                                borderBottom: idx !== 4 ? '1px solid #f1f5f9' : 'none',
                                alignItems: 'center'
                            }}>
                                {/* Left: Info */}
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#ffffff', fontSize: '1rem', fontWeight: '600' }}>{item.title}</h4>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', color: '#cbd5e1', fontStyle: 'italic' }}>
                                            {item.category === 'Cleanliness' && '🗑️ '}
                                            {item.category === 'Drainage' && '💧 '}
                                            {item.category === 'Infrastructure' && '🚧 '}
                                            {item.category === 'Maintenance' && '💡 '}
                                            {item.category || 'General'}
                                        </span>
                                    </div>
                                    <p style={{ margin: '0 0 0.25rem 0', color: '#ffffff', fontSize: '0.8rem' }}>Assigned to: {item.assignedTo ? item.assignedTo.name : 'Unassigned'}</p>
                                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <MapPin size={12} /> {item.location?.address || 'No location'}
                                    </p>
                                </div>

                                {/* Right: Status & Date */}
                                <div style={{ textAlign: 'right' }}>
                                    <span className={`badge badge-${item.status.toLowerCase().replace(' ', '-')}`} style={{
                                        display: 'inline-block',
                                        marginBottom: '0.5rem',
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontWeight: '600',
                                        backgroundColor: item.status === 'Resolved' ? '#dcfce7' : item.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                                        color: item.status === 'Resolved' ? '#166534' : item.status === 'Pending' ? '#92400e' : '#991b1b'
                                    }}>
                                        {t('status_' + item.status.toLowerCase().replace(' ', '_'))}
                                    </span>
                                    <p style={{ margin: 0, color: '#ffffff', fontSize: '0.8rem' }}>{new Date(item.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    {issues.length === 0 && (
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>No recent activity.</div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {filterStatus === 'All' ? t('dashboard_overview') : `${filterStatus} Reports`}
                </h2>
                <button className="btn btn-secondary" onClick={handleSummary}>
                    <FileText size={18} style={{ marginRight: '0.5rem' }} /> {t('generate_summary')}
                </button>
            </div>

            {generatedSummary && (
                <div className="card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                    <h3>AI Executive Summary</h3>
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', marginTop: '1rem', color: 'var(--text-muted)' }}>{summary || 'Generating...'}</pre>
                </div>
            )}

            <div className="grid grid-cols-1">
                {displayedIssues.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                        <p>No reports found for this category.</p>
                    </div>
                ) : (
                    displayedIssues.map(issue => (
                        <div key={issue._id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <div>
                                    <h3>{issue.title}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{issue.location?.address}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`}>{t('status_' + issue.status.toLowerCase().replace(' ', '_'))}</span>
                                    {issue.assignedTo && <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Assigned: {issue.assignedTo.name}</p>}
                                </div>
                            </div>

                            <p style={{ marginBottom: '1rem' }}>{issue.ai_enhanced_description || issue.original_description}</p>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: 'var(--radius)' }}>
                                {issue.status === 'Resolved' ? (
                                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={18} /> Resolved
                                    </span>
                                ) : (
                                    <>
                                        <Users size={18} color="var(--text-muted)" />
                                        <select
                                            className="input"
                                            style={{ padding: '0.5rem' }}
                                            onChange={(e) => handleAssign(issue._id, e.target.value)}
                                            value={issue.assignedTo?._id || ''}
                                            disabled={issue.status === 'Resolved'}
                                        >
                                            <option value="">Assign Worker...</option>
                                            {workers.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
                                        </select>
                                    </>
                                )}
                            </div>
                        </div>
                    )))}
            </div>
        </div>
    );

    // --- WORKER MANAGEMENT VIEW ---
    const [selectedWorkerForHistory, setSelectedWorkerForHistory] = useState(null);

    const renderWorkerManagement = () => {
        // Calculate stats per worker
        const workerStats = workers.map(worker => {
            const workerIssues = issues.filter(i => i.assignedTo?._id === worker._id);
            return {
                ...worker,
                completed: workerIssues.filter(i => i.status === 'Resolved').length,
                pending: workerIssues.filter(i => i.status !== 'Resolved').length,
                total: workerIssues.length
            };
        });

        const workerHistory = selectedWorkerForHistory
            ? issues.filter(i => i.assignedTo?._id === selectedWorkerForHistory._id).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            : [];

        return (
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={24} /> Field Worker Management
                </h2>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Worker Profiles</h3>
                    </div>
                    <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#fff', fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8' }}>
                            <div>NAME</div>
                            <div style={{ textAlign: 'right' }}>COMPLETED</div>
                        </div>
                        {workerStats.map(worker => (
                            <div
                                key={worker._id}
                                onClick={() => setSelectedWorkerForHistory(worker)}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 100px',
                                    padding: '1.5rem',
                                    borderBottom: '1px solid #f1f5f9',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                            >
                                <div style={{ fontWeight: '500', color: '#1e293b' }}>{worker.name}</div>
                                <div style={{ textAlign: 'right', fontWeight: '600', color: '#10b981' }}>{worker.completed}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Worker History Modal */}
                {selectedWorkerForHistory && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1100,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }} onClick={() => setSelectedWorkerForHistory(null)}>
                        <div
                            className="card"
                            style={{ width: '90%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedWorkerForHistory.name}</h3>
                                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>Work History</p>
                                </div>
                                <button onClick={() => setSelectedWorkerForHistory(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ overflowY: 'auto', padding: '1.5rem' }}>
                                {workerHistory.length === 0 ? (
                                    <p style={{ textAlign: 'center', color: '#94a3b8' }}>No history found for this worker.</p>
                                ) : (
                                    workerHistory.map(issue => (
                                        <div key={issue._id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{issue.title}</h4>
                                                <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`} style={{ fontSize: '0.75rem' }}>{issue.status}</span>
                                            </div>
                                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#64748b' }}>{new Date(issue.updatedAt).toLocaleDateString()} • {issue.category || 'General'}</p>
                                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155' }}>{issue.location?.address}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // --- RENDER FILTER REPORTS ---
    const [selectedZone, setSelectedZone] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTimePeriod, setSelectedTimePeriod] = useState('All');

    const getFilteredIssues = () => {
        return issues.filter(issue => {
            const matchesZone = selectedZone === 'All' || (issue.zone === selectedZone);
            const matchesCategory = selectedCategory === 'All' || (issue.category === selectedCategory);

            let matchesTime = true;
            if (selectedTimePeriod !== 'All') {
                const issueDate = new Date(issue.createdAt);
                const now = new Date();
                if (selectedTimePeriod === 'Today') {
                    matchesTime = issueDate.toDateString() === now.toDateString();
                } else if (selectedTimePeriod === 'This Week') {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(now.getDate() - 7);
                    matchesTime = issueDate >= oneWeekAgo;
                } else if (selectedTimePeriod === 'This Month') {
                    matchesTime = issueDate.getMonth() === now.getMonth() && issueDate.getFullYear() === now.getFullYear();
                }
            }
            return matchesZone && matchesCategory && matchesTime;
        });
    };

    const renderFilterReports = () => {
        const filteredList = getFilteredIssues();

        return (
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={24} /> {t('filter_reports')}
                </h2>

                {/* Filter Controls */}
                <div className="card" style={{ marginBottom: '2rem', background: '#ecfdf5', border: '1px solid #d1fae5' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>AREA / ZONE</label>
                            <select
                                value={selectedZone}
                                onChange={(e) => setSelectedZone(e.target.value)}
                                className="input"
                                style={{ width: '100%', background: 'white', color: '#1e293b' }}
                            >
                                <option value="All">All Zones</option>
                                <option value="North Zone">North Zone</option>
                                <option value="South Zone">South Zone</option>
                                <option value="East Zone">East Zone</option>
                                <option value="West Zone">West Zone</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>CATEGORY</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input"
                                style={{ width: '100%', background: 'white', color: '#1e293b' }}
                            >
                                <option value="All">All Categories</option>
                                <option value="Roads">Roads</option>
                                <option value="Electricity">Electricity</option>
                                <option value="Water Supply">Water Supply</option>
                                <option value="Cleanliness">Cleanliness</option>
                                <option value="Drainage">Drainage</option>
                                <option value="Infrastructure">Infrastructure</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>TIME PERIOD</label>
                            <select
                                value={selectedTimePeriod}
                                onChange={(e) => setSelectedTimePeriod(e.target.value)}
                                className="input"
                                style={{ width: '100%', background: 'white', color: '#1e293b' }}
                            >
                                <option value="All">All Time</option>
                                <option value="Today">Today</option>
                                <option value="This Week">This Week</option>
                                <option value="This Month">This Month</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Filter Results Table */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>TOKEN</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>TITLE</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>AREA</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>CATEGORY</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No reports match your filters.</td>
                                </tr>
                            ) : (
                                filteredList.map((issue) => (
                                    <tr key={issue._id} style={{ borderBottom: '1px solid #f1f5f9', background: 'white' }}>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', color: '#1e293b' }}>
                                            {issue._id.slice(-4)}
                                        </td>
                                        <td style={{ padding: '1rem', color: '#334155' }}>
                                            {issue.title}
                                        </td>
                                        <td style={{ padding: '1rem', color: '#64748b' }}>
                                            {issue.zone || 'North Zone'}
                                        </td>
                                        <td style={{ padding: '1rem', color: '#64748b' }}>
                                            {issue.category === 'Cleanliness' && '🗑️ '}
                                            {issue.category === 'Drainage' && '💧 '}
                                            {issue.category === 'Infrastructure' && '🚧 '}
                                            {issue.category === 'Maintenance' && '💡 '}
                                            {issue.category}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`} style={{
                                                fontSize: '0.75rem',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '4px', // Rectangular badge style from design
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                backgroundColor: issue.status === 'Resolved' ? '#dcfce7' : issue.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                                                color: issue.status === 'Resolved' ? '#166534' : issue.status === 'Pending' ? '#92400e' : '#991b1b'
                                            }}>
                                                {t('status_' + issue.status.toLowerCase().replace(' ', '_'))}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // --- VERIFY SOLUTIONS VIEW ---
    const [viewProofIssue, setViewProofIssue] = useState(null);

    const handleVerify = async (id) => {
        try {
            await verifyIssue(id);
            fetchData(); // Refresh list
        } catch (error) {
            alert('Verification failed');
        }
    };

    const handleDismiss = async (id) => {
        if (!window.confirm('Are you sure you want to dismiss this resolution? It will revert to "In Progress".')) return;
        try {
            await dismissIssue(id);
            fetchData(); // Refresh list
        } catch (error) {
            alert('Dismissal failed');
        }
    };

    const renderVerifySolutions = () => {
        const pendingVerificationIssues = issues.filter(i => i.status === 'Pending Verification');

        return (
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={24} /> Pending Resolution Verification
                </h2>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '150px 2fr 1.5fr 300px', padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>
                        <div>REPORT ID (TOKEN)</div>
                        <div>ISSUE TITLE</div>
                        <div>WORKER ASSIGNED</div>
                        <div>ACTION</div>
                    </div>

                    {pendingVerificationIssues.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                            <p>No solutions pending verification.</p>
                        </div>
                    ) : (
                        pendingVerificationIssues.map(issue => (
                            <div key={issue._id} style={{
                                display: 'grid',
                                gridTemplateColumns: '150px 2fr 1.5fr 300px',
                                padding: '1.5rem',
                                borderBottom: '1px solid #f1f5f9',
                                alignItems: 'center'
                            }}>
                                <div style={{ fontWeight: 'bold', color: '#1e293b' }}>
                                    {issue._id.slice(-4)}
                                </div>
                                <div style={{ fontWeight: '500', color: '#334155' }}>{issue.title}</div>
                                <div style={{ color: '#64748b' }}>{issue.assignedTo?.name || 'Unknown'}</div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setViewProofIssue(issue)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', border: '1px solid #cbd5e1', background: 'white', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', color: '#475569', fontSize: '0.8rem' }}
                                    >
                                        <Eye size={16} /> VIEW PROOF
                                    </button>
                                    <button
                                        onClick={() => handleVerify(issue._id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', border: 'none', background: '#059669', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', color: 'white', fontSize: '0.8rem' }}
                                    >
                                        <Check size={16} /> VERIFY
                                    </button>
                                    <button
                                        onClick={() => handleDismiss(issue._id)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', border: 'none', background: '#e11d48', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', color: 'white', fontSize: '0.8rem' }}
                                    >
                                        <X size={16} /> DISMISS
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* PROOF MODAL */}
                {viewProofIssue && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setViewProofIssue(null)}>
                        <div className="card" style={{ width: '90%', maxWidth: '500px', padding: '0', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0 }}>Proof of Completion</h3>
                                <button onClick={() => setViewProofIssue(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                            </div>
                            <div style={{ padding: '1.5rem' }}>
                                {(() => {
                                    // Find the status history item that is likely the resolution attempt (latest 'Pending Verification')
                                    const historyItem = [...viewProofIssue.status_history].reverse().find(h => h.status === 'Pending Verification' || h.status === 'Resolved'); // Should be 'Pending Verification'

                                    return (
                                        <>
                                            {historyItem?.proofImage ? (
                                                <img src={historyItem.proofImage} alt="Proof" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem', maxHeight: '300px', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ padding: '2rem', background: '#f1f5f9', borderRadius: '8px', textAlign: 'center', marginBottom: '1rem', color: '#94a3b8' }}>No Image Provided</div>
                                            )}
                                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Worker's Remark:</p>
                                            <p style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', margin: 0 }}>
                                                {historyItem?.remark || "No remarks provided."}
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Cost Analysis View
    const renderCostAnalysis = () => {
        // Mock costs for demonstration (in a real app, this would be in the DB)
        const getCost = (id) => {
            // Deterministic mock cost based on ID char codes
            const code = id.charCodeAt(id.length - 1) + id.charCodeAt(id.length - 2);
            return (code * 10) + 500; // Random-ish cost between 1500-3000
        };

        const totalCost = issues.reduce((acc, issue) => acc + getCost(issue._id || 'iso'), 0);

        return (
            <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem' }}>Cost Analysis & Projections</h2>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>₹{totalCost.toLocaleString()}</h3>
                        <p style={{ color: '#64748b' }}>Total Estimated Expenditure</p>
                    </div>
                    <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>₹{(totalCost * 0.45).toLocaleString()}</h3>
                        <p style={{ color: '#64748b' }}>Funds Utilized (YTD)</p>
                    </div>
                    <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>₹{(totalCost * 0.55).toLocaleString()}</h3>
                        <p style={{ color: '#64748b' }}>Projected Remaining</p>
                    </div>
                </div>

                {/* Detailed Cost Table */}
                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <tr>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Report Name / Issue</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Date</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>Status</th>
                                <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem', textAlign: 'right' }}>Estimated Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.map((issue, idx) => (
                                <tr key={issue._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '1rem', fontWeight: '500', color: '#1e293b' }}>
                                        {issue.title}
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>{issue.location?.address}</div>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#64748b' }}>
                                        {new Date().toLocaleDateString()} {/* Mock date for now */}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', textAlign: 'right', fontFamily: 'monospace', fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                                        ₹{getCost(issue._id || 'iso').toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // Sidebar items configuration
    const menuItems = [
        { id: 'dashboard', label: t('dashboard'), icon: <FileText size={20} /> },
        { id: 'filter_reports', label: t('filter_reports'), icon: <Filter size={20} /> },
        { id: 'worker_management', label: t('worker_management'), icon: <Users size={20} /> },
        { id: 'cost_analysis', label: t('cost_analysis'), icon: <BarChart2 size={20} /> }, // Renamed per user request
        { id: 'verify_solutions', label: t('verify_solutions'), icon: <CheckSquare size={20} /> }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>

            {/* SIDEBAR (Collapsible) */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: '260px',
                background: '#1e293b', // Dark slate
                color: 'white',
                zIndex: 1000,
                transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
                boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
                padding: '2rem 1rem'
            }}>
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                    Admin Portal
                </h2>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                background: activeView === item.id ? 'var(--primary)' : 'transparent',
                                color: activeView === item.id ? 'white' : '#94a3b8',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* OVERLAY (Background dimming) */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 900 }}
                />
            )}

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, padding: '2rem', marginLeft: 0, transition: 'margin-left 0.3s' }}>

                {/* Header with Hamburger */}
                <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        style={{ background: 'white', border: '1px solid #e2e8f0', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Menu size={24} color="#64748b" />
                    </button>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Admin Portal</h1>
                </header>

                {/* View Switcher */}
                {activeView === 'dashboard' && renderDashboard()}
                {activeView === 'filter_reports' && renderFilterReports()}
                {activeView === 'worker_management' && renderWorkerManagement()}
                {activeView === 'cost_analysis' && renderCostAnalysis()}
                {activeView === 'verify_solutions' && renderVerifySolutions()}

            </div>
        </div>
    );
};

export default AdminDashboard;
