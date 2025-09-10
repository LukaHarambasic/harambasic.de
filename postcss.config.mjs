// Get environment from NODE_ENV or npm script environment
const env = process.env.NODE_ENV || process.env.npm_config_env || 'production';

// Comprehensive CSS property ordering configuration
const sortingConfig = {
	order: ['custom-properties', 'dollar-variables', 'declarations', 'at-rules', 'rules'],
	'properties-order': [
		// Display & Layout
		'display',
		'visibility',
		'opacity',

		// Positioning
		'position',
		'top',
		'right',
		'bottom',
		'left',
		'z-index',

		// Box Model - Outside to Inside
		'margin',
		'margin-top',
		'margin-right',
		'margin-bottom',
		'margin-left',

		'padding',
		'padding-top',
		'padding-right',
		'padding-bottom',
		'padding-left',

		// Dimensions
		'width',
		'min-width',
		'max-width',
		'height',
		'min-height',
		'max-height',
		'size',

		// Flexbox
		'flex',
		'flex-grow',
		'flex-shrink',
		'flex-basis',
		'flex-direction',
		'flex-wrap',
		'flex-flow',
		'justify-content',
		'align-items',
		'align-content',
		'align-self',
		'order',
		'gap',
		'row-gap',
		'column-gap',

		// Grid
		'grid',
		'grid-template',
		'grid-template-areas',
		'grid-template-rows',
		'grid-template-columns',
		'grid-area',
		'grid-row',
		'grid-column',
		'grid-gap',
		'grid-auto-rows',
		'grid-auto-columns',
		'grid-auto-flow',

		// Border
		'border',
		'border-top',
		'border-right',
		'border-bottom',
		'border-left',
		'border-width',
		'border-style',
		'border-color',
		'border-radius',
		'outline',
		'outline-offset',
		'box-shadow',

		// Background
		'background',
		'background-color',
		'background-image',
		'background-position',
		'background-size',
		'background-repeat',
		'background-attachment',
		'background-clip',
		'background-origin',
		'background-blend-mode',

		// Typography
		'color',
		'font',
		'font-family',
		'font-size',
		'font-weight',
		'font-style',
		'font-variant',
		'line-height',
		'letter-spacing',
		'word-spacing',
		'text-align',
		'text-decoration',
		'text-indent',
		'text-transform',
		'text-shadow',
		'white-space',
		'word-wrap',
		'overflow-wrap',
		'word-break',
		'hyphens',

		// Other Visual
		'list-style',
		'list-style-type',
		'list-style-position',
		'list-style-image',
		'table-layout',
		'border-collapse',
		'border-spacing',
		'caption-side',
		'empty-cells',

		// Animation & Transition
		'transition',
		'transition-property',
		'transition-duration',
		'transition-timing-function',
		'transition-delay',
		'animation',
		'animation-name',
		'animation-duration',
		'animation-timing-function',
		'animation-delay',
		'animation-iteration-count',
		'animation-direction',
		'animation-fill-mode',
		'animation-play-state',
		'transform',
		'transform-origin',

		// Misc
		'cursor',
		'user-select',
		'pointer-events',
		'resize',
		'overflow',
		'overflow-x',
		'overflow-y',
		'clip',
		'content'
	],
	'unspecified-properties-position': 'bottomAlphabetical'
};

export default {
	plugins: {
		'postcss-sorting': sortingConfig,
		'postcss-nested': {},
		autoprefixer: {},
		...(env === 'production' ? { cssnano: {} } : {}),
		'postcss-size': {}
	}
};
