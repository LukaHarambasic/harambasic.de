import React from 'react';

const STYLE_ID = 'hc-tag-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .hc-tag {
    display: inline-flex; align-items: center; gap: 0.5em;
    font-family: var(--font-mono); font-weight: var(--fw-medium);
    font-size: var(--fs-eyebrow); letter-spacing: 0.08em; text-transform: uppercase;
    line-height: 1; padding: 0.45em 0.7em;
    border-radius: var(--radius-xs);
    border: 1px solid var(--border-default); color: var(--text-muted);
    background: transparent;
  }
  .hc-tag--solid { background: var(--aub-50); border-color: var(--border-subtle); color: var(--aub-700); }
  .hc-tag--honey { border-color: var(--honey-500); color: var(--honey-700); background: var(--honey-100); }
  .hc-tag__x { cursor: pointer; opacity: 0.55; font-family: var(--font-sans); }
  .hc-tag__x:hover { opacity: 1; }
  `;
  document.head.appendChild(el);
}

/**
 * Tag — a monospaced, uppercase category chip. Quieter and more "metadata"
 * than Badge; good for taxonomies, filters, and eyebrow labels.
 */
export function Tag({ variant = 'outline', onRemove, className = '', children, ...rest }) {
  const v = variant === 'outline' ? '' : `hc-tag--${variant}`;
  const classes = ['hc-tag', v, className].filter(Boolean).join(' ');
  return (
    <span className={classes} {...rest}>
      {children}
      {onRemove && (
        <span className="hc-tag__x" role="button" aria-label="Remove" onClick={onRemove}>×</span>
      )}
    </span>
  );
}
