import assert from 'assert';
import fn from '../index';
import beforeHook from './util/before-hook';

let ast;

before(async function () {
	ast = await beforeHook();
	return ast;
});

describe('Type and universal selector', function () {

	it('should process `atrule`', async function () {

		const nodes = await fn('atrule', ast);

		assert.equal(nodes.length, 2);
		assert.ok(nodes.every(( node ) => node.type === 'atrule'));
		assert.equal(nodes[0].params, 'screen and (min-width: 480px)');

	});

	it('should process `rule`', async function () {

		const nodes = await fn('rule', ast);

		assert.equal(nodes.length, 12);
		assert.ok(nodes.every(( node ) => node.type === 'rule'));
		assert.equal(nodes[0].selector, 'body');
		assert.equal(nodes[nodes.length - 1].selector, 'ul > li');

	});

	it('should process `decl`', async function () {

		const nodes = await fn('decl', ast);

		assert.equal(nodes.length, 14);
		assert.ok(nodes.every(( node ) => node.type === 'decl'));
		assert.equal(nodes[0].prop, 'background-color');
		assert.equal(nodes[0].value, 'lightgreen');
		assert.equal(nodes[nodes.length - 1].prop, 'margin');
		assert.equal(nodes[nodes.length - 1].value, '5px');

	});

	it('should process `comment`', async function () {

		const nodes = await fn('comment', ast);

		assert.equal(nodes.length, 1);
		assert.ok(nodes.every(( node ) => node.type === 'comment'));

	});

	it('should process `*`', async function () {

		const nodes = await fn('*', ast);

		assert.equal(nodes.length, 29);
		assert.equal(nodes[0].type, 'comment');
		assert.equal(nodes[nodes.length - 1].type, 'decl');


	});

	it('should process unknown node', async function () {

		const nodes = await fn('jackie', ast);

		assert.equal(nodes.length, 0);

	});

});
