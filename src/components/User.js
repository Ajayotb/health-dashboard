import React, { useState } from 'react';
import { getHistory, getBaseline, setBaseline } from '../api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function User() {
    const [userId, setUserId] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [history, setHistory] = useState([]);
    const [baseline, setBaselineData] = useState(null);
    const [latest, setLatest] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [baselineMsg, setBaselineMsg] = useState(null);
    const [language, setLanguage] = useState('english');

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

    const getRiskBg = (risk) => {
        if (risk === 'Normal') return 'rgba(16,185,129,0.1)';
        if (risk === 'Mild Risk') return 'rgba(245,158,11,0.1)';
        return 'rgba(239,68,68,0.1)';
    };

    const handleLogin = async () => {
        if (!userId.trim()) return;
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
            })).reverse();

            setHistory(formatted);
            setChartData(formatted.slice(-7));
            if (data.length > 0) setLatest(data[0]);

            const base = await getBaseline(userId);
            setBaselineData(base);
            setLoggedIn(true);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleSetBaseline = async () => {
        try {
            const result = await setBaseline(userId);
            setBaselineMsg(result.message || result.error);
            const base = await getBaseline(userId);
            setBaselineData(base);
        } catch (err) {
            setBaselineMsg('Failed to set baseline');
        }
    };

    const handleLogout = () => {
        setLoggedIn(false);
        setUserId('');
        setHistory([]);
        setLatest(null);
        setBaselineData(null);
        setBaselineMsg(null);
    };

    // Login Screen
    if (!loggedIn) {
        return (
            <div style={{
                minHeight: '80vh', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '16px', padding: '40px',
                    width: '100%', maxWidth: '420px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>❤️</div>
                    <h2 style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '22px', fontWeight: '700',
                        color: '#F1F5F9', marginBottom: '8px'
                    }}>
                        My Health Dashboard
                    </h2>
                    <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                        Enter your User ID to view your personal health data
                    </p>

                    <input
                        style={{
                            width: '100%', padding: '12px 16px',
                            backgroundColor: '#0A0F1E',
                            border: "1px solid #1E2A3A",
                            borderRadius: '8px', color: '#F1F5F9',
                            fontSize: '15px', outline: 'none',
                            marginBottom: '12px', textAlign: 'center'
                        }}
                        placeholder="e.g. user_001"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    />

                    <select
                        style={{
                            width: '100%', padding: '12px 16px',
                            backgroundColor: '#0A0F1E',
                            border: "1px solid #1E2A3A",
                            borderRadius: '8px', color: '#F1F5F9',
                            fontSize: '15px', outline: 'none',
                            marginBottom: '20px'
                        }}
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="english">🇬🇧 English</option>
                        <option value="yoruba">Yoruba</option>
                        <option value="hausa">Hausa</option>
                        <option value="igbo">Igbo</option>
                    </select>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '12px',
                            background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                            border: 'none', borderRadius: '8px',
                            color: 'white', fontSize: '15px',
                            fontWeight: '600', cursor: 'pointer',
                            marginBottom: '16px'
                        }}>
                        {loading ? 'Loading...' : 'View My Health Data →'}
                    </button>

                    {/* Disclaimer on login */}
                    <div style={{
                        backgroundColor: 'rgba(59,130,246,0.05)',
                        border: "1px solid rgba(59,130,246,0.2)",
                        borderRadius: '8px', padding: '12px',
                        textAlign: 'left'
                    }}>
                        <p style={{
                            color: '#94A3B8', fontSize: '11px',
                            lineHeight: '1.6', margin: 0
                        }}>
                            <strong style={{ color: '#3B82F6' }}>ℹ️ Disclaimer:</strong> This system provides AI-powered health risk assessments for informational purposes only. It is not a medical device and does not provide medical diagnoses, prescriptions, or professional medical advice. Always consult a qualified healthcare provider for medical concerns.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // User Dashboard
    return (
        <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '24px'
            }}>
                <div>
                    <h1 style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '24px', fontWeight: '700', color: '#F1F5F9'
                    }}>
                        Welcome, {userId} 👋
                    </h1>
                    <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px' }}>
                        Your personal health monitoring summary
                    </p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px', borderRadius: '8px',
                        border: "1px solid #1E2A3A",
                        backgroundColor: 'transparent',
                        color: '#94A3B8', fontSize: '13px',
                        cursor: 'pointer'
                    }}>
                    Switch User
                </button>
            </div>

            {/* Current Risk Level */}
            {latest && (
                <div style={{
                    backgroundColor: getRiskBg(latest.risk_level),
                    border: `1px solid ${getRiskColor(latest.risk_level)}40`,
                    borderLeft: `4px solid ${getRiskColor(latest.risk_level)}`,
                    borderRadius: '12px', padding: '24px',
                    marginBottom: '16px', textAlign: 'center'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                        {getRiskIcon(latest.risk_level)}
                    </div>
                    <div style={{
                        fontSize: '28px', fontWeight: '700',
                        color: getRiskColor(latest.risk_level),
                        fontFamily: 'Space Grotesk, sans-serif',
                        marginBottom: '8px'
                    }}>
                        {latest.risk_level}
                    </div>
                    <p style={{ color: '#94A3B8', fontSize: '14px' }}>
                        Your current health risk level based on latest reading
                    </p>
                    {baseline && baseline.avg_heart_rate && (
                        <div style={{
                            display: 'inline-block', marginTop: '12px',
                            backgroundColor: 'rgba(6,182,212,0.1)',
                            border: "1px solid rgba(6,182,212,0.3)",
                            borderRadius: '20px', padding: '4px 14px'
                        }}>
                            <span style={{ fontSize: '12px', color: '#06B6D4' }}>
                                ✅ Using your personal baseline
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Disclaimer */}
            <div style={{
                backgroundColor: 'rgba(59,130,246,0.05)',
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: '10px', padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex', gap: '10px', alignItems: 'flex-start'
            }}>
                <span style={{ fontSize: '16px', marginTop: '1px' }}>ℹ️</span>
                <p style={{
                    color: '#94A3B8', fontSize: '12px',
                    lineHeight: '1.6', margin: 0
                }}>
                    <strong style={{ color: '#3B82F6' }}>Disclaimer:</strong> This system provides AI-powered health risk assessments for informational purposes only. It is not a medical device and does not provide medical diagnoses, prescriptions, or professional medical advice. Always consult a qualified healthcare provider for medical concerns. Do not make health decisions based solely on this system's predictions.
                </p>
            </div>

            {/* Metrics Grid */}
            {latest && (
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '12px', marginBottom: '20px'
                }}>
                    {[
                        { icon: '❤️', label: 'Heart Rate', value: `${latest.heart_rate}`, unit: 'BPM' },
                        { icon: '🫧', label: 'Blood Oxygen', value: `${latest.spo2}`, unit: '%' },
                        { icon: '👟', label: 'Steps Today', value: Number(latest.steps).toLocaleString(), unit: 'steps' },
                        { icon: '😴', label: 'Sleep', value: `${latest.sleep_hours}`, unit: 'hrs' }
                    ].map((m, i) => (
                        <div key={i} style={{
                            backgroundColor: '#111827',
                            border: "1px solid #1E2A3A",
                            borderRadius: '12px', padding: '16px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{m.icon}</div>
                            <div style={{
                                fontSize: '24px', fontWeight: '700',
                                color: '#F1F5F9',
                                fontFamily: 'Space Grotesk, sans-serif'
                            }}>
                                {m.value}
                            </div>
                            <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                                {m.unit}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                                {m.label}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Trend Chart */}
            {chartData.length > 0 && (
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{
                        color: '#F1F5F9', fontSize: '14px',
                        fontWeight: '600', marginBottom: '16px'
                    }}>
                        My Health Trend (Last 7 Readings)
                    </h3>
                    <ResponsiveContainer width="100%" height={180}>
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
                            <XAxis dataKey="name" stroke="#475569" fontSize={11} />
                            <YAxis stroke="#475569" fontSize={11} />
                            <Tooltip contentStyle={{
                                backgroundColor: '#1E2A3A',
                                border: 'none', borderRadius: '8px',
                                color: '#F1F5F9'
                            }} />
                            <Area type="monotone" dataKey="heart_rate"
                                stroke="#3B82F6" fill="url(#hrGrad)"
                                name="Heart Rate" strokeWidth={2} />
                            <Area type="monotone" dataKey="spo2"
                                stroke="#06B6D4" fill="url(#spo2Grad)"
                                name="SpO₂" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Personal Baseline */}
            {baseline && baseline.avg_heart_rate ? (
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px',
                    marginBottom: '20px'
                }}>
                    <h3 style={{
                        color: '#F1F5F9', fontSize: '14px',
                        fontWeight: '600', marginBottom: '16px'
                    }}>
                        My Personal Baseline
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '12px'
                    }}>
                        {[
                            { label: 'Normal HR', value: `${baseline.avg_heart_rate} BPM`, icon: '❤️' },
                            { label: 'Normal SpO₂', value: `${baseline.avg_spo2}%`, icon: '🫧' },
                            { label: 'Normal Sleep', value: `${baseline.avg_sleep}h`, icon: '😴' },
                            { label: 'Normal Steps', value: Number(baseline.avg_steps).toLocaleString(), icon: '👟' }
                        ].map((item, i) => (
                            <div key={i} style={{
                                backgroundColor: '#0A0F1E',
                                borderRadius: '8px', padding: '12px',
                                border: "1px solid #1E2A3A",
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                                <div style={{
                                    fontSize: '16px', fontWeight: '700',
                                    color: '#06B6D4',
                                    fontFamily: 'Space Grotesk, sans-serif'
                                }}>
                                    {item.value}
                                </div>
                                <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px',
                    marginBottom: '20px', textAlign: 'center'
                }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                    <h3 style={{ color: '#F1F5F9', fontSize: '15px', marginBottom: '8px' }}>
                        No Personal Baseline Yet
                    </h3>
                    <p style={{ color: '#94A3B8', fontSize: '13px', marginBottom: '16px' }}>
                        Send at least 5 readings then click below to establish your personal health baseline
                    </p>
                    <button
                        onClick={handleSetBaseline}
                        style={{
                            padding: '10px 24px', borderRadius: '8px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                            color: 'white', fontSize: '14px',
                            fontWeight: '600', cursor: 'pointer'
                        }}>
                        Establish My Baseline
                    </button>
                    {baselineMsg && (
                        <p style={{ color: '#10B981', fontSize: '13px', marginTop: '10px' }}>
                            {baselineMsg}
                        </p>
                    )}
                </div>
            )}

            {/* Reading History Table */}
            {history.length > 0 && (
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '20px'
                }}>
                    <h3 style={{
                        color: '#F1F5F9', fontSize: '14px',
                        fontWeight: '600', marginBottom: '16px'
                    }}>
                        My Reading History ({history.length} readings)
                    </h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #1E2A3A" }}>
                                {['#', 'Heart Rate', 'SpO₂', 'Steps', 'Sleep', 'Risk'].map((h, i) => (
                                    <th key={i} style={{
                                        padding: '10px 12px', textAlign: 'left',
                                        fontSize: '11px', color: '#475569',
                                        fontWeight: '600', letterSpacing: '0.5px',
                                        textTransform: 'uppercase'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {history.slice(0, 10).map((r, i) => (
                                <tr key={i} style={{
                                    borderBottom: "1px solid #1E2A3A",
                                    backgroundColor: i % 2 === 0
                                        ? 'transparent'
                                        : 'rgba(30,42,58,0.3)'
                                }}>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#94A3B8' }}>{r.name}</td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>{r.heart_rate} BPM</td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>{r.spo2}%</td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>{Number(r.steps).toLocaleString()}</td>
                                    <td style={{ padding: '10px 12px', fontSize: '13px', color: '#F1F5F9' }}>{r.sleep}h</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <span style={{
                                            backgroundColor: `${getRiskColor(r.risk)}20`,
                                            color: getRiskColor(r.risk),
                                            padding: '3px 10px', borderRadius: '12px',
                                            fontSize: '12px', fontWeight: '600',
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
            )}
        </div>
    );
}

export default User;