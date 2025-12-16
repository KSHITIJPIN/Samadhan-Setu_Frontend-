import React from 'react';
import { Sun, Calendar } from 'lucide-react';

const WeatherWidget = () => {
    const today = new Date();
    const dateOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const formattedDate = today.toLocaleDateString('en-US', dateOptions);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                marginBottom: '0.75rem',
                background: 'var(--surface)',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                fontSize: '0.85rem'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <Calendar size={16} />
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{formattedDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>28°C</span>
                <Sun size={16} color="#fbbf24" strokeWidth={2.5} />
            </div>
        </div>
    );
};

export default WeatherWidget;
