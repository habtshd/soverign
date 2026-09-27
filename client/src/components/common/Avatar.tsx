import React from 'react';

interface AvatarProps {
  name?: string;
  firstName?: string;
  lastName?: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  firstName,
  lastName,
  size = 36,
  className = '',
  style = {},
}) => {
  let initials = 'SM';
  if (firstName || lastName) {
    const f = firstName?.trim()?.[0] || '';
    const l = lastName?.trim()?.[0] || '';
    initials = `${f}${l}`.toUpperCase() || 'M';
  } else if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      initials = `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    } else if (parts[0]) {
      initials = parts[0].slice(0, 2).toUpperCase();
    }
  }

  const fontSize = Math.max(11, Math.round(size * 0.38));

  return (
    <div
      className={`user-avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #1c2130 0%, #0f121a 100%)',
        border: '1px solid rgba(201, 151, 56, 0.4)',
        color: 'var(--gold-400)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: `${fontSize}px`,
        fontFamily: 'var(--font-sans)',
        letterSpacing: '0.02em',
        userSelect: 'none',
        flexShrink: 0,
        ...style,
      }}
      title={name || `${firstName || ''} ${lastName || ''}`.trim() || 'Member'}
    >
      {initials}
    </div>
  );
};
