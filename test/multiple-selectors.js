// @ts-nocheck

import assert from 'assert';
import function_ from '../index';
import beforeHook from './util/before-hook';

let ast;

before(async function () {
	ast = await beforeHook();
	return ast;
});

describe('Multiple selectors', function () {
	it('should process `rule[selector="body"], rule + atrule, comment`', async function () {
		const nodes = await function_(
			'rule[selector="body"], rule + atrule, comment',
			ast
		);

		assert.equal(nodes.length, 3);
	});
});
