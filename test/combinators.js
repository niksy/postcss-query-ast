// @ts-nocheck

import assert from 'assert';
import function_ from '../index';
import beforeHook from './util/before-hook';

let ast;

before(async function () {
	ast = await beforeHook();
	return ast;
});

describe('Combinators', function () {
	it('should process descendant combinator (` `)', async function () {
		const [
			nodesTagTag,
			nodesTagAttribute,
			nodesTagUniversal,

			nodesAttributeTag,
			nodesAttributeAttribute,
			nodesAttributeUniversal,

			nodesUniversalTag,
			nodesUniversalAttribute,
			nodesUniversalUniversal
		] = await Promise.all([
			function_('rule decl', ast),
			function_('rule [prop="background"]', ast),
			function_('atrule *', ast),

			function_('[selector="body"] decl', ast),
			function_('[selector="body"] [value="lightgreen"]', ast),
			function_('[selector="body"] *', ast),

			function_('* decl', ast),
			function_('* [value="lightgreen"]', ast),
			function_('* *', ast)
		]);

		assert.equal(nodesTagTag.length, 14);
		assert.equal(nodesTagTag[0].prop, 'background-color');
		assert.equal(nodesTagTag[1].prop, 'border');

		assert.equal(nodesTagAttribute.length, 4);
		assert.equal(nodesTagAttribute[0].value, '#f00');
		assert.equal(
			nodesTagAttribute[nodesTagAttribute.length - 1].value,
			'url(goldenrod.jpg) no-repeat'
		);

		assert.equal(nodesTagUniversal.length, 22);
		assert.equal(nodesTagUniversal[0].type, 'rule');
		assert.equal(nodesTagUniversal[0].selector, 'body');
		assert.equal(
			nodesTagUniversal[nodesTagUniversal.length - 1].type,
			'decl'
		);
		assert.equal(
			nodesTagUniversal[nodesTagUniversal.length - 1].prop,
			'font-weight'
		);
		assert.equal(
			nodesTagUniversal[nodesTagUniversal.length - 1].value,
			'bold'
		);

		assert.equal(nodesAttributeTag.length, 1);
		assert.equal(nodesAttributeTag[0].prop, 'background-color');
		assert.equal(nodesAttributeTag[0].value, 'lightgreen');

		assert.equal(nodesAttributeAttribute.length, 1);
		assert.equal(nodesAttributeAttribute[0].prop, 'background-color');
		assert.equal(nodesAttributeAttribute[0].value, 'lightgreen');

		assert.equal(nodesAttributeUniversal.length, 1);
		assert.equal(nodesAttributeUniversal[0].prop, 'background-color');
		assert.equal(nodesAttributeUniversal[0].value, 'lightgreen');

		assert.equal(nodesUniversalTag.length, 14);
		assert.equal(nodesUniversalTag[0].prop, 'background-color');
		assert.equal(nodesUniversalTag[0].value, 'lightgreen');
		assert.equal(
			nodesUniversalTag[nodesUniversalTag.length - 1].prop,
			'margin'
		);
		assert.equal(
			nodesUniversalTag[nodesUniversalTag.length - 1].value,
			'5px'
		);

		assert.equal(nodesUniversalAttribute.length, 1);
		assert.equal(nodesUniversalAttribute[0].prop, 'background-color');
		assert.equal(nodesUniversalAttribute[0].value, 'lightgreen');

		assert.equal(nodesUniversalUniversal.length, 24);
		assert.equal(nodesUniversalUniversal[0].selector, 'body');
		assert.equal(
			nodesUniversalUniversal[nodesUniversalUniversal.length - 1].value,
			'5px'
		);
	});

	it('should process child combinator (`>`)', async function () {
		const [
			nodesTagTag,
			nodesTagAttribute,
			nodesTagUniversal,

			nodesAttributeTag,
			nodesAttributeAttribute,
			nodesAttributeUniversal,

			nodesUniversalTag,
			nodesUniversalAttribute,
			nodesUniversalUniversal
		] = await Promise.all([
			function_('atrule > rule', ast),
			function_('atrule > [selector="body"]', ast),
			function_('atrule > *', ast),

			function_('[selector="body"] > decl', ast),
			function_('[selector="body"] > [value="lightgreen"]', ast),
			function_('[selector="body"] > *', ast),

			function_('* > decl', ast),
			function_('* > [value="lightgreen"]', ast),
			function_('* > *', ast)
		]);

		assert.equal(nodesTagTag.length, 9);
		assert.equal(nodesTagTag[0].selector, 'body');
		assert.equal(nodesTagTag[nodesTagTag.length - 1].selector, 'b');

		assert.equal(nodesTagAttribute.length, 1);
		assert.equal(nodesTagAttribute[0].type, 'rule');

		assert.equal(nodesTagUniversal.length, 10);
		assert.equal(nodesTagUniversal[0].selector, 'body');
		assert.equal(
			nodesTagUniversal[nodesTagUniversal.length - 1].selector,
			'b'
		);

		assert.equal(nodesAttributeTag.length, 1);
		assert.equal(nodesAttributeTag[0].prop, 'background-color');
		assert.equal(nodesAttributeTag[0].value, 'lightgreen');

		assert.equal(nodesAttributeAttribute.length, 1);
		assert.equal(nodesAttributeAttribute[0].prop, 'background-color');
		assert.equal(nodesAttributeAttribute[0].value, 'lightgreen');

		assert.equal(nodesAttributeUniversal.length, 1);
		assert.equal(nodesAttributeUniversal[0].prop, 'background-color');
		assert.equal(nodesAttributeUniversal[0].value, 'lightgreen');

		assert.equal(nodesUniversalTag.length, 14);
		assert.equal(nodesUniversalTag[0].prop, 'background-color');
		assert.equal(nodesUniversalTag[0].value, 'lightgreen');
		assert.equal(
			nodesUniversalTag[nodesUniversalTag.length - 1].prop,
			'margin'
		);
		assert.equal(
			nodesUniversalTag[nodesUniversalTag.length - 1].value,
			'5px'
		);

		assert.equal(nodesUniversalAttribute.length, 1);
		assert.equal(nodesUniversalAttribute[0].prop, 'background-color');
		assert.equal(nodesUniversalAttribute[0].value, 'lightgreen');

		assert.equal(nodesUniversalUniversal.length, 24);
		assert.equal(nodesUniversalUniversal[0].selector, 'body');
		assert.equal(
			nodesUniversalUniversal[nodesUniversalUniversal.length - 1].value,
			'5px'
		);
	});

	it('should process adjacent sibling combinator (`+`)', async function () {
		const [
			nodesTagTag,
			nodesTagAttribute,
			nodesTagUniversal,

			nodesAttributeTag,
			nodesAttributeAttribute,
			nodesAttributeUniversal,

			nodesUniversalTag,
			nodesUniversalAttribute,
			nodesUniversalUniversal
		] = await Promise.all([
			function_('rule + rule', ast),
			function_('rule + [selector="html"]', ast),
			function_('rule + *', ast),

			function_('[selector="html"] + rule', ast),
			function_('[selector="html"] + [selector="div"]', ast),
			function_('[selector="html"] + *', ast),

			function_('* + rule', ast),
			function_('* + [selector="html"]', ast),
			function_('* + *', ast)
		]);

		assert.equal(nodesTagTag.length, 9);
		assert.equal(nodesTagTag[0].selector, '#main');
		assert.equal(nodesTagTag[nodesTagTag.length - 1].selector, 'ul > li');

		assert.equal(nodesTagAttribute.length, 1);
		assert.equal(nodesTagAttribute[0].selector, 'html');

		assert.equal(nodesTagUniversal.length, 10);
		assert.equal(nodesTagUniversal[0].selector, '#main');

		assert.equal(nodesAttributeTag.length, 1);
		assert.equal(nodesAttributeTag[0].selector, 'div');

		assert.equal(nodesAttributeAttribute.length, 1);
		assert.equal(nodesAttributeAttribute[0].selector, 'div');

		assert.equal(nodesAttributeUniversal.length, 1);
		assert.equal(nodesAttributeUniversal[0].selector, 'div');

		assert.equal(nodesUniversalTag.length, 10);
		assert.equal(nodesUniversalTag[0].selector, '#main');
		assert.equal(
			nodesUniversalTag[nodesUniversalTag.length - 1].selector,
			'ul > li'
		);

		assert.equal(nodesUniversalAttribute.length, 1);
		assert.equal(nodesUniversalAttribute[0].selector, 'html');

		assert.equal(nodesUniversalUniversal.length, 15);
		assert.equal(nodesUniversalUniversal[0].type, 'atrule');
		assert.equal(
			nodesUniversalUniversal[nodesUniversalUniversal.length - 1].type,
			'rule'
		);
	});

	it('should process general sibling combinator (`~`)', async function () {
		const [
			nodesTagTag,
			nodesTagAttribute,
			nodesTagUniversal,

			nodesAttributeTag,
			nodesAttributeAttribute,
			nodesAttributeUniversal,

			nodesUniversalTag,
			nodesUniversalAttribute,
			nodesUniversalUniversal
		] = await Promise.all([
			function_('rule ~ rule', ast),
			function_('rule ~ [selector="html"]', ast),
			function_('rule ~ *', ast),

			function_('[selector="html"] ~ rule', ast),
			function_('[selector="html"] ~ [selector="div"]', ast),
			function_('[selector="html"] ~ *', ast),

			function_('* ~ rule', ast),
			function_('* ~ [selector="html"]', ast),
			function_('* ~ *', ast)
		]);

		assert.equal(nodesTagTag.length, 9);
		assert.equal(nodesTagTag[0].selector, '#main');
		assert.equal(nodesTagTag[nodesTagTag.length - 1].selector, 'ul > li');

		assert.equal(nodesTagAttribute.length, 1);
		assert.equal(nodesTagAttribute[0].selector, 'html');

		assert.equal(nodesTagUniversal.length, 10);
		assert.equal(nodesTagUniversal[0].selector, '#main');
		assert.equal(
			nodesTagUniversal[nodesTagUniversal.length - 1].selector,
			'ul > li'
		);

		assert.equal(nodesAttributeTag.length, 2);
		assert.equal(nodesAttributeTag[0].selector, 'div');
		assert.equal(nodesAttributeTag[1].selector, 'span');

		assert.equal(nodesAttributeAttribute.length, 1);
		assert.equal(nodesAttributeAttribute[0].selector, 'div');

		assert.equal(nodesAttributeUniversal.length, 3);
		assert.equal(nodesAttributeUniversal[0].selector, 'div');
		assert.equal(
			nodesAttributeUniversal[nodesAttributeUniversal.length - 1].type,
			'atrule'
		);

		assert.equal(nodesUniversalTag.length, 10);
		assert.equal(nodesUniversalTag[0].selector, '#main');
		assert.equal(
			nodesUniversalTag[nodesUniversalTag.length - 1].selector,
			'span'
		);

		assert.equal(nodesUniversalAttribute.length, 1);
		assert.equal(nodesUniversalAttribute[0].selector, 'html');

		assert.equal(nodesUniversalUniversal.length, 15);
		assert.equal(nodesUniversalUniversal[0].type, 'atrule');
		assert.equal(
			nodesUniversalUniversal[nodesUniversalUniversal.length - 1].type,
			'decl'
		);
	});
});
