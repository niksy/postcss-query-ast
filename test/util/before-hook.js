import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import pify from 'pify';

let ast;

export default async () => {
	if ( typeof ast === 'undefined' ) {
		const css = await pify(fs.readFile)(path.resolve(__dirname, '../fixtures/index.css'), 'utf8');
		ast = postcss.parse(css);
	}
	return ast;
};
