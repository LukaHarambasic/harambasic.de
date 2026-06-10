import * as React from 'react';

/**
 * Monospaced, uppercase category chip — quieter metadata styling than Badge.
 * Use for taxonomies, filters, capability tags, and eyebrow-style labels.
 */
export interface TagProps {
  /** Style. @default "outline" */
  variant?: 'outline' | 'solid' | 'honey';
  /** When provided, renders a removable "×" affordance. */
  onRemove?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export function Tag(props: TagProps): JSX.Element;
