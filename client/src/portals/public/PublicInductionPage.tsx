import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../api/client.js';
import { Shield, Check, ArrowRight } from 'lucide-react';

interface PublicInductionPageProps {
  onSuccess: () => void;
}

export const PublicInductionPage: React.FC<PublicInductionPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'LOGIN' | 'APPLY'>('LOGIN');

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [occupation, setOccupation] = useState('');
  const [city, setCity] = useState('');
  const [reasonToJoin, setReasonToJoin] = useState('');
  const [tierCode, setTierCode] = useState('GENERAL');
  const [regError, setRegError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const success = await login(loginEmail, loginPassword);
    if (success) {
      onSuccess();
    } else {
      setLoginError('Invalid Sovereign credentials or inactive account.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setSubmitting(true);
    try {
      const res = await api.auth.register({
        email: regEmail,
        password: regPassword,
        firstName,
        lastName,
        phone,
        occupation,
        city,
        reasonToJoin,
        membershipTypeCode: tierCode,
      });

      if (res.success && res.data?.token) {
        localStorage.setItem('sovereign_token', res.data.token);
        await login(regEmail, regPassword);
        onSuccess();
      } else {
        setRegError(res.error || 'Failed to complete member induction.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 16px',
        background: 'radial-gradient(circle at 50% 20%, rgba(201, 151, 56, 0.12) 0%, transparent 60%), #090a0f',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Brand Crest */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '14px',
              background: 'var(--gold-gradient)',
              margin: '0 auto 16px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--gold-glow-strong)',
            }}
          >
            <Shield size={32} color="#0b0d12" />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.9rem',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Sovereign Men's Club
          </h1>
          <p style={{ color: 'var(--text-gold)', fontSize: '0.82rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '6px', fontWeight: 600 }}>
            Build The Man • Carry The Responsibility • Lead With Purpose
          </p>
        </div>

        {/* Card Box */}
        <div className="card card-gold-border" style={{ padding: '32px' }}>
          {/* Switcher Tab */}
          <div style={{ display: 'flex', background: 'var(--bg-primary)', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
            <button
              className={`btn btn-sm ${mode === 'LOGIN' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => setMode('LOGIN')}
            >
              Member Sign In
            </button>
            <button
              className={`btn btn-sm ${mode === 'APPLY' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => setMode('APPLY')}
            >
              Induction Application
            </button>
          </div>

          {mode === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit}>
              {loginError && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
                  {loginError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Sovereign Identifier / Member ID / Email</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Member ID (e.g. pr/habtemariam/0001, SOV-001) or Email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••••••"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                Sign In to Command Center
              </button>

              <div style={{ marginTop: '20px', padding: '12px', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>Member Credentials:</strong> Use your Member ID (e.g. <code>pr/habtemariam/0001</code>, <code>SOV-001</code>) or email with password <code>Password123!</code>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit}>
              {regError && (
                <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
                  {regError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Create Password (Min 8 chars)</label>
                <input
                  type="password"
                  className="form-input"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Profession / Industry</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Civil Contractor"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City, State / Region</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Charlotte, NC"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Membership Track</label>
                <select
                  className="form-select"
                  value={tierCode}
                  onChange={(e) => setTierCode(e.target.value)}
                >
                  <option value="GENERAL">Sovereign Brother ($300/yr)</option>
                  <option value="EXECUTIVE">Executive Member ($600/yr)</option>
                  <option value="FOUNDING">Founding Council ($1,200/yr)</option>
                  <option value="YOUNG_LEADER">Rising Sovereign ($150/yr)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Why do you seek Sovereign Brotherhood?</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  required
                  placeholder="Outline your commitment to physical vitality, family leadership, and community service..."
                  value={reasonToJoin}
                  onChange={(e) => setReasonToJoin(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} disabled={submitting}>
                {submitting ? 'Creating Credential...' : 'Transmit Application & Induct'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
