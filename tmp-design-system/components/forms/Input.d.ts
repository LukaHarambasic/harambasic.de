import * as React from 'react';

/**
 * A labeled text field (or textarea) with hint and error states. Honey focus
 * ring; clay required marker.
 */
export interface InputProps {
  /** Field label. */
  label?: React.ReactNode;
  /** Helper text under the field. */
  hint?: React.ReactNode;
  /** Error message — sets the error styling when truthy. */
  error?: React.ReactNode | null;
  /** Mark as required (adds a clay asterisk). @default false */
  required?: boolean;
  /** Render a textarea instead of an input. @default false */
  multiline?: boolean;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent) => void;
  className?: string;
}

export function Input(props: InputProps): JSX.Element;
