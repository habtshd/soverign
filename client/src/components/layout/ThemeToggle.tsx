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
      className={`icon-btn ${className}`}
      onClick={toggleTheme}
      title={isLight ? 'Switch to Dark Mode (Obsidian)' : 'Switch to Light Mode (Ivory White)'}
      aria-label="Toggle theme"
      style={style}
    >
      {isLight ? (
        <Moon size={17} style={{ transition: 'transform 0.2s ease' }} />
      ) : (
        <Sun size={17} style={{ transition: 'transform 0.2s ease' }} />
      )}
    </button>
  );
};
