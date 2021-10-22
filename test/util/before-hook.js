import { promises as fs } from 'fs';
import path from 'path';
import postcss from 'postcss';

/** @type {import('postcss').Root} */
let ast;

export default async () => {
	if (typeof ast === 'undefined') {
		const css = await fs.readFile(
			path.resolve(__dirname, '../fixtures/index.css'),
			'utf8'
		);
		ast = postcss.parse(css);
	}
	return ast;
};
