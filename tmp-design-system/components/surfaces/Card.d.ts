import * as React from 'react';

/**
 * The workhorse surface — soft hairline plus a low aubergine-tinted shadow.
 * Tinted variants cover pink, ink, and paper sections; add grain for the
 * premium print feel.
 *
 * @startingPoint section="Surfaces" subtitle="Content card — default, pink, ink, outline" viewport="700x260"
 */
export interface CardProps {
  /** Surface treatment. @default "default" */
  surface?: 'default' | 'pink' | 'paper' | 'ink' | 'outline';
  /** Inner padding. @default "md" */
  padding?: 'sm' | 'md' | 'lg';
  /** Use a medium shadow instead of small. @default false */
  raised?: boolean;
  /** Lift on hover (for clickable cards). @default false */
  interactive?: boolean;
  /** Overlay subtle paper grain. @default false */
  grain?: boolean;
  /** Element to render. @default "div" */
  as?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
