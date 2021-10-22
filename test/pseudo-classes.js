// @ts-nocheck

import assert from 'assert';
import function_ from '../index';
import beforeHook from './util/before-hook';

let ast;

before(async function () {
	ast = await beforeHook();
	return ast;
});

describe('Pseudo classes', function () {
	it('should process `:empty`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':empty', ast),
				function_('rule:empty', ast),
				function_('*:empty', ast)
			]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].selector, 'aside');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'aside');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithUniversal[0].selector, 'aside');
	});

	it('should process `:only-child`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':only-child', ast),
				function_('rule:only-child', ast),
				function_('*:only-child', ast)
			]);

		assert.equal(nodesTagless.length, 9);
		assert.equal(nodesTagless[0].type, 'decl');
		assert.equal(nodesTagless[0].prop, 'background-color');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'b');

		assert.equal(nodesWithUniversal.length, 9);
		assert.equal(nodesWithUniversal[0].type, 'decl');
		assert.equal(nodesWithUniversal[0].prop, 'background-color');
	});

	it('should process `:first-child`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':first-child', ast),
				function_('rule:first-child', ast),
				function_('*:first-child', ast)
			]);

		assert.equal(nodesTagless.length, 14);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, 'b');

		assert.equal(nodesWithUniversal.length, 14);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:last-child`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':last-child', ast),
				function_('rule:last-child', ast),
				function_('*:last-child', ast)
			]);

		assert.equal(nodesTagless.length, 14);
		assert.equal(nodesTagless[0].type, 'decl');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, 'b');
		assert.equal(nodesWithTag[1].selector, 'ul > li');

		assert.equal(nodesWithUniversal.length, 14);
		assert.equal(nodesWithUniversal[0].type, 'decl');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:nth-child(1)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-child(1)', ast),
				function_('rule:nth-child(1)', ast),
				function_('*:nth-child(1)', ast)
			]);

		assert.equal(nodesTagless.length, 14);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, 'b');

		assert.equal(nodesWithUniversal.length, 14);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:nth-child(5n)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-child(5n)', ast),
				function_('rule:nth-child(5n)', ast),
				function_('*:nth-child(5n)', ast)
			]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].type, 'rule');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'rule');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, 'li-ul');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, 'ul > li');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].type, 'rule');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'rule'
		);
	});

	it('should process `:nth-child(3n+4)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-child(3n+4)', ast),
				function_('rule:nth-child(3n+4)', ast),
				function_('*:nth-child(3n+4)', ast)
			]);

		assert.equal(nodesTagless.length, 3);
		assert.equal(nodesTagless[0].type, 'rule');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'rule');

		assert.equal(nodesWithTag.length, 3);
		assert.equal(nodesWithTag[0].selector, 'li-li');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, 'aside');

		assert.equal(nodesWithUniversal.length, 3);
		assert.equal(nodesWithUniversal[0].type, 'rule');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'rule'
		);
	});

	it('should process `:nth-child(-n+3)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-child(-n+3)', ast),
				function_('rule:nth-child(-n+3)', ast),
				function_('*:nth-child(-n+3)', ast)
			]);

		assert.equal(nodesTagless.length, 21);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 5);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, '#main');

		assert.equal(nodesWithUniversal.length, 21);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:nth-child(odd)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-child(odd)', ast),
				function_('rule:nth-child(odd)', ast),
				function_('*:nth-child(odd)', ast)
			]);

		assert.equal(nodesTagless.length, 20);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, 'ul > li');

		assert.equal(nodesWithUniversal.length, 20);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:nth-child(even)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-child(even)', ast),
				function_('rule:nth-child(even)', ast),
				function_('*:nth-child(even)', ast)
			]);

		assert.equal(nodesTagless.length, 9);
		assert.equal(nodesTagless[0].type, 'atrule');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'rule');

		assert.equal(nodesWithTag.length, 5);
		assert.equal(nodesWithTag[0].selector, '#main');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, 'aside');

		assert.equal(nodesWithUniversal.length, 9);
		assert.equal(nodesWithUniversal[0].type, 'atrule');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'rule'
		);
	});

	it('should process `:nth-last-child(1)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-child(1)', ast),
				function_('rule:nth-last-child(1)', ast),
				function_('*:nth-last-child(1)', ast)
			]);

		assert.equal(nodesTagless.length, 14);
		assert.equal(nodesTagless[0].type, 'decl');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, 'b');
		assert.equal(nodesWithTag[1].selector, 'ul > li');

		assert.equal(nodesWithUniversal.length, 14);
		assert.equal(nodesWithUniversal[0].type, 'decl');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:nth-last-child(5n)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-child(5n)', ast),
				function_('rule:nth-last-child(5n)', ast),
				function_('*:nth-last-child(5n)', ast)
			]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'rule');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'li-ul');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'rule'
		);
	});

	it('should process `:nth-last-child(3n+4)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-child(3n+4)', ast),
				function_('rule:nth-last-child(3n+4)', ast),
				function_('*:nth-last-child(3n+4)', ast)
			]);

		assert.equal(nodesTagless.length, 3);
		assert.equal(nodesTagless[0].type, 'atrule');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'rule');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, 'ul li');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, 'html');

		assert.equal(nodesWithUniversal.length, 3);
		assert.equal(nodesWithUniversal[0].type, 'atrule');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'rule'
		);
	});

	it('should process `:nth-last-child(-n+3)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-child(-n+3)', ast),
				function_('rule:nth-last-child(-n+3)', ast),
				function_('*:nth-last-child(-n+3)', ast)
			]);

		assert.equal(nodesTagless.length, 21);
		assert.equal(nodesTagless[0].type, 'decl');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 6);
		assert.equal(nodesWithTag[0].selector, 'div');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, 'ul > li');

		assert.equal(nodesWithUniversal.length, 21);
		assert.equal(nodesWithUniversal[0].type, 'decl');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:nth-last-child(odd)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-child(odd)', ast),
				function_('rule:nth-last-child(odd)', ast),
				function_('*:nth-last-child(odd)', ast)
			]);

		assert.equal(nodesTagless.length, 20);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, 'ul > li');

		assert.equal(nodesWithUniversal.length, 20);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:nth-last-child(even)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-child(even)', ast),
				function_('rule:nth-last-child(even)', ast),
				function_('*:nth-last-child(even)', ast)
			]);

		assert.equal(nodesTagless.length, 9);
		assert.equal(nodesTagless[0].type, 'atrule');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'rule');

		assert.equal(nodesWithTag.length, 5);
		assert.equal(nodesWithTag[0].selector, '#main');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, 'aside');

		assert.equal(nodesWithUniversal.length, 9);
		assert.equal(nodesWithUniversal[0].type, 'atrule');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'rule'
		);
	});

	it('should process `:first-of-type`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':first-of-type', ast),
				function_('rule:first-of-type', ast),
				function_('*:first-of-type', ast)
			]);

		assert.equal(nodesTagless.length, 17);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 3);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, 'b');
		assert.equal(nodesWithTag[2].selector, '#main');

		assert.equal(nodesWithUniversal.length, 17);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:last-of-type`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':last-of-type', ast),
				function_('rule:last-of-type', ast),
				function_('*:last-of-type', ast)
			]);

		assert.equal(nodesTagless.length, 17);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 3);
		assert.equal(nodesWithTag[0].selector, 'span');
		assert.equal(nodesWithTag[1].selector, 'b');
		assert.equal(nodesWithTag[2].selector, 'ul > li');

		assert.equal(nodesWithUniversal.length, 17);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:only-of-type`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':only-of-type', ast),
				function_('rule:only-of-type', ast),
				function_('*:only-of-type', ast)
			]);

		assert.equal(nodesTagless.length, 12);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'b');

		assert.equal(nodesWithUniversal.length, 12);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-of-type(1)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-of-type(1)', ast),
				function_('rule:nth-of-type(1)', ast),
				function_('*:nth-of-type(1)', ast)
			]);

		assert.equal(nodesTagless.length, 17);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 3);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, 'b');
		assert.equal(nodesWithTag[2].selector, '#main');

		assert.equal(nodesWithUniversal.length, 17);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:nth-of-type(5n)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-of-type(5n)', ast),
				function_('rule:nth-of-type(5n)', ast),
				function_('*:nth-of-type(5n)', ast)
			]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'li-ul');

		assert.equal(nodesWithUniversal.length, 1);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-of-type(3n+4)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-of-type(3n+4)', ast),
				function_('rule:nth-of-type(3n+4)', ast),
				function_('*:nth-of-type(3n+4)', ast)
			]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, 'li-li');
		assert.equal(nodesWithTag[1].selector, 'div');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-of-type(-n+3)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-of-type(-n+3)', ast),
				function_('rule:nth-of-type(-n+3)', ast),
				function_('*:nth-of-type(-n+3)', ast)
			]);

		assert.equal(nodesTagless.length, 24);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, '#main');

		assert.equal(nodesWithUniversal.length, 24);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-of-type(odd)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-of-type(odd)', ast),
				function_('rule:nth-of-type(odd)', ast),
				function_('*:nth-of-type(odd)', ast)
			]);

		assert.equal(nodesTagless.length, 21);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, 'ul li');

		assert.equal(nodesWithUniversal.length, 21);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-of-type(even)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-of-type(even)', ast),
				function_('rule:nth-of-type(even)', ast),
				function_('*:nth-of-type(even)', ast)
			]);

		assert.equal(nodesTagless.length, 8);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 5);
		assert.equal(nodesWithTag[0].selector, '#main');
		assert.equal(nodesWithTag[1].selector, 'li-li');

		assert.equal(nodesWithUniversal.length, 8);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-last-of-type(1)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-of-type(1)', ast),
				function_('rule:nth-last-of-type(1)', ast),
				function_('*:nth-last-of-type(1)', ast)
			]);

		assert.equal(nodesTagless.length, 17);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 3);
		assert.equal(nodesWithTag[0].selector, 'span');
		assert.equal(nodesWithTag[1].selector, 'b');
		assert.equal(nodesWithTag[2].selector, 'ul > li');

		assert.equal(nodesWithUniversal.length, 17);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process `:nth-last-of-type(5n)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-of-type(5n)', ast),
				function_('rule:nth-last-of-type(5n)', ast),
				function_('*:nth-last-of-type(5n)', ast)
			]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'li-li');

		assert.equal(nodesWithUniversal.length, 1);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-last-of-type(3n+4)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-of-type(3n+4)', ast),
				function_('rule:nth-last-of-type(3n+4)', ast),
				function_('*:nth-last-of-type(3n+4)', ast)
			]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, '#main');
		assert.equal(nodesWithTag[1].selector, 'li-ul');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-last-of-type(-n+3)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-of-type(-n+3)', ast),
				function_('rule:nth-last-of-type(-n+3)', ast),
				function_('*:nth-last-of-type(-n+3)', ast)
			]);

		assert.equal(nodesTagless.length, 24);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, 'html');
		assert.equal(nodesWithTag[1].selector, 'div');

		assert.equal(nodesWithUniversal.length, 24);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-last-of-type(odd)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-of-type(odd)', ast),
				function_('rule:nth-last-of-type(odd)', ast),
				function_('*:nth-last-of-type(odd)', ast)
			]);

		assert.equal(nodesTagless.length, 21);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, '#main');
		assert.equal(nodesWithTag[1].selector, 'li-li');

		assert.equal(nodesWithUniversal.length, 21);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-last-of-type(even)`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':nth-last-of-type(even)', ast),
				function_('rule:nth-last-of-type(even)', ast),
				function_('*:nth-last-of-type(even)', ast)
			]);

		assert.equal(nodesTagless.length, 8);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 5);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, 'ul li');

		assert.equal(nodesWithUniversal.length, 8);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:matches()`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_(':matches([prop="border"])', ast),
				function_('rule:matches([selector="body"])', ast),
				function_('*:matches([value="red"])', ast)
			]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].value, '55px solid magenta');
		assert.equal(nodesTagless[1].value, '1px dotted black');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[0].first.prop, 'background-color');
		assert.equal(nodesWithTag[0].first.value, 'lightgreen');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].prop, 'background');
		assert.equal(nodesWithUniversal[1].prop, 'outline-color');
	});

	it('should process `:not()`', async function () {
		const [nodesTagless, nodesWithTag, nodesWithUniversal] =
			await Promise.all([
				function_('*:not([value="green"])', ast),
				function_('rule:not([selector="body"])', ast),
				function_('*:not([prop="background"])', ast)
			]);

		assert.equal(nodesTagless.length, 28);
		assert.equal(nodesTagless[0].type, 'comment');
		assert.equal(nodesTagless[nodesTagless.length - 1].type, 'decl');

		assert.equal(nodesWithTag.length, 11);
		assert.equal(nodesWithTag[0].selector, '#main');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].selector, 'ul > li');

		assert.equal(nodesWithUniversal.length, 25);
		assert.equal(nodesWithUniversal[0].type, 'comment');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].type,
			'decl'
		);
	});

	it('should process invalid `:nth-child`', async function () {
		const [nodesWithInvalidCombinator, nodesWithUnparseableValue] =
			await Promise.all([
				function_(':nth-child(5n*1)', ast),
				function_(':nth-child(5n_1)', ast)
			]);

		assert.equal(nodesWithInvalidCombinator.length, 0);
		assert.equal(nodesWithUnparseableValue.length, 0);
	});
});
