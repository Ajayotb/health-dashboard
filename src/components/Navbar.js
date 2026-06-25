import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
    const location = useLocation();

    const navStyle = (path) => ({
        color: location.pathname === path ? '#06B6D4' : '#94A3B8',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        padding: '8px 16px',
        borderRadius: '8px',
        backgroundColor: location.pathname === path ? 'rgba(6,182,212,0.1)' : 'transparent',
        transition: 'all 0.2s',
        letterSpacing: '0.3px'
    });

    return (
        <nav style={{
            backgroundColor: '#0D1424',
            borderBottom: '1px solid #1E2A3A',
            padding: '0 30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '64px',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '32px', height: '32px',
                    background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px'
                }}>❤️</div>
                <div>
                    <div style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: '700',
                        fontSize: '15px',
                        color: '#F1F5F9',
                        letterSpacing: '-0.3px'
                    }}>
                        HealthAI Monitor
                    </div>
                    <div style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.5px' }}>
                        FUTA Final Year Project
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Link to="/" style={navStyle('/')}>Dashboard</Link>
                <Link to="/predict" style={navStyle('/predict')}>New Reading</Link>
                <Link to="/history" style={navStyle('/history')}>History</Link>
                <Link to="/user" style={navStyle('/user')}>My Health</Link>
                <Link to="/users" style={navStyle('/users')}>Users</Link>
            </div>

            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.3)',
                padding: '6px 12px', borderRadius: '20px'
            }}>
                <div style={{
                    width: '7px', height: '7px',
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                }}></div>
                <span style={{ fontSize: '12px', color: '#10B981', fontWeight: '500' }}>
                    System Online
                </span>
            </div>
        </nav>
    );
}

export default Navbar;