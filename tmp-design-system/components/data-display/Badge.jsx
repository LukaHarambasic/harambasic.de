import React from 'react';

const STYLE_ID = 'hc-badge-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .hc-badge {
    display: inline-flex; align-items: center; gap: 0.4em;
    font-family: var(--font-sans); font-weight: var(--fw-semibold);
    font-size: var(--fs-caption); line-height: 1;
    padding: 0.34em 0.7em; border-radius: var(--radius-pill);
    border: 1px solid transparent; white-space: nowrap;
  }
  .hc-badge__dot { width: 0.5em; height: 0.5em; border-radius: 999px; background: currentColor; flex: 0 0 auto; }
  .hc-badge--neutral { background: var(--aub-100); color: var(--aub-700); }
  .hc-badge--ink     { background: var(--aub-900); color: var(--rose-100); }
  .hc-badge--honey   { background: var(--honey-100); color: var(--honey-700); }
  .hc-badge--clay    { background: var(--clay-100); color: var(--clay-600); }
  .hc-badge--success { background: var(--success-surface); color: #2f5c45; }
  .hc-badge--warning { background: var(--warning-surface); color: #8a5410; }
  .hc-badge--danger  { background: var(--danger-surface); color: #8a2f2f; }
  .hc-badge--info    { background: var(--info-surface); color: var(--aub-700); }
  `;
  document.head.appendChild(el);
}

/**
 * Badge — a compact status / category marker.
 */
export function Badge({ variant = 'neutral', dot = false, className = '', children, ...rest }) {
  const classes = ['hc-badge', `hc-badge--${variant}`, className].filter(Boolean).join(' ');
  return (
    <span className={classes} {...rest}>
      {dot && <span className="hc-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
