import React from 'react';

const STYLE_ID = 'hc-callout-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .hc-callout {
    display: grid; grid-template-columns: auto 1fr; gap: var(--sp-4);
    align-items: start; padding: var(--sp-5);
    border-radius: var(--radius-md);
    background: var(--surface-card); box-shadow: var(--ring-hairline);
  }
  .hc-callout__icon {
    width: 2rem; height: 2rem; border-radius: 999px; flex: 0 0 auto;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--aub-900); color: var(--rose-100);
  }
  .hc-callout__icon svg { width: 1.05rem; height: 1.05rem; display: block; }
  .hc-callout__title { font-family: var(--font-sans); font-weight: var(--fw-semibold);
    color: var(--text-strong); font-size: var(--fs-body); margin: 0 0 0.2em; }
  .hc-callout__body { font-size: var(--fs-body-sm); color: var(--text-muted); line-height: var(--lh-normal); }
  .hc-callout__body > :last-child { margin-bottom: 0; }

  .hc-callout--note    { background: var(--aub-50); }
  .hc-callout--honey   { background: var(--honey-100); }
  .hc-callout--honey  .hc-callout__icon { background: var(--honey-600); color: var(--rose-100); }
  .hc-callout--success { background: var(--success-surface); }
  .hc-callout--success .hc-callout__icon { background: var(--success); }
  .hc-callout--warning { background: var(--warning-surface); }
  .hc-callout--warning .hc-callout__icon { background: var(--warning); }
  .hc-callout--danger  { background: var(--danger-surface); }
  .hc-callout--danger  .hc-callout__icon { background: var(--danger); }
  `;
  document.head.appendChild(el);
}

/**
 * Callout — a noted block with a circular icon chip and a title. Uses a soft
 * tinted surface (not a colored left-border) to stay on-brand.
 */
export function Callout({ variant = 'note', icon = null, title, className = '', children, ...rest }) {
  const classes = ['hc-callout', `hc-callout--${variant}`, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {icon && <span className="hc-callout__icon" aria-hidden="true">{icon}</span>}
      <div>
        {title && <p className="hc-callout__title">{title}</p>}
        <div className="hc-callout__body">{children}</div>
      </div>
    </div>
  );
}
