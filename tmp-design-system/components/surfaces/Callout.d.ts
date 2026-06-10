import * as React from 'react';

/**
 * A noted block with a circular icon chip and a title, on a soft tinted
 * surface. Deliberately avoids the colored-left-border pattern.
 */
export interface CalloutProps {
  /** Tone. @default "note" */
  variant?: 'note' | 'honey' | 'success' | 'warning' | 'danger';
  /** Inline SVG icon shown in the chip. */
  icon?: React.ReactNode;
  /** Bold lead line. */
  title?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function Callout(props: CalloutProps): JSX.Element;
