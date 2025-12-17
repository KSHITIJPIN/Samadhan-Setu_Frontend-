import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Map, FileText, Bell, MessageSquare, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const DashboardGrid = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const menuItems = [
        // Saffron - Action/Revolution
        {
            title: t('report_issue'),
            icon: <PlusCircle size={28} />,
            path: '/citizen/report',
            gradient: 'linear-gradient(135deg, #FF9933 0%, #E65100 100%)', // Indian Saffron
            glow: 'rgba(255, 153, 51, 0.4)'
        },
        // Green - Environment/Maps
        {
            title: t('nearby_issues'),
            icon: <Map size={28} />,
            path: '/citizen/map',
            gradient: 'linear-gradient(135deg, #138808 0%, #064E3B 100%)', // Indian Green
            glow: 'rgba(19, 136, 8, 0.4)'
        },
        // Navy Blue - History/Records (Chakra color)
        {
            title: t('my_reports'),
            icon: <FileText size={28} />,
            path: '/citizen/my-reports',
            gradient: 'linear-gradient(135deg, #000080 0%, #1E3A8A 100%)', // Navy Blue
            glow: 'rgba(0, 0, 128, 0.4)'
        },
        // Gold/Orange - Alerts
        {
            title: t('notifications'),
            icon: <Bell size={28} />,
            path: '/citizen/notifications',
            gradient: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', // Golden Warning
            glow: 'rgba(245, 158, 11, 0.4)'
        },
        // Teal/Blue - Feedback
        {
            title: t('feedback'),
            icon: <MessageSquare size={28} />,
            path: '/citizen/feedback',
            gradient: 'linear-gradient(135deg, #0891B2 0%, #155E75 100%)', // Teal Modern
            glow: 'rgba(8, 145, 178, 0.4)'
        },
        // Deep Purple/Pink - Profile
        {
            title: t('profile'),
            icon: <User size={28} />,
            path: '/citizen/profile',
            gradient: 'linear-gradient(135deg, #BE185D 0%, #831843 100%)', // Deep Pink
            glow: 'rgba(190, 24, 93, 0.4)'
        },
    ];

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', // Standard responsive columns
            gap: '0.75rem',
            padding: '0 0.25rem',
            justifyItems: 'center' // Center cards within their cells
        }}>
            {menuItems.map((item, index) => (
                <div
                    key={index}
                    className="card-hover-effect"
                    onClick={() => navigate(item.path)}
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.75rem',
                        cursor: 'pointer',
                        borderRadius: '16px',
                        border: 'none',
                        background: item.gradient,
                        boxShadow: `0 4px 6px -1px ${item.glow}`,
                        aspectRatio: '1 / 1',
                        width: '100%',
                        maxWidth: '256px', // Max size as requested
                        color: 'white'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = `0 8px 10px -2px ${item.glow}`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 4px 6px -1px ${item.glow}`;
                    }}
                >
                    <div style={{ marginBottom: '0.25rem', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.3))' }}>
                        {item.icon}
                    </div>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                    }}>
                        {item.title}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default DashboardGrid;
