import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import { api } from '../../api/client.js';
import { 
  Shield, 
  ArrowRight, 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { ThemeToggle } from '../../components/layout/ThemeToggle.js';

import { SovereignReadinessWizard } from './SovereignReadinessWizard.js';

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
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      const success = await login(loginEmail, loginPassword);
      if (success) {
        onSuccess();
      } else {
        setLoginError('Invalid Sovereign identifier or password. Please verify credentials.');
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleWizardSuccess = async ({ email, pass }: { email: string; pass: string }) => {
    try {
      await login(email, pass);
      onSuccess();
    } catch (err) {
      setMode('LOGIN');
      setLoginEmail(email);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-ambient-glow" />

      {/* Floating Theme Switcher */}
      <div style={{ position: 'absolute', top: '24px', right: '24px', zIndex: 10 }}>
        <ThemeToggle />
      </div>

      <div className={`auth-content-box ${mode === 'APPLY' ? 'induction-wide' : ''}`}>
        {/* Brand Lockup */}
        <div className="auth-brand-lockup">
          <div className="auth-crest-wrapper">
            <div className="auth-crest-glow" />
            <img
              src="/logo.png"
              alt="Sovereign Men's Club"
              className="logo-dark auth-crest-img"
            />
            <img
              src="/logo-light.png"
              alt="Sovereign Men's Club"
              className="logo-light auth-crest-img"
            />
          </div>
          <h1 className="auth-brand-title">
            Sovereign Men's Club
          </h1>
          <p className="auth-brand-motto">
            Build The Man • Carry The Responsibility • Lead With Purpose
          </p>
        </div>

        {/* Card Box */}
        <div className="auth-card">
          <div className="auth-card-topline" />

          {/* Segmented Control */}
          <div className="auth-nav-tabs">
            <button
              type="button"
              className={`auth-tab-pill ${mode === 'LOGIN' ? 'active' : ''}`}
              onClick={() => setMode('LOGIN')}
            >
              Member Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-pill ${mode === 'APPLY' ? 'active' : ''}`}
              onClick={() => setMode('APPLY')}
            >
              Registration & Readiness Application
            </button>
          </div>

          {mode === 'LOGIN' ? (
            <form onSubmit={handleLoginSubmit}>
              {loginError && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#ef4444',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '0.83rem',
                }}>
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{loginError}</span>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label className="auth-field-label">
                  <span>Sovereign Identifier / Email</span>
                </label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <User size={16} />
                  </span>
                  <input
                    type="text"
                    className="auth-text-input"
                    placeholder="Member ID (e.g. MAN 001) or Email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="auth-field-label">
                  <span>Password</span>
                </label>
                <div className="auth-input-container">
                  <span className="auth-input-icon">
                    <Lock size={16} />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-text-input"
                    placeholder="••••••••••••"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="auth-toggle-pwd-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loggingIn}
              >
                {loggingIn ? (
                  <>
                    <Loader2 size={17} className="animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Command Center</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <SovereignReadinessWizard
              onSuccess={handleWizardSuccess}
              onCancel={() => setMode('LOGIN')}
            />
          )}
        </div>

        <div className="auth-footer">
          Sovereign Men's Club • Digital Community Operating System • Encrypted & Sovereign
        </div>
      </div>
    </div>
  );
};
