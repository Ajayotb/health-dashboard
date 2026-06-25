import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser, getHistory, getBaseline } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [selected, setSelected] = useState(null);
    const [userHistory, setUserHistory] = useState([]);
    const [userBaseline, setUserBaseline] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError('Failed to load users. Make sure backend is running.');
        }
        setLoading(false);
    };

    const handleSelectUser = async (user) => {
        if (selected?.user_id === user.user_id) {
            setSelected(null);
            setUserHistory([]);
            setUserBaseline(null);
            return;
        }
        setSelected(user);
        setLoadingDetail(true);
        try {
            const history = await getHistory(user.user_id);
            const formatted = history.map((r, i) => ({
                name: `R${i + 1}`,
                hr: Math.round(r.heart_rate),
                spo2: Math.round(r.spo2),
                steps: Math.round(r.steps),
                sleep: parseFloat(r.sleep_hours).toFixed(1),
                risk: r.risk_level,
                confidence: r.confidence,
                timestamp: r.timestamp
            })).reverse();
            setUserHistory(formatted);
            const baseline = await getBaseline(user.user_id);
            setUserBaseline(baseline);
        } catch (err) {
            console.error(err);
        }
        setLoadingDetail(false);
    };

    const handleDelete = async (userId) => {
        if (!window.confirm(`Are you sure you want to delete all data for ${userId}?`)) return;
        setDeleting(userId);
        try {
            await deleteUser(userId);
            setMessage(`✅ ${userId} deleted successfully`);
            setUsers(users.filter(u => u.user_id !== userId));
            if (selected?.user_id === userId) {
                setSelected(null);
                setUserHistory([]);
                setUserBaseline(null);
            }
        } catch (err) {
            setMessage('❌ Failed to delete user');
        }
        setDeleting(null);
    };

    const getRiskColor = (risk) => {
        if (risk === 'Normal') return '#10B981';
        if (risk === 'Mild Risk') return '#F59E0B';
        if (risk === 'Elevated Risk') return '#EF4444';
        return '#475569';
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

    if (loading) return (
        <div style={{ padding: '30px', color: '#94A3B8', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏳</div>
            Loading users...
        </div>
    );

    if (error) return (
        <div style={{ padding: '30px' }}>
            <div style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: '8px', padding: '16px', color: '#EF4444'
            }}>
                ⚠️ {error}
            </div>
        </div>
    );

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', overflow: 'hidden' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '24px', fontWeight: '700', color: '#F1F5F9'
                }}>
                    User Management
                </h1>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px' }}>
                    {users.length} enrolled user{users.length !== 1 ? 's' : ''} — click a user to view details
                </p>
            </div>

            {message && (
                <div style={{
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    border: "1px solid rgba(16,185,129,0.3)",
                    borderRadius: '8px', padding: '12px 16px',
                    color: '#10B981', fontSize: '14px', marginBottom: '16px'
                }}>
                    {message}
                </div>
            )}

            <div style={{
                display: 'flex',
                gap: '16px',
                alignItems: 'start',
                width: '100%',
                overflow: 'hidden'
            }}>
                {/* Users Table */}
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px',
                    flex: 1,
                    minWidth: 0,
                    overflow: 'hidden'
                }}>
                    {users.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👤</div>
                            <p>No users found. Send some health readings first.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '580px' }}>
                                <thead>
                                    <tr style={{ borderBottom: "1px solid #1E2A3A" }}>
                                        {[
                                            { label: 'User ID', width: '120px' },
                                            { label: 'Readings', width: '80px' },
                                            { label: 'Latest Risk', width: '130px' },
                                            { label: 'Heart Rate', width: '100px' },
                                            { label: 'SpO₂', width: '70px' },
                                            { label: 'Baseline', width: '90px' },
                                            { label: 'Actions', width: '90px' }
                                        ].map((h, i) => (
                                            <th key={i} style={{
                                                padding: '10px 12px', textAlign: 'left',
                                                fontSize: '11px', color: '#475569',
                                                fontWeight: '600', letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                                whiteSpace: 'nowrap',
                                                width: h.width
                                            }}>{h.label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, i) => (
                                        <tr
                                            key={i}
                                            onClick={() => handleSelectUser(user)}
                                            style={{
                                                borderBottom: "1px solid #1E2A3A",
                                                backgroundColor: selected?.user_id === user.user_id
                                                    ? 'rgba(59,130,246,0.1)'
                                                    : i % 2 === 0 ? 'transparent' : 'rgba(30,42,58,0.3)',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s'
                                            }}
                                            onMouseEnter={e => {
                                                if (selected?.user_id !== user.user_id)
                                                    e.currentTarget.style.backgroundColor = '#162032'
                                            }}
                                            onMouseLeave={e => {
                                                if (selected?.user_id !== user.user_id)
                                                    e.currentTarget.style.backgroundColor = i % 2 === 0
                                                        ? 'transparent' : 'rgba(30,42,58,0.3)'
                                            }}
                                        >
                                            <td style={{
                                                padding: '12px', fontSize: '14px',
                                                color: '#06B6D4', fontWeight: '600',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {user.user_id}
                                            </td>
                                            <td style={{
                                                padding: '12px', fontSize: '13px',
                                                color: '#94A3B8'
                                            }}>
                                                {user.total_readings}
                                            </td>
                                            <td style={{ padding: '12px', minWidth: '130px' }}>
                                                <span style={{
                                                    backgroundColor: `${getRiskColor(user.latest_risk)}20`,
                                                    color: getRiskColor(user.latest_risk),
                                                    padding: '3px 10px', borderRadius: '12px',
                                                    fontSize: '12px', fontWeight: '600',
                                                    border: `1px solid ${getRiskColor(user.latest_risk)}40`,
                                                    whiteSpace: 'nowrap',
                                                    display: 'inline-block'
                                                }}>
                                                    {user.latest_risk}
                                                </span>
                                            </td>
                                            <td style={{
                                                padding: '12px', fontSize: '13px',
                                                color: '#F1F5F9', whiteSpace: 'nowrap'
                                            }}>
                                                {Math.round(user.latest_hr)} BPM
                                            </td>
                                            <td style={{
                                                padding: '12px', fontSize: '13px',
                                                color: '#F1F5F9', whiteSpace: 'nowrap'
                                            }}>
                                                {Math.round(user.latest_spo2)}%
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <span style={{
                                                    fontSize: '12px',
                                                    color: user.has_baseline ? '#10B981' : '#475569'
                                                }}>
                                                    {user.has_baseline ? '✅ Set' : '⏳ Pending'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px' }}>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(user.user_id); }}
                                                    disabled={deleting === user.user_id}
                                                    style={{
                                                        padding: '6px 12px', borderRadius: '6px',
                                                        border: "1px solid rgba(239,68,68,0.3)",
                                                        backgroundColor: 'rgba(239,68,68,0.1)',
                                                        color: '#EF4444', fontSize: '12px',
                                                        cursor: 'pointer', fontWeight: '600'
                                                    }}>
                                                    {deleting === user.user_id ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* User Detail Panel */}
                {selected && (
                    <div style={{
                        backgroundColor: '#111827',
                        border: "1px solid #3B82F640",
                        borderRadius: '12px', padding: '20px',
                        borderTop: "3px solid #3B82F6",
                        position: 'sticky', top: '80px',
                        maxHeight: 'calc(100vh - 120px)',
                        overflowY: 'auto',
                        width: '400px',
                        flexShrink: 0
                    }}>
                        {/* Panel Header */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '16px'
                        }}>
                            <h3 style={{ color: '#F1F5F9', fontSize: '15px', fontWeight: '600' }}>
                                {selected.user_id}
                            </h3>
                            <button
                                onClick={() => { setSelected(null); setUserHistory([]); setUserBaseline(null); }}
                                style={{
                                    backgroundColor: 'transparent', border: 'none',
                                    color: '#475569', fontSize: '18px', cursor: 'pointer'
                                }}>
                                ✕
                            </button>
                        </div>

                        {/* Summary Cards */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                            gap: '8px', marginBottom: '16px'
                        }}>
                            {[
                                { label: 'Total Readings', value: selected.total_readings, icon: '📊' },
                                { label: 'Latest Risk', value: selected.latest_risk, icon: '🎯' },
                                { label: 'Heart Rate', value: `${Math.round(selected.latest_hr)} BPM`, icon: '❤️' },
                                { label: 'SpO₂', value: `${Math.round(selected.latest_spo2)}%`, icon: '🫧' }
                            ].map((item, i) => (
                                <div key={i} style={{
                                    backgroundColor: '#0A0F1E', borderRadius: '8px',
                                    padding: '10px', border: "1px solid #1E2A3A",
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '16px', marginBottom: '4px' }}>{item.icon}</div>
                                    <div style={{
                                        fontSize: '13px', fontWeight: '700',
                                        color: item.label === 'Latest Risk'
                                            ? getRiskColor(item.value) : '#F1F5F9',
                                        wordBreak: 'break-word'
                                    }}>
                                        {item.value}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>
                                        {item.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Baseline */}
                        {userBaseline && userBaseline.avg_heart_rate && (
                            <div style={{
                                backgroundColor: 'rgba(6,182,212,0.05)',
                                border: "1px solid rgba(6,182,212,0.2)",
                                borderRadius: '8px', padding: '12px',
                                marginBottom: '16px'
                            }}>
                                <h4 style={{
                                    color: '#06B6D4', fontSize: '11px',
                                    letterSpacing: '0.5px', marginBottom: '10px'
                                }}>
                                    PERSONAL BASELINE
                                </h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                    {[
                                        { label: 'Avg HR', value: `${Math.round(userBaseline.avg_heart_rate)} BPM` },
                                        { label: 'Avg SpO₂', value: `${Math.round(userBaseline.avg_spo2)}%` },
                                        { label: 'Avg Sleep', value: `${parseFloat(userBaseline.avg_sleep).toFixed(1)}h` },
                                        { label: 'Avg Steps', value: Number(Math.round(userBaseline.avg_steps)).toLocaleString() }
                                    ].map((b, i) => (
                                        <div key={i} style={{ fontSize: '12px' }}>
                                            <span style={{ color: '#475569' }}>{b.label}: </span>
                                            <span style={{ color: '#F1F5F9', fontWeight: '600' }}>{b.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mini Chart */}
                        {loadingDetail ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#475569' }}>
                                Loading history...
                            </div>
                        ) : userHistory.length > 0 ? (
                            <>
                                <h4 style={{
                                    color: '#F1F5F9', fontSize: '12px',
                                    fontWeight: '600', marginBottom: '10px'
                                }}>
                                    Heart Rate & SpO₂ Trend
                                </h4>
                                <ResponsiveContainer width="100%" height={120}>
                                    <LineChart data={userHistory.slice(-10)}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3A" />
                                        <XAxis dataKey="name" stroke="#475569" fontSize={9} />
                                        <YAxis stroke="#475569" fontSize={9} />
                                        <Tooltip contentStyle={{
                                            backgroundColor: '#1E2A3A', border: 'none',
                                            borderRadius: '6px', color: '#F1F5F9', fontSize: '11px'
                                        }} />
                                        <Line type="monotone" dataKey="hr"
                                            stroke="#3B82F6" strokeWidth={2}
                                            dot={false} name="Heart Rate" />
                                        <Line type="monotone" dataKey="spo2"
                                            stroke="#06B6D4" strokeWidth={2}
                                            dot={false} name="SpO₂" />
                                    </LineChart>
                                </ResponsiveContainer>

                                <h4 style={{
                                    color: '#F1F5F9', fontSize: '12px',
                                    fontWeight: '600', marginTop: '16px', marginBottom: '10px'
                                }}>
                                    Recent Readings
                                </h4>
                                {userHistory.slice(-5).reverse().map((r, i) => (
                                    <div key={i} style={{
                                        backgroundColor: '#0A0F1E', borderRadius: '8px',
                                        padding: '10px 12px', marginBottom: '6px',
                                        border: "1px solid #1E2A3A"
                                    }}>
                                        <div style={{
                                            display: 'flex', justifyContent: 'space-between',
                                            alignItems: 'center', marginBottom: '4px'
                                        }}>
                                            <span style={{ fontSize: '11px', color: '#475569' }}>
                                                {formatDate(r.timestamp)}
                                            </span>
                                            <span style={{
                                                backgroundColor: `${getRiskColor(r.risk)}20`,
                                                color: getRiskColor(r.risk),
                                                padding: '2px 8px', borderRadius: '10px',
                                                fontSize: '11px', fontWeight: '600',
                                                border: `1px solid ${getRiskColor(r.risk)}40`,
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {r.risk}
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'flex', gap: '12px',
                                            fontSize: '12px', color: '#94A3B8',
                                            flexWrap: 'wrap'
                                        }}>
                                            <span>❤️ {r.hr} BPM</span>
                                            <span>🫧 {r.spo2}%</span>
                                            <span>😴 {r.sleep}h</span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#475569', fontSize: '13px' }}>
                                No reading history found
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;