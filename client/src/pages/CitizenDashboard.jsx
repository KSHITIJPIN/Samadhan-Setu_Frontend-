import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from '../components/WeatherWidget';
import DashboardGrid from '../components/DashboardGrid';
import { useLanguage } from '../context/LanguageContext';
import FeedbackModal from '../components/FeedbackModal';

const CitizenDashboard = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    return (
        <div className="fade-in" style={{ color: 'white' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <header style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                        {t('hello')}, <span className="text-gradient">{user?.name || 'Citizen'}</span>
                    </h1>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        Here's what's happening in your city today.
                    </p>
                </header>

                <WeatherWidget />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Quick Actions</h2>
                    <button
                        onClick={() => setIsFeedbackOpen(true)}
                        className="glass-card"
                        style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.1)',
                            color: 'white'
                        }}
                    >
                        Share Feedback
                    </button>
                </div>
                {/* DashboardGrid handles its own internal grid, but we remove its internal margin/width constraints 
                    if we want IT to align perfectly inside THIS container. 
                    However, checking DashboardGrid logic: it has maxWidth 900px margin 0 auto. 
                    So actually, we can either:
                    1. Remove constraints from DashboardGrid and let parent handle it.
                    2. Or just align header separately.
                    
                    Given DashboardGrid is a self-contained component often used alone, 
                    I will let DashboardGrid keep its centering, 
                    and JUST center the header pieces here to match it.
                    
                    WAIT: If DashboardGrid has margin: 0 auto, it centers itself inside the parent. 
                    If I wrap everything in maxWidth 900px here, DashboardGrid will fill that 900px.
                    
                    Let's check DashboardGrid again. It has margin: 0 auto inside itself.
                    So if I put it inside a 900px container, it will work fine.
                    But to be safe and avoid double margins, I'll pass a prop or just rely on its specific centering.
                    
                    Actually, the CLEANEST way to align distinct blocks (Head, Widget, Grid) 
                    is to have a common container. 
                    Let's update this file to have that common container.
                 */}
                <div style={{ marginLeft: '-1rem', marginRight: '-1rem' }}> {/* Negative margin to offset grid padding if needed? No, DashboardGrid handles padding. */}
                    <DashboardGrid />
                </div>

                <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
            </div>
        </div>
    );
};

export default CitizenDashboard;
