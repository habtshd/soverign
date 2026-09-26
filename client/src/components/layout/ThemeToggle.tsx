import React from 'react';
import { useTheme } from '../../context/ThemeContext.js';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', style = {} }) => {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      title={isLight ? 'Switch to Dark Mode (Obsidian)' : 'Switch to Light Mode (Ivory White)'}
      aria-label="Toggle visual theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        background: isLight ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.06)',
        border: '1px solid var(--border-gold)',
        borderRadius: '20px',
        padding: '6px 12px',
        cursor: 'pointer',
        color: isLight ? 'var(--text-gold)' : 'var(--gold-400)',
        fontSize: '0.75rem',
        fontWeight: 600,
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isLight ? '0 2px 8px rgba(184, 134, 11, 0.12)' : 'var(--gold-glow)',
        ...style,
      }}
    >
      {isLight ? (
        <>
          <Moon size={15} style={{ transition: 'transform 0.3s ease' }} />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun size={15} style={{ transition: 'transform 0.3s ease' }} />
          <span>White Mode</span>
        </>
      )}
    </button>
  );
};
