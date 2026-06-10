import * as React from 'react';

/**
 * The brand's primary action element. Pill-shaped; the primary variant fills
 * aubergine with pink type, echoing the portrait mark. Use sparingly — one
 * primary per view.
 *
 * @startingPoint section="Actions" subtitle="Pill button — primary, secondary, ghost, honey" viewport="700x150"
 */
export interface ButtonProps {
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'honey';
  /** Size. @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to fill container width. @default false */
  fullWidth?: boolean;
  /** Icon element rendered before the label (SVG). */
  iconLeft?: React.ReactNode;
  /** Icon element rendered after the label (SVG). */
  iconRight?: React.ReactNode;
  /** Disable interaction. @default false */
  disabled?: boolean;
  /** Render as a different element, e.g. "a" for links. @default "button" */
  as?: 'button' | 'a';
  className?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
}

export function Button(props: ButtonProps): JSX.Element;
