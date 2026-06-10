import * as React from 'react';

/**
 * Compact status or category marker. Soft-tinted surface with a darker label
 * from the same hue. Optionally prefixed with a status dot.
 */
export interface BadgeProps {
  /** Color role. @default "neutral" */
  variant?: 'neutral' | 'ink' | 'honey' | 'clay' | 'success' | 'warning' | 'danger' | 'info';
  /** Show a leading status dot. @default false */
  dot?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
