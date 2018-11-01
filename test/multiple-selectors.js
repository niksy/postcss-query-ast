import assert from 'assert';
import fn from '../index';
import beforeHook from './util/before-hook';

let ast;

before(async function () {
	ast = await beforeHook();
	return ast;
});

describe('Multiple selectors', function () {

	it('should process `rule[selector="body"], rule + atrule, comment`', async function () {

		const nodes = await fn('rule[selector="body"], rule + atrule, comment', ast);

		assert.equal(nodes.length, 3);

	});

});
