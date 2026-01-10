import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const WorkerDashboard = () => {
    const { logout, user } = useAuth();

    return (
        <div className="container fade-in">
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>Worker Portal</h1>
                    <p style={{ margin: 0, opacity: 0.8 }}>Welcome back, {user?.name}</p>
                </div>
                <button
                    onClick={logout}
                    className="btn"
                    style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#fca5a5',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <LogOut size={18} /> Logout
                </button>
            </header>

            <div className="card">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Assigned Tasks</h2>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>No tasks assigned yet.</p>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;
