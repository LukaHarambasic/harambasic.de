import * as React from 'react';

/**
 * The human face of a personal brand. Prefer passing the portrait mark via
 * `src`; otherwise it falls back to initials on aubergine. Default shape is a
 * squircle echoing the logo card.
 */
export interface AvatarProps {
  /** Image URL (use the portrait mark for the brand). */
  src?: string;
  /** Full name — used for initials fallback and alt text. */
  name?: string;
  /** @default "md" */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** @default "squircle" */
  shape?: 'circle' | 'squircle';
  /** Honey focus ring. @default false */
  ring?: boolean;
  className?: string;
}

export function Avatar(props: AvatarProps): JSX.Element;
