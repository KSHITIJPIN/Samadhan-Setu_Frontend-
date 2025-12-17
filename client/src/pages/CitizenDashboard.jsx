import React from 'react';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/WeatherWidget';
import DashboardGrid from '../components/DashboardGrid';
import { useLanguage } from '../context/LanguageContext';

const CitizenDashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>
                    {t('hello')}, <span className="text-gradient">{user?.name || 'Citizen'}</span>
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Here's what's happening in your city today.</p>
            </header>

            <WeatherWidget />

            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Quick Actions</h2>
            <DashboardGrid />
        </div>
    );
};

export default CitizenDashboard;
