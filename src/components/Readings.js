import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllUsers, getHistory } from '../api';

function Readings() {
    const { type } = useParams();
    const navigate = useNavigate();
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, normal: 0, mild: 0, elevated: 0 });
    const [selected, setSelected] = useState(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadAllReadings();
    }, [type]);
    
    const loadAllReadings = async () => {
        setLoading(true);
        try {
            const users = await getAllUsers();
            let allReadings = [];

            for (const user of users) {
                const history = await getHistory(user.user_id);
                const withUser = history.map(r => ({ ...r, user_id: user.user_id }));
                allReadings = [...allReadings, ...withUser];
            }

            allReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            const total = allReadings.length;
            const normal = allReadings.filter(r => r.risk_level === 'Normal').length;
            const mild = allReadings.filter(r => r.risk_level === 'Mild Risk').length;
            const elevated = allReadings.filter(r => r.risk_level === 'Elevated Risk').length;
            setStats({ total, normal, mild, elevated });

            if (type === 'normal') {
                setReadings(allReadings.filter(r => r.risk_level === 'Normal'));
            } else if (type === 'mild') {
                setReadings(allReadings.filter(r => r.risk_level === 'Mild Risk'));
            } else if (type === 'elevated') {
                setReadings(allReadings.filter(r => r.risk_level === 'Elevated Risk'));
            } else {
                setReadings(allReadings);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const getRiskColor = (risk) => {
        if (risk === 'Normal') return '#10B981';
        if (risk === 'Mild Risk') return '#F59E0B';
        return '#EF4444';
    };

    const getRiskIcon = (risk) => {
        if (risk === 'Normal') return '✅';
        if (risk === 'Mild Risk') return '⚠️';
        return '🚨';
    };

    const getTitle = () => {
        if (type === 'normal') return { title: 'Normal Readings', color: '#10B981', icon: '✅' };
        if (type === 'mild') return { title: 'Mild Risk Readings', color: '#F59E0B', icon: '⚠️' };
        if (type === 'elevated') return { title: 'Elevated Risk Readings', color: '#EF4444', icon: '🚨' };
        return { title: 'All Readings', color: '#3B82F6', icon: '📊' };
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleString('en-NG', {
            timeZone: 'Africa/Lagos',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const generateAdvice = (reading) => {
        const observations = [];
        const tips = [];
        const hr = reading.heart_rate;
        const spo2 = reading.spo2;
        const sleep = reading.sleep_hours;
        const steps = reading.steps;

        if (hr > 100) {
            observations.push("Heart rate is elevated above the normal range of 60-100 BPM.");
            tips.push("Try relaxation techniques such as deep breathing or meditation.");
            tips.push("Avoid caffeine and strenuous activity until heart rate normalizes.");
        } else if (hr < 60) {
            observations.push("Heart rate is below the normal range.");
            tips.push("If not an athlete, consult a healthcare provider about low heart rate.");
        } else {
            observations.push("Heart rate is within the normal range.");
        }

        if (spo2 < 92) {
            observations.push("Blood oxygen level is critically low and requires immediate attention.");
            tips.push("Seek medical attention immediately if feeling short of breath or dizzy.");
        } else if (spo2 < 95) {
            observations.push("Blood oxygen level is below the healthy range of 95-100%.");
            tips.push("Practice deep breathing exercises to improve oxygen intake.");
        } else if (spo2 < 97) {
            observations.push("Blood oxygen level is slightly below the optimal range.");
            tips.push("Try light breathing exercises and stay in a well-ventilated area.");
        } else {
            observations.push("Blood oxygen level is healthy.");
        }

        if (sleep < 5) {
            observations.push(`Sleep duration of ${sleep} hours is critically low.`);
            tips.push("Aim for 7-9 hours of sleep per night for optimal health.");
            tips.push("Establish a consistent sleep schedule.");
        } else if (sleep < 6) {
            observations.push(`Sleep duration of ${sleep} hours is below recommended.`);
            tips.push("Try to get at least 7 hours of sleep per night.");
        } else if (sleep > 10) {
            observations.push(`Sleep duration of ${sleep} hours is above recommended range.`);
            tips.push("Aim for 7-9 hours. Oversleeping may indicate health issues.");
        } else {
            observations.push(`Sleep duration of ${sleep} hours is within healthy range.`);
        }

        if (steps < 2000) {
            observations.push(`Step count of ${Number(steps).toLocaleString()} is very low.`);
            tips.push("Try short walks throughout the day. Aim for 7,000-10,000 steps daily.");
        } else if (steps < 5000) {
            observations.push(`Step count of ${Number(steps).toLocaleString()} is below recommended.`);
            tips.push("Increase daily movement — take stairs instead of lifts.");
        } else if (steps >= 10000) {
            observations.push(`Excellent step count of ${Number(steps).toLocaleString()}!`);
        } else {
            observations.push(`Step count of ${Number(steps).toLocaleString()} is good.`);
        }

        return { observations, tips };
    };

    const { title, color, icon } = getTitle();

    if (loading) return (
        <div style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center', height: '80vh',
            flexDirection: 'column', gap: '10px'
        }}>
            <div style={{ fontSize: '32px' }}>⏳</div>
            <p style={{ color: '#94A3B8' }}>Loading readings...</p>
        </div>
    );

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center',
                gap: '16px', marginBottom: '24px'
            }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        padding: '8px 16px', borderRadius: '8px',
                        border: "1px solid #1E2A3A",
                        backgroundColor: 'transparent',
                        color: '#94A3B8', fontSize: '13px',
                        cursor: 'pointer'
                    }}>
                    ← Back
                </button>
                <div>
                    <h1 style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '24px', fontWeight: '700', color: color
                    }}>
                        {icon} {title}
                    </h1>
                    <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px' }}>
                        {readings.length} reading{readings.length !== 1 ? 's' : ''} found
                    </p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[
                    { label: `All (${stats.total})`, path: 'all', color: '#3B82F6' },
                    { label: `Normal (${stats.normal})`, path: 'normal', color: '#10B981' },
                    { label: `Mild Risk (${stats.mild})`, path: 'mild', color: '#F59E0B' },
                    { label: `Elevated (${stats.elevated})`, path: 'elevated', color: '#EF4444' }
                ].map((tab, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(`/readings/${tab.path}`)}
                        style={{
                            padding: '8px 16px', borderRadius: '8px',
                            border: `1px solid ${type === tab.path || (tab.path === 'all' && !type)
                                ? tab.color : '#1E2A3A'}`,
                            backgroundColor: type === tab.path || (tab.path === 'all' && !type)
                                ? `${tab.color}20` : 'transparent',
                            color: type === tab.path || (tab.path === 'all' && !type)
                                ? tab.color : '#94A3B8',
                            fontSize: '13px', cursor: 'pointer', fontWeight: '600'
                        }}>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Layout */}
            <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'start'
            }}>
                {/* Readings Table */}
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px',
                    overflow: 'hidden',
                    flex: 1,
                    minWidth: 0
                }}>
                    {readings.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                            <p>No readings found for this category</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #1E2A3A" }}>
                                        {['User', 'Heart Rate', 'SpO₂', 'Steps', 'Sleep', 'Risk Level', 'Time'].map((h, i) => (
                                            <th key={i} style={{
                                                padding: '10px 12px', textAlign: 'left',
                                                fontSize: '11px', color: '#475569',
                                                fontWeight: '600', letterSpacing: '0.5px',
                                                textTransform: 'uppercase', whiteSpace: 'nowrap'
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {readings.map((r, i) => (
                                        <tr
                                            key={i}
                                            onClick={() => setSelected(selected?.id === r.id ? null : r)}
                                            style={{
                                                borderBottom: "1px solid #1E2A3A",
                                                backgroundColor: selected?.id === r.id
                                                    ? 'rgba(59,130,246,0.1)'
                                                    : i % 2 === 0 ? 'transparent' : 'rgba(30,42,58,0.3)',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s'
                                            }}
                                            onMouseEnter={e => {
                                                if (selected?.id !== r.id)
                                                    e.currentTarget.style.backgroundColor = '#162032'
                                            }}
                                            onMouseLeave={e => {
                                                if (selected?.id !== r.id)
                                                    e.currentTarget.style.backgroundColor = i % 2 === 0
                                                        ? 'transparent' : 'rgba(30,42,58,0.3)'
                                            }}
                                        >
                                            <td style={{ padding: '10px 12px', fontSize: '13px', color: '#06B6D4', fontWeight: '600' }}>
                                                {r.user_id}
                                            </td>
                                            <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>
                                                {r.heart_rate} BPM
                                            </td>
                                            <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>
                                                {r.spo2}%
                                            </td>
                                            <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>
                                                {Number(r.steps).toLocaleString()}
                                            </td>
                                            <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>
                                                {r.sleep_hours}h
                                            </td>
                                            <td style={{ padding: '10px 12px' }}>
                                                <span style={{
                                                    backgroundColor: `${getRiskColor(r.risk_level)}20`,
                                                    color: getRiskColor(r.risk_level),
                                                    padding: '3px 10px', borderRadius: '12px',
                                                    fontSize: '12px', fontWeight: '600',
                                                    border: `1px solid ${getRiskColor(r.risk_level)}40`,
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {r.risk_level}
                                                </span>
                                            </td>
                                            <td style={{ padding: '10px 12px', fontSize: '11px', color: '#475569', whiteSpace: 'nowrap' }}>
                                                {formatDate(r.timestamp)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Detail Panel */}
                {selected && (
                    <div style={{
                        backgroundColor: '#111827',
                        border: `1px solid ${getRiskColor(selected.risk_level)}40`,
                        borderRadius: '12px', padding: '20px',
                        borderTop: `3px solid ${getRiskColor(selected.risk_level)}`,
                        position: 'sticky', top: '80px',
                        maxHeight: 'calc(100vh - 120px)',
                        overflowY: 'auto',
                        width: '380px',
                        flexShrink: 0
                    }}>
                        {/* Panel Header */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '16px'
                        }}>
                            <h3 style={{ color: '#F1F5F9', fontSize: '14px', fontWeight: '600' }}>
                                Reading Details
                            </h3>
                            <button
                                onClick={() => setSelected(null)}
                                style={{
                                    backgroundColor: 'transparent', border: 'none',
                                    color: '#475569', fontSize: '18px', cursor: 'pointer'
                                }}>
                                ✕
                            </button>
                        </div>

                        {/* User and Risk */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '16px',
                            backgroundColor: '#0A0F1E', padding: '12px',
                            borderRadius: '8px', border: "1px solid #1E2A3A"
                        }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#475569' }}>USER</div>
                                <div style={{ fontSize: '15px', fontWeight: '700', color: '#06B6D4' }}>
                                    {selected.user_id}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '22px' }}>{getRiskIcon(selected.risk_level)}</div>
                                <div style={{
                                    fontSize: '13px', fontWeight: '700',
                                    color: getRiskColor(selected.risk_level)
                                }}>
                                    {selected.risk_level}
                                </div>
                            </div>
                        </div>

                        {/* Metrics */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            gap: '8px', marginBottom: '16px'
                        }}>
                            {[
                                { icon: '❤️', label: 'Heart Rate', value: `${selected.heart_rate} BPM` },
                                { icon: '🫧', label: 'Blood Oxygen', value: `${selected.spo2}%` },
                                { icon: '👟', label: 'Steps', value: Number(selected.steps).toLocaleString() },
                                { icon: '😴', label: 'Sleep', value: `${selected.sleep_hours}h` },
                                { icon: '🏃', label: 'Activity', value: selected.activity_level },
                                { icon: '📊', label: 'Confidence', value: `${selected.confidence}%` }
                            ].map((m, i) => (
                                <div key={i} style={{
                                    backgroundColor: '#0A0F1E', borderRadius: '8px',
                                    padding: '10px', border: "1px solid #1E2A3A"
                                }}>
                                    <div style={{ fontSize: '14px', marginBottom: '3px' }}>{m.icon}</div>
                                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#F1F5F9' }}>
                                        {m.value}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '1px' }}>
                                        {m.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Timestamp */}
                        <div style={{
                            fontSize: '11px', color: '#475569',
                            marginBottom: '16px', textAlign: 'center'
                        }}>
                            📅 {formatDate(selected.timestamp)}
                        </div>

                        {/* Health Advice */}
                        {(() => {
                            const { observations, tips } = generateAdvice(selected);
                            return (
                                <div>
                                    <h4 style={{
                                        color: '#06B6D4', fontSize: '11px',
                                        letterSpacing: '0.5px', marginBottom: '8px'
                                    }}>
                                        OBSERVATIONS
                                    </h4>
                                    {observations.map((obs, i) => (
                                        <div key={i} style={{
                                            display: 'flex', gap: '6px',
                                            marginBottom: '5px', alignItems: 'flex-start'
                                        }}>
                                            <span style={{ color: '#3B82F6', fontSize: '12px' }}>•</span>
                                            <span style={{ color: '#94A3B8', fontSize: '12px', lineHeight: '1.5' }}>
                                                {obs}
                                            </span>
                                        </div>
                                    ))}
                                    {tips.length > 0 && (
                                        <>
                                            <h4 style={{
                                                color: '#10B981', fontSize: '11px',
                                                letterSpacing: '0.5px',
                                                marginTop: '12px', marginBottom: '8px'
                                            }}>
                                                RECOMMENDATIONS
                                            </h4>
                                            {tips.map((tip, i) => (
                                                <div key={i} style={{
                                                    display: 'flex', gap: '6px',
                                                    marginBottom: '6px', alignItems: 'flex-start',
                                                    backgroundColor: '#0A0F1E',
                                                    padding: '8px 10px', borderRadius: '6px',
                                                    border: "1px solid #1E2A3A"
                                                }}>
                                                    <span style={{ color: '#10B981', fontSize: '12px' }}>✓</span>
                                                    <span style={{ color: '#F1F5F9', fontSize: '12px', lineHeight: '1.5' }}>
                                                        {tip}
                                                    </span>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Readings;