import React, { useState } from 'react';
import { predictRisk } from '../api';

function Predict() {
    const [form, setForm] = useState({
        user_id: 'user_001',
        heart_rate: '',
        spo2: '',
        steps: '',
        sleep_hours: '',
        activity_level: 'active',
        language: 'english'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const updated = { ...form, [e.target.name]: e.target.value };

        // Auto-derive activity level from steps
        if (e.target.name === 'steps') {
            const steps = parseInt(e.target.value);
            if (steps < 3000) {
                updated.activity_level = 'sedentary';
            } else if (steps < 8000) {
                updated.activity_level = 'active';
            } else {
                updated.activity_level = 'highly active';
            }
        }

        setForm(updated);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = {
                ...form,
                heart_rate: parseFloat(form.heart_rate),
                spo2: parseFloat(form.spo2),
                steps: parseInt(form.steps),
                sleep_hours: parseFloat(form.sleep_hours)
            };
            const response = await predictRisk(data);
            setResult(response);
        } catch (err) {
            setError('Cannot connect to server. Make sure backend is running at port 8000.');
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

    return (
        <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '24px', fontWeight: '700', color: '#F1F5F9'
                }}>
                    New Health Reading
                </h1>
                <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '4px' }}>
                    Enter physiological data to get an AI-powered risk assessment
                </p>
            </div>

            {/* Input Form */}
            <div style={{
                backgroundColor: '#111827',
                border: "1px solid #1E2A3A",
                borderRadius: '12px', padding: '24px', marginBottom: '20px'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                        <label style={{
                            display: 'block', fontSize: '12px',
                            color: '#94A3B8', marginBottom: '6px',
                            fontWeight: '500', letterSpacing: '0.3px'
                        }}>USER ID</label>
                        <input
                            style={{
                                width: '100%', padding: '10px 14px',
                                backgroundColor: '#0A0F1E',
                                border: "1px solid #1E2A3A",
                                borderRadius: '8px', color: '#F1F5F9',
                                fontSize: '14px', outline: 'none'
                            }}
                            name="user_id"
                            value={form.user_id}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'block', fontSize: '12px',
                            color: '#94A3B8', marginBottom: '6px',
                            fontWeight: '500', letterSpacing: '0.3px'
                        }}>LANGUAGE</label>
                        <select
                            style={{
                                width: '100%', padding: '10px 14px',
                                backgroundColor: '#0A0F1E',
                                border: "1px solid #1E2A3A",
                                borderRadius: '8px', color: '#F1F5F9',
                                fontSize: '14px', outline: 'none'
                            }}
                            name="language"
                            value={form.language}
                            onChange={handleChange}>
                            <option value="english">🇬🇧 English</option>
                            <option value="yoruba">Yoruba</option>
                            <option value="hausa">Hausa</option>
                            <option value="igbo">Igbo</option>
                        </select>
                    </div>
                    <div>
                        <label style={{
                            display: 'block', fontSize: '12px',
                            color: '#94A3B8', marginBottom: '6px',
                            fontWeight: '500', letterSpacing: '0.3px'
                        }}>HEART RATE (BPM)</label>
                        <input
                            style={{
                                width: '100%', padding: '10px 14px',
                                backgroundColor: '#0A0F1E',
                                border: "1px solid #1E2A3A",
                                borderRadius: '8px', color: '#F1F5F9',
                                fontSize: '14px', outline: 'none'
                            }}
                            name="heart_rate"
                            type="number"
                            value={form.heart_rate}
                            onChange={handleChange}
                            placeholder="e.g. 72"
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'block', fontSize: '12px',
                            color: '#94A3B8', marginBottom: '6px',
                            fontWeight: '500', letterSpacing: '0.3px'
                        }}>BLOOD OXYGEN (%)</label>
                        <input
                            style={{
                                width: '100%', padding: '10px 14px',
                                backgroundColor: '#0A0F1E',
                                border: "1px solid #1E2A3A",
                                borderRadius: '8px', color: '#F1F5F9',
                                fontSize: '14px', outline: 'none'
                            }}
                            name="spo2"
                            type="number"
                            value={form.spo2}
                            onChange={handleChange}
                            placeholder="e.g. 98"
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'block', fontSize: '12px',
                            color: '#94A3B8', marginBottom: '6px',
                            fontWeight: '500', letterSpacing: '0.3px'
                        }}>STEP COUNT</label>
                        <input
                            style={{
                                width: '100%', padding: '10px 14px',
                                backgroundColor: '#0A0F1E',
                                border: "1px solid #1E2A3A",
                                borderRadius: '8px', color: '#F1F5F9',
                                fontSize: '14px', outline: 'none'
                            }}
                            name="steps"
                            type="number"
                            value={form.steps}
                            onChange={handleChange}
                            placeholder="e.g. 8000"
                        />
                    </div>
                    <div>
                        <label style={{
                            display: 'block', fontSize: '12px',
                            color: '#94A3B8', marginBottom: '6px',
                            fontWeight: '500', letterSpacing: '0.3px'
                        }}>SLEEP DURATION (HRS)</label>
                        <input
                            style={{
                                width: '100%', padding: '10px 14px',
                                backgroundColor: '#0A0F1E',
                                border: "1px solid #1E2A3A",
                                borderRadius: '8px', color: '#F1F5F9',
                                fontSize: '14px', outline: 'none'
                            }}
                            name="sleep_hours"
                            type="number"
                            value={form.sleep_hours}
                            onChange={handleChange}
                            placeholder="e.g. 7.5"
                        />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{
                            display: 'block', fontSize: '12px',
                            color: '#94A3B8', marginBottom: '6px',
                            fontWeight: '500', letterSpacing: '0.3px'
                        }}>
                            ACTIVITY LEVEL
                            <span style={{
                                color: '#475569', fontSize: '11px',
                                marginLeft: '8px', fontWeight: '400'
                            }}>
                                (auto-set from steps)
                            </span>
                        </label>
                        <select
                            style={{
                                width: '100%', padding: '10px 14px',
                                backgroundColor: '#0A0F1E',
                                border: "1px solid #1E2A3A",
                                borderRadius: '8px', color: '#F1F5F9',
                                fontSize: '14px', outline: 'none'
                            }}
                            name="activity_level"
                            value={form.activity_level}
                            onChange={handleChange}>
                            <option value="sedentary">Sedentary (under 3,000 steps)</option>
                            <option value="active">Active (3,000 - 7,999 steps)</option>
                            <option value="highly active">Highly Active (8,000+ steps)</option>
                        </select>
                        <p style={{
                            fontSize: '11px', color: '#475569',
                            marginTop: '4px'
                        }}>
                            Auto-updates when you enter steps. You can still override manually.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        width: '100%', marginTop: '20px',
                        padding: '12px', borderRadius: '8px',
                        border: 'none',
                        background: loading
                            ? '#1E2A3A'
                            : 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                        color: 'white', fontSize: '15px',
                        fontWeight: '600',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        letterSpacing: '0.3px'
                    }}>
                    {loading ? 'Analyzing...' : 'Analyze Health Data →'}
                </button>
            </div>

            {/* Error */}
            {error && (
                <div style={{
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: '8px', padding: '12px 16px',
                    color: '#EF4444', fontSize: '14px',
                    marginBottom: '16px'
                }}>
                    ⚠️ {error}
                </div>
            )}

            {/* Risk Result */}
            {result && (
                <div style={{
                    backgroundColor: '#111827',
                    border: `1px solid ${getRiskColor(result.risk_level)}40`,
                    borderRadius: '12px', padding: '24px',
                    borderLeft: `4px solid ${getRiskColor(result.risk_level)}`,
                    marginBottom: '16px'
                }}>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: '12px', marginBottom: '16px'
                    }}>
                        <span style={{ fontSize: '32px' }}>
                            {getRiskIcon(result.risk_level)}
                        </span>
                        <div>
                            <div style={{
                                fontSize: '22px', fontWeight: '700',
                                color: getRiskColor(result.risk_level),
                                fontFamily: 'Space Grotesk, sans-serif'
                            }}>
                                {result.risk_level}
                            </div>
                            <div style={{ fontSize: '13px', color: '#94A3B8' }}>
                                Confidence: {result.confidence}%
                            </div>
                        </div>
                    </div>
                    <p style={{
                        fontSize: '15px', color: '#F1F5F9',
                        backgroundColor: '#0A0F1E',
                        padding: '12px 16px', borderRadius: '8px',
                        marginBottom: '12px'
                    }}>
                        {result.message}
                    </p>
                    <div style={{
                        fontSize: '12px', color: '#94A3B8',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                        {result.personalized
                            ? '✅ Using your personal physiological baseline'
                            : '📊 Using global clinical thresholds'}
                    </div>
                </div>
            )}

            {/* Health Advice */}
            {result && result.advice && (
                <div style={{
                    backgroundColor: '#111827',
                    border: "1px solid #1E2A3A",
                    borderRadius: '12px', padding: '24px',
                    marginBottom: '16px'
                }}>
                    <h3 style={{
                        color: '#F1F5F9', fontSize: '15px',
                        fontWeight: '600', marginBottom: '16px'
                    }}>
                        💡 Health Advice
                    </h3>
                    <p style={{
                        color: '#94A3B8', fontSize: '14px',
                        marginBottom: '16px', lineHeight: '1.6'
                    }}>
                        {result.advice.summary}
                    </p>
                    {result.advice.observations.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                            <h4 style={{
                                color: '#06B6D4', fontSize: '12px',
                                marginBottom: '10px', letterSpacing: '0.5px'
                            }}>
                                OBSERVATIONS
                            </h4>
                            {result.advice.observations.map((obs, i) => (
                                <div key={i} style={{
                                    display: 'flex', gap: '8px',
                                    marginBottom: '6px', alignItems: 'flex-start'
                                }}>
                                    <span style={{ color: '#3B82F6', marginTop: '2px' }}>•</span>
                                    <span style={{
                                        color: '#94A3B8', fontSize: '13px',
                                        lineHeight: '1.5'
                                    }}>
                                        {obs}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                    {result.advice.tips.length > 0 && (
                        <div>
                            <h4 style={{
                                color: '#10B981', fontSize: '12px',
                                marginBottom: '10px', letterSpacing: '0.5px'
                            }}>
                                RECOMMENDATIONS
                            </h4>
                            {result.advice.tips.map((tip, i) => (
                                <div key={i} style={{
                                    display: 'flex', gap: '8px',
                                    marginBottom: '8px', alignItems: 'flex-start',
                                    backgroundColor: '#0A0F1E',
                                    padding: '10px 12px', borderRadius: '8px',
                                    border: "1px solid #1E2A3A"
                                }}>
                                    <span style={{ color: '#10B981', marginTop: '1px' }}>✓</span>
                                    <span style={{
                                        color: '#F1F5F9', fontSize: '13px',
                                        lineHeight: '1.5'
                                    }}>
                                        {tip}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Disclaimer */}
            {result && (
                <div style={{
                    backgroundColor: 'rgba(59,130,246,0.05)',
                    border: "1px solid rgba(59,130,246,0.2)",
                    borderRadius: '10px', padding: '14px 18px',
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
            )}
        </div>
    );
}

export default Predict;