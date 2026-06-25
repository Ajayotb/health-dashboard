import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHistory, getAllUsers } from '../api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, normal: 0, mild: 0, elevated: 0 });
    const [latest, setLatest] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        try {
            const users = await getAllUsers();
            let allReadings = [];

            for (const user of users) {
                const history = await getHistory(user.user_id);
                allReadings = [...allReadings, ...history];
            }

            const total = allReadings.length;
            const normal = allReadings.filter(r => r.risk_level === 'Normal').length;
            const mild = allReadings.filter(r => r.risk_level === 'Mild Risk').length;
            const elevated = allReadings.filter(r => r.risk_level === 'Elevated Risk').length;
            setStats({ total, normal, mild, elevated });

            if (allReadings.length > 0) {
                allReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setLatest(allReadings[0]);
            }

            const chart = allReadings.slice(0, 10).reverse().map((r, i) => ({
                name: `R${i + 1}`,
                hr: r.heart_rate,
                spo2: r.spo2
            }));
            setChartData(chart);
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

    const pieData = [
        { name: 'Normal', value: stats.normal, color: '#10B981' },
        { name: 'Mild Risk', value: stats.mild, color: '#F59E0B' },
        { name: 'Elevated', value: stats.elevated, color: '#EF4444' }
    ].filter(d => d.value > 0);

    if (loading) return (
        <div style={{
            display: 'flex', justifyContent: 'center',
            alignItems: 'center', height: '80vh'
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
                <p style={{ color: '#94A3B8' }}>Loading dashboard...</p>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '26px', fontWeight: '700',
                    color: '#F1F5F9', letterSpacing: '-0.5px'
                }}>
                    Health Overview
                </h1>
                <p style={{ color: '#94A3B8', fontSize: '13px', marginTop: '4px' }}>
                    AI-Powered Smart Wearable Health Monitoring System
                </p>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
                {[
                    { label: 'Total Readings', value: stats.total, color: '#3B82F6', icon: '📊', path: 'all' },
                    { label: 'Normal', value: stats.normal, color: '#10B981', icon: '✅', path: 'normal' },
                    { label: 'Mild Risk', value: stats.mild, color: '#F59E0B', icon: '⚠️', path: 'mild' },
                    { label: 'Elevated Risk', value: stats.elevated, color: '#EF4444', icon: '🚨', path: 'elevated' }
                ].map((stat, i) => (
                    <div
                        key={i}
                        onClick={() => navigate(`/readings/${stat.path}`)}
                        style={{
                            backgroundColor: '#111827',
                            border: "1px solid #1E2A3A",
                            borderRadius: '12px',
                            padding: '20px',
                            borderTop: `3px solid ${stat.color}`,
                            cursor: 'pointer'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#162032'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#111827'}
                    >
                        <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                        <div style={{
                            fontSize: '32px', fontWeight: '700',
                            color: stat.color,
                            fontFamily: 'Space Grotesk, sans-serif'
                        }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>
                            {stat.label}
                        </div>
                        <div style={{ fontSize: '11px', color: '#475569', marginTop: '6px' }}>
                            Click to view →
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="charts-row">
                {/* Area Chart */}
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px'
                }}>
                    <h3 style={{
                        color: '#F1F5F9', fontSize: '15px',
                        fontWeight: '600', marginBottom: '20px'
                    }}>
                        Heart Rate & SpO₂ Trend
                    </h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="spo2Grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3A" />
                                <XAxis dataKey="name" stroke="#475569" fontSize={12} />
                                <YAxis stroke="#475569" fontSize={12} />
                                <Tooltip contentStyle={{
                                    backgroundColor: '#1E2A3A',
                                    border: 'none', borderRadius: '8px',
                                    color: '#F1F5F9'
                                }} />
                                <Area type="monotone" dataKey="hr"
                                    stroke="#3B82F6" fill="url(#hrGrad)"
                                    name="Heart Rate" strokeWidth={2} />
                                <Area type="monotone" dataKey="spo2"
                                    stroke="#06B6D4" fill="url(#spo2Grad)"
                                    name="SpO₂" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{
                            height: '200px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: '#475569'
                        }}>
                            No readings yet — add a reading to see trends
                        </div>
                    )}
                </div>

                {/* Pie Chart */}
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px'
                }}>
                    <h3 style={{
                        color: '#F1F5F9', fontSize: '15px',
                        fontWeight: '600', marginBottom: '20px'
                    }}>
                        Risk Distribution
                    </h3>
                    {pieData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie
                                        data={pieData} cx="50%" cy="50%"
                                        innerRadius={45} outerRadius={70}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{
                                        backgroundColor: '#1E2A3A',
                                        border: 'none', borderRadius: '8px',
                                        color: '#F1F5F9'
                                    }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                gap: '8px', marginTop: '10px'
                            }}>
                                {pieData.map((d, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}>
                                        <div style={{
                                            width: '10px', height: '10px',
                                            borderRadius: '50%',
                                            backgroundColor: d.color
                                        }}></div>
                                        <span style={{ fontSize: '12px', color: '#94A3B8' }}>
                                            {d.name}: {d.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{
                            height: '200px', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: '#475569', fontSize: '13px', textAlign: 'center'
                        }}>
                            No data yet
                        </div>
                    )}
                </div>
            </div>

            {/* Latest Reading + System Info */}
            <div className="bottom-row">
                {/* Latest Reading */}
                {latest && (
                    <div style={{
                        backgroundColor: '#111827',
                        border: "1px solid #1E2A3A",
                        borderRadius: '12px', padding: '20px'
                    }}>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '20px'
                        }}>
                            <h3 style={{
                                color: '#F1F5F9', fontSize: '15px',
                                fontWeight: '600'
                            }}>Latest Reading</h3>
                            <span style={{
                                backgroundColor: `${getRiskColor(latest.risk_level)}20`,
                                color: getRiskColor(latest.risk_level),
                                padding: '4px 12px', borderRadius: '20px',
                                fontSize: '12px', fontWeight: '600',
                                border: `1px solid ${getRiskColor(latest.risk_level)}40`
                            }}>
                                {latest.risk_level}
                            </span>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr', gap: '12px'
                        }}>
                            {[
                                { icon: '❤️', label: 'Heart Rate', value: `${latest.heart_rate} BPM` },
                                { icon: '🫧', label: 'Blood Oxygen', value: `${latest.spo2}%` },
                                { icon: '👟', label: 'Steps', value: Number(latest.steps).toLocaleString() },
                                { icon: '😴', label: 'Sleep', value: `${latest.sleep_hours}h` }
                            ].map((m, i) => (
                                <div key={i} style={{
                                    backgroundColor: '#0A0F1E',
                                    borderRadius: '8px', padding: '12px',
                                    border: "1px solid #1E2A3A"
                                }}>
                                    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{m.icon}</div>
                                    <div style={{
                                        fontSize: '18px', fontWeight: '700',
                                        color: '#F1F5F9',
                                        fontFamily: 'Space Grotesk, sans-serif'
                                    }}>
                                        {m.value}
                                    </div>
                                    <div style={{
                                        fontSize: '11px', color: '#475569', marginTop: '2px'
                                    }}>
                                        {m.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* System Info */}
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px'
                }}>
                    <h3 style={{
                        color: '#F1F5F9', fontSize: '15px',
                        fontWeight: '600', marginBottom: '20px'
                    }}>
                        System Information
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { label: 'Primary Model', value: 'XGBoost Classifier' },
                            { label: 'Sequential Model', value: 'LSTM Neural Network' },
                            { label: 'Accuracy', value: '99.47%', highlight: true },
                            { label: 'Cross-Validation', value: '98.76% (5-fold)' },
                            { label: 'Prediction Type', value: 'Hybrid XGBoost + LSTM + Rules' },
                            { label: 'Languages', value: 'EN, YO, HA, IG' },
                            { label: 'Risk Categories', value: 'Normal · Mild · Elevated' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', justifyContent: 'space-between',
                                alignItems: 'center', padding: '8px 0',
                                borderBottom: "1px solid #1E2A3A"
                            }}>
                                <span style={{ fontSize: '13px', color: '#94A3B8' }}>
                                    {item.label}
                                </span>
                                <span style={{
                                    fontSize: '13px', fontWeight: '600',
                                    color: item.highlight ? '#10B981' : '#F1F5F9'
                                }}>
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;