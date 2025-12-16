import React from 'react';
import {
    Construction, Lightbulb, Waves, Droplet, Zap, Bus,
    Trash2, Trash, Home, Flame, AlertTriangle, Bug, XCircle
} from 'lucide-react';

const categories = [
    { name: 'Roads and potholes', icon: <Construction size={32} />, color: '#71717a' },
    { name: 'Street lighting', icon: <Lightbulb size={32} />, color: '#fbbf24' },
    { name: 'Drainage and sewage systems', icon: <Waves size={32} />, color: '#3b82f6' },
    { name: 'Water supply issues', icon: <Droplet size={32} />, color: '#0ea5e9' },
    { name: 'Electricity supply', icon: <Zap size={32} />, color: '#eab308' },
    { name: 'Public transportation', icon: <Bus size={32} />, color: '#fca5a5' },
    { name: 'Garbage collection', icon: <Trash2 size={32} />, color: '#16a34a' },
    { name: 'Lack of dustbins', icon: <Trash size={32} />, color: '#22c55e' },
    { name: 'Maintenance of public toilets', icon: <Home size={32} />, color: '#a8a29e' },
    { name: 'Fire safety violations', icon: <Flame size={32} />, color: '#ef4444' },
    { name: 'Water pollution', icon: <AlertTriangle size={32} />, color: '#8b5cf6' },
    { name: 'Mosquito breeding', icon: <Bug size={32} />, color: '#84cc16' },
    { name: 'Waste burning', icon: <XCircle size={32} />, color: '#f97316' },
];

const CategorySelection = ({ onSelect }) => {
    return (
        <div className="fade-in">
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Select Issue Category</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                {categories.map((cat, index) => (
                    <div
                        key={index}
                        className="card"
                        onClick={() => onSelect(cat.name)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '1.5rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'transform 0.2s',
                            border: '1px solid transparent'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.color = 'var(--primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = 'inherit';
                        }}
                    >
                        <div style={{ color: cat.color, marginBottom: '0.75rem' }}>
                            {cat.icon}
                        </div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{cat.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorySelection;
