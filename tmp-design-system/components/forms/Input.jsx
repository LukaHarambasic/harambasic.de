import React from 'react';

const STYLE_ID = 'hc-input-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const el = document.createElement('style');
  el.id = STYLE_ID;
  el.textContent = `
  .hc-field { display: grid; gap: 0.4rem; font-family: var(--font-sans); }
  .hc-field__label { font-size: var(--fs-body-sm); font-weight: var(--fw-semibold); color: var(--text-strong); }
  .hc-field__req { color: var(--clay-500); margin-left: 2px; }
  .hc-field__control {
    font-family: var(--font-sans); font-size: var(--fs-body); color: var(--text-body);
    background: var(--surface-card);
    border: var(--bw-regular) solid var(--border-default);
    border-radius: var(--radius-sm);
    padding: 0.65rem 0.85rem; width: 100%;
    transition: border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out);
  }
  textarea.hc-field__control { resize: vertical; min-height: 5.5rem; line-height: var(--lh-normal); }
  .hc-field__control::placeholder { color: var(--text-subtle); }
  .hc-field__control:hover { border-color: var(--border-strong); }
  .hc-field__control:focus-visible { outline: none; border-color: var(--aub-700); box-shadow: var(--ring-focus); }
  .hc-field__hint { font-size: var(--fs-caption); color: var(--text-muted); }
  .hc-field--error .hc-field__control { border-color: var(--danger); }
  .hc-field--error .hc-field__control:focus-visible { box-shadow: 0 0 0 3px var(--danger-surface); }
  .hc-field--error .hc-field__hint { color: var(--danger); }
  .hc-field--disabled { opacity: 0.55; }
  .hc-field--disabled .hc-field__control { cursor: not-allowed; background: var(--aub-50); }
  `;
  document.head.appendChild(el);
}

let _id = 0;

/**
 * Input — a labeled text field (or textarea) with hint and error states.
 */
export function Input({
  label,
  hint,
  error = null,
  required = false,
  multiline = false,
  disabled = false,
  id,
  className = '',
  ...rest
}) {
  const fieldId = id || `hc-field-${++_id}`;
  const Control = multiline ? 'textarea' : 'input';
  const classes = [
    'hc-field',
    error ? 'hc-field--error' : '',
    disabled ? 'hc-field--disabled' : '',
    className,
  ].filter(Boolean).join(' ');
  const describedBy = (hint || error) ? `${fieldId}-hint` : undefined;
  return (
    <div className={classes}>
      {label && (
        <label className="hc-field__label" htmlFor={fieldId}>
          {label}{required && <span className="hc-field__req" aria-hidden="true">*</span>}
        </label>
      )}
      <Control
        id={fieldId}
        className="hc-field__control"
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {(error || hint) && (
        <span className="hc-field__hint" id={describedBy}>{error || hint}</span>
      )}
    </div>
  );
}
