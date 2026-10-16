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
      className={`topbar-action-btn theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      title={isLight ? 'Switch to Obsidian Dark Mode' : 'Switch to Ivory Light Mode'}
      aria-label="Toggle theme"
      style={style}
    >
      <span className="theme-icon-container">
        {isLight ? (
          <Moon size={16} className="theme-icon moon-icon" />
        ) : (
          <Sun size={16} className="theme-icon sun-icon" />
        )}
      </span>
    </button>
  );
};
