import postcssNested from 'postcss-nested';
import postcssSorting from 'postcss-sorting';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import postcssSize from 'postcss-size';

export default {
	plugins: [postcssNested, postcssSorting, autoprefixer, cssnano, postcssSize]
};
