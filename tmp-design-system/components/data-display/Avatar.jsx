import React from 'react';

const STYLE_ID = 'hc-avatar-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .hc-avatar {
    --_size: 40px;
    width: var(--_size); height: var(--_size);
    flex: 0 0 auto; position: relative;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--aub-900); color: var(--rose-100);
    font-family: var(--font-sans); font-weight: var(--fw-semibold);
    overflow: hidden; user-select: none;
  }
  .hc-avatar--circle { border-radius: 999px; }
  .hc-avatar--squircle { border-radius: 28%; }
  .hc-avatar--ring { box-shadow: 0 0 0 2px var(--surface-page), 0 0 0 3.5px var(--honey-500); }
  .hc-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .hc-avatar__initials { font-size: calc(var(--_size) * 0.4); letter-spacing: 0.02em; }
  `;
  document.head.appendChild(el);
}

const SIZES = { xs: 28, sm: 36, md: 48, lg: 64, xl: 96 };

function initialsFrom(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

/**
 * Avatar — the human face of a personal brand. Prefer the portrait mark
 * (pass src); falls back to initials on aubergine. Default shape is the
 * squircle that echoes the logo card.
 */
export function Avatar({
  src = null,
  name = '',
  size = 'md',
  shape = 'squircle',
  ring = false,
  className = '',
  ...rest
}) {
  const px = SIZES[size] || SIZES.md;
  const classes = [
    'hc-avatar',
    `hc-avatar--${shape}`,
    ring ? 'hc-avatar--ring' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <span className={classes} style={{ '--_size': px + 'px' }} {...rest}>
      {src
        ? <img src={src} alt={name || 'avatar'} />
        : <span className="hc-avatar__initials">{initialsFrom(name)}</span>}
    </span>
  );
}
