import React, { useState } from 'react';
import { getHistory, getBaseline, setBaseline } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function History() {
    const [userId, setUserId] = useState('user_001');
    const [history, setHistory] = useState([]);
    const [baseline, setBaselineData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [baselineMsg, setBaselineMsg] = useState(null);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const data = await getHistory(userId);
            const formatted = data.map((r, i) => ({
                name: `R${i + 1}`,
                heart_rate: r.heart_rate,
                spo2: r.spo2,
                steps: r.steps,
                sleep: r.sleep_hours,
                risk: r.risk_level
            }));
            setHistory(formatted.reverse());
            const base = await getBaseline(userId);
            setBaselineData(base);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSetBaseline = async () => {
        try {
            const result = await setBaseline(userId);
            setBaselineMsg(result.message || result.error);
        } catch (err) {
            setBaselineMsg('Failed to set baseline');
        }
    };

    const getRiskColor = (risk) => {
        if (risk === 'Normal') return '#10B981';
        if (risk === 'Mild Risk') return '#F59E0B';
        return '#EF4444';
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '24px', fontWeight: '700', color: '#F1F5F9'
                }}>Health History</h1>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px' }}>
                    View readings, trends and manage personal baselines
                </p>
            </div>

            {/* Search Bar */}
            <div style={{
                backgroundColor: '#111827',
                border: "1px solid #1E2A3A",
                borderRadius: '12px', padding: '20px', marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                        style={{
                            flex: 1,
                            padding: '10px 14px',
                            backgroundColor: '#0A0F1E',
                            border: "1px solid #1E2A3A",
                            borderRadius: '8px',
                            color: '#F1F5F9',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter User ID (e.g. user_001)"
                    />
                    <button
                        onClick={fetchHistory}
                        style={{
                            padding: '10px 20px', borderRadius: '8px',
                            border: 'none', backgroundColor: '#3B82F6',
                            color: 'white', fontSize: '14px',
                            fontWeight: '600', cursor: 'pointer'
                        }}>
                        {loading ? 'Loading...' : 'Load History'}
                    </button>
                    <button
                        onClick={handleSetBaseline}
                        style={{
                            padding: '10px 20px', borderRadius: '8px',
                            border: 'none', backgroundColor: '#10B981',
                            color: 'white', fontSize: '14px',
                            fontWeight: '600', cursor: 'pointer'
                        }}>
                        Set Baseline
                    </button>
                </div>
                {baselineMsg && (
                    <p style={{ color: '#10B981', fontSize: '13px', marginTop: '10px' }}>
                        ✅ {baselineMsg}
                    </p>
                )}
            </div>

            {/* Baseline Card */}
            {baseline && baseline.avg_heart_rate && (
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px', marginBottom: '20px'
                }}>
                    <h3 style={{
                        color: '#F1F5F9', fontSize: '14px',
                        fontWeight: '600', marginBottom: '16px'
                    }}>
                        Personal Baseline — {userId}
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '12px'
                    }}>
                        {[
                            { label: 'Avg Heart Rate', value: `${baseline.avg_heart_rate} BPM`, icon: '❤️' },
                            { label: 'Avg SpO₂', value: `${baseline.avg_spo2}%`, icon: '🫧' },
                            { label: 'Avg Sleep', value: `${baseline.avg_sleep}h`, icon: '😴' },
                            { label: 'Avg Steps', value: Number(baseline.avg_steps).toLocaleString(), icon: '👟' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                backgroundColor: '#0A0F1E',
                                borderRadius: '8px',
                                padding: '14px',
                                border: "1px solid #1E2A3A",
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
                                <div style={{
                                    fontSize: '18px', fontWeight: '700',
                                    color: '#06B6D4',
                                    fontFamily: 'Space Grotesk, sans-serif'
                                }}>
                                    {item.value}
                                </div>
                                <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px' }}>
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Charts */}
            {history.length > 0 && (
                <>
                    <div style={{
                        backgroundColor: '#111827',
                        border: "1px solid #1E2A3A",
                        borderRadius: '12px', padding: '20px', marginBottom: '16px'
                    }}>
                        <h3 style={{
                            color: '#F1F5F9', fontSize: '14px',
                            fontWeight: '600', marginBottom: '16px'
                        }}>
                            Heart Rate & SpO₂ Trend
                        </h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E2A3A" />
                                <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                                <YAxis stroke="#475569" fontSize={11} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1E2A3A',
                                        border: 'none',
                                        borderRadius: '8px',
                                        color: '#F1F5F9'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone" dataKey="heart_rate"
                                    stroke="#3B82F6" strokeWidth={2}
                                    dot={false} name="Heart Rate (BPM)"
                                />
                                <Line
                                    type="monotone" dataKey="spo2"
                                    stroke="#06B6D4" strokeWidth={2}
                                    dot={false} name="SpO₂ (%)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Table */}
                    <div style={{
                        backgroundColor: '#111827',
                        border: "1px solid #1E2A3A",
                        borderRadius: '12px', padding: '20px'
                    }}>
                        <h3 style={{
                            color: '#F1F5F9', fontSize: '14px',
                            fontWeight: '600', marginBottom: '16px'
                        }}>
                            Recent Readings
                        </h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #1E2A3A" }}>
                                    {['Reading', 'Heart Rate', 'SpO₂', 'Steps', 'Sleep', 'Risk Level'].map((h, i) => (
                                        <th key={i} style={{
                                            padding: '10px 12px',
                                            textAlign: 'left',
                                            fontSize: '11px',
                                            color: '#475569',
                                            fontWeight: '600',
                                            letterSpacing: '0.5px',
                                            textTransform: 'uppercase'
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((r, i) => (
                                    <tr key={i} style={{
                                        borderBottom: "1px solid #1E2A3A",
                                        backgroundColor: i % 2 === 0
                                            ? 'transparent'
                                            : 'rgba(30,42,58,0.3)'
                                    }}>
                                        <td style={{ padding: '10px 12px', fontSize: '13px', color: '#94A3B8' }}>{r.name}</td>
                                        <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>{r.heart_rate} BPM</td>
                                        <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>{r.spo2}%</td>
                                        <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>
                                            {Number(r.steps).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>{r.sleep}h</td>
                                        <td style={{ padding: '10px 12px' }}>
                                            <span style={{
                                                backgroundColor: `${getRiskColor(r.risk)}20`,
                                                color: getRiskColor(r.risk),
                                                padding: '3px 10px',
                                                borderRadius: '12px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                border: `1px solid ${getRiskColor(r.risk)}40`
                                            }}>
                                                {r.risk}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default History;