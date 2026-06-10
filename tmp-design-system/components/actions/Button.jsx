import React from 'react';

/* Inject component styles once (self-contained; reads brand tokens). */
const STYLE_ID = 'hc-button-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .hc-btn {
    --_bg: var(--accent); --_fg: var(--on-accent); --_bd: transparent;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.55em;
    font-family: var(--font-sans); font-weight: var(--fw-semibold);
    line-height: 1; white-space: nowrap; cursor: pointer;
    border: var(--bw-regular) solid var(--_bd);
    background: var(--_bg); color: var(--_fg);
    border-radius: var(--radius-pill);
    transition: background var(--dur-fast) var(--ease-out),
                color var(--dur-fast) var(--ease-out),
                border-color var(--dur-fast) var(--ease-out),
                transform var(--dur-fast) var(--ease-out),
                box-shadow var(--dur-fast) var(--ease-out);
    text-decoration: none; -webkit-tap-highlight-color: transparent;
  }
  .hc-btn:focus-visible { outline: none; box-shadow: var(--ring-focus); }
  .hc-btn:active { transform: translateY(0.5px) scale(0.985); }
  .hc-btn[disabled], .hc-btn[aria-disabled="true"] {
    opacity: 0.42; cursor: not-allowed; pointer-events: none;
  }

  /* sizes */
  .hc-btn--sm { font-size: var(--fs-body-sm); padding: 0.5rem 0.95rem; }
  .hc-btn--md { font-size: var(--fs-body); padding: 0.7rem 1.3rem; }
  .hc-btn--lg { font-size: var(--fs-body-lg); padding: 0.9rem 1.7rem; }
  .hc-btn--full { width: 100%; }

  /* primary — aubergine with pink type */
  .hc-btn--primary { --_bg: var(--accent); --_fg: var(--on-accent); }
  .hc-btn--primary:hover { --_bg: var(--accent-hover); }
  .hc-btn--primary:active { --_bg: var(--accent-press); }

  /* secondary — outline ink */
  .hc-btn--secondary { --_bg: transparent; --_fg: var(--text-strong); --_bd: var(--border-strong); }
  .hc-btn--secondary:hover { --_bg: var(--aub-50); --_bd: var(--aub-900); }
  .hc-btn--secondary:active { --_bg: var(--aub-100); }

  /* ghost — quiet text */
  .hc-btn--ghost { --_bg: transparent; --_fg: var(--text-strong); --_bd: transparent; }
  .hc-btn--ghost:hover { --_bg: var(--aub-50); }

  /* honey — warm accent */
  .hc-btn--honey { --_bg: var(--honey-500); --_fg: var(--aub-950); }
  .hc-btn--honey:hover { --_bg: var(--honey-600); --_fg: var(--rose-100); }
  .hc-btn--honey:active { --_bg: var(--honey-700); }

  .hc-btn__icon { display: inline-flex; flex: 0 0 auto; }
  .hc-btn__icon svg { display: block; width: 1.1em; height: 1.1em; }
  `;
  document.head.appendChild(el);
}

/**
 * Button — the brand's primary action element.
 * Pill-shaped; primary fills aubergine with pink type (echoing the mark).
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  disabled = false,
  as = 'button',
  className = '',
  children,
  ...rest
}) {
  const Tag = as;
  const classes = [
    'hc-btn',
    `hc-btn--${variant}`,
    `hc-btn--${size}`,
    fullWidth ? 'hc-btn--full' : '',
    className,
  ].filter(Boolean).join(' ');

  const isNativeButton = Tag === 'button';
  const extra = isNativeButton
    ? { disabled }
    : { 'aria-disabled': disabled || undefined, role: 'button' };

  return (
    <Tag className={classes} {...extra} {...rest}>
      {iconLeft && <span className="hc-btn__icon" aria-hidden="true">{iconLeft}</span>}
      {children && <span>{children}</span>}
      {iconRight && <span className="hc-btn__icon" aria-hidden="true">{iconRight}</span>}
    </Tag>
  );
}
