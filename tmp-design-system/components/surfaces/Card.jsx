import React from 'react';

const STYLE_ID = 'hc-card-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .hc-card {
    position: relative; border-radius: var(--radius-lg);
    background: var(--surface-card); color: var(--text-body);
    box-shadow: var(--ring-hairline), var(--shadow-sm);
    overflow: hidden;
    transition: box-shadow var(--dur-base) var(--ease-out),
                transform var(--dur-base) var(--ease-out);
  }
  .hc-card--pad-sm { padding: var(--sp-4); }
  .hc-card--pad-md { padding: var(--sp-6); }
  .hc-card--pad-lg { padding: var(--sp-7); }

  .hc-card--pink { background: var(--rose-100); box-shadow: var(--ring-hairline); }
  .hc-card--paper { background: var(--surface-paper); }
  .hc-card--ink { background: var(--aub-900); color: var(--text-on-ink); box-shadow: var(--shadow-md); }
  .hc-card--ink h1,.hc-card--ink h2,.hc-card--ink h3,.hc-card--ink h4 { color: var(--rose-100); }
  .hc-card--outline { background: transparent; box-shadow: inset 0 0 0 1px var(--border-default); }

  .hc-card--raised { box-shadow: var(--ring-hairline), var(--shadow-md); }
  .hc-card--interactive { cursor: pointer; }
  .hc-card--interactive:hover { transform: translateY(-2px); box-shadow: var(--ring-hairline), var(--shadow-lg); }

  .hc-card__grain { position: absolute; inset: 0; pointer-events: none;
    background-image: var(--grain); opacity: var(--grain-opacity); mix-blend-mode: multiply; }
  .hc-card > *:not(.hc-card__grain) { position: relative; }
  `;
  document.head.appendChild(el);
}

/**
 * Card — the workhorse surface. Soft hairline + low shadow by default;
 * tinted variants for pink / ink / paper sections. Optional paper grain.
 */
export function Card({
  surface = 'default',
  padding = 'md',
  raised = false,
  interactive = false,
  grain = false,
  as = 'div',
  className = '',
  children,
  ...rest
}) {
  const Tag = as;
  const surfClass = surface === 'default' ? '' : `hc-card--${surface}`;
  const classes = [
    'hc-card',
    surfClass,
    `hc-card--pad-${padding}`,
    raised ? 'hc-card--raised' : '',
    interactive ? 'hc-card--interactive' : '',
    className,
  ].filter(Boolean).join(' ');
  return (
    <Tag className={classes} {...rest}>
      {grain && <span className="hc-card__grain" aria-hidden="true" />}
      {children}
    </Tag>
  );
}
