import assert from 'assert';
import fn from '../index';
import beforeHook from './util/before-hook';

let ast;

before(async function() {
	ast = await beforeHook();
	return ast;
});

describe('Pseudo classes', function() {
	it('should process `:empty`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':empty', ast),
			fn('rule:empty', ast),
			fn('*:empty', ast)
		]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].selector, 'aside');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'aside');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithUniversal[0].selector, 'aside');
	});

	it('should process `:only-child`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':only-child', ast),
			fn('rule:only-child', ast),
			fn('*:only-child', ast)
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

	it('should process `:first-child`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':first-child', ast),
			fn('rule:first-child', ast),
			fn('*:first-child', ast)
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

	it('should process `:last-child`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':last-child', ast),
			fn('rule:last-child', ast),
			fn('*:last-child', ast)
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

	it('should process `:nth-child(1)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-child(1)', ast),
			fn('rule:nth-child(1)', ast),
			fn('*:nth-child(1)', ast)
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

	it('should process `:nth-child(5n)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-child(5n)', ast),
			fn('rule:nth-child(5n)', ast),
			fn('*:nth-child(5n)', ast)
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

	it('should process `:nth-child(3n+4)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-child(3n+4)', ast),
			fn('rule:nth-child(3n+4)', ast),
			fn('*:nth-child(3n+4)', ast)
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

	it('should process `:nth-child(-n+3)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-child(-n+3)', ast),
			fn('rule:nth-child(-n+3)', ast),
			fn('*:nth-child(-n+3)', ast)
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

	it('should process `:nth-child(odd)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-child(odd)', ast),
			fn('rule:nth-child(odd)', ast),
			fn('*:nth-child(odd)', ast)
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

	it('should process `:nth-child(even)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-child(even)', ast),
			fn('rule:nth-child(even)', ast),
			fn('*:nth-child(even)', ast)
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

	it('should process `:nth-last-child(1)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-child(1)', ast),
			fn('rule:nth-last-child(1)', ast),
			fn('*:nth-last-child(1)', ast)
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

	it('should process `:nth-last-child(5n)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-child(5n)', ast),
			fn('rule:nth-last-child(5n)', ast),
			fn('*:nth-last-child(5n)', ast)
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

	it('should process `:nth-last-child(3n+4)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-child(3n+4)', ast),
			fn('rule:nth-last-child(3n+4)', ast),
			fn('*:nth-last-child(3n+4)', ast)
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

	it('should process `:nth-last-child(-n+3)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-child(-n+3)', ast),
			fn('rule:nth-last-child(-n+3)', ast),
			fn('*:nth-last-child(-n+3)', ast)
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

	it('should process `:nth-last-child(odd)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-child(odd)', ast),
			fn('rule:nth-last-child(odd)', ast),
			fn('*:nth-last-child(odd)', ast)
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

	it('should process `:nth-last-child(even)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-child(even)', ast),
			fn('rule:nth-last-child(even)', ast),
			fn('*:nth-last-child(even)', ast)
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

	it('should process `:first-of-type`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':first-of-type', ast),
			fn('rule:first-of-type', ast),
			fn('*:first-of-type', ast)
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

	it('should process `:last-of-type`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':last-of-type', ast),
			fn('rule:last-of-type', ast),
			fn('*:last-of-type', ast)
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

	it('should process `:only-of-type`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':only-of-type', ast),
			fn('rule:only-of-type', ast),
			fn('*:only-of-type', ast)
		]);

		assert.equal(nodesTagless.length, 12);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'b');

		assert.equal(nodesWithUniversal.length, 12);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-of-type(1)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-of-type(1)', ast),
			fn('rule:nth-of-type(1)', ast),
			fn('*:nth-of-type(1)', ast)
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

	it('should process `:nth-of-type(5n)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-of-type(5n)', ast),
			fn('rule:nth-of-type(5n)', ast),
			fn('*:nth-of-type(5n)', ast)
		]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'li-ul');

		assert.equal(nodesWithUniversal.length, 1);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-of-type(3n+4)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-of-type(3n+4)', ast),
			fn('rule:nth-of-type(3n+4)', ast),
			fn('*:nth-of-type(3n+4)', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, 'li-li');
		assert.equal(nodesWithTag[1].selector, 'div');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-of-type(-n+3)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-of-type(-n+3)', ast),
			fn('rule:nth-of-type(-n+3)', ast),
			fn('*:nth-of-type(-n+3)', ast)
		]);

		assert.equal(nodesTagless.length, 24);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, '#main');

		assert.equal(nodesWithUniversal.length, 24);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-of-type(odd)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-of-type(odd)', ast),
			fn('rule:nth-of-type(odd)', ast),
			fn('*:nth-of-type(odd)', ast)
		]);

		assert.equal(nodesTagless.length, 21);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, 'ul li');

		assert.equal(nodesWithUniversal.length, 21);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-of-type(even)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-of-type(even)', ast),
			fn('rule:nth-of-type(even)', ast),
			fn('*:nth-of-type(even)', ast)
		]);

		assert.equal(nodesTagless.length, 8);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 5);
		assert.equal(nodesWithTag[0].selector, '#main');
		assert.equal(nodesWithTag[1].selector, 'li-li');

		assert.equal(nodesWithUniversal.length, 8);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-last-of-type(1)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-of-type(1)', ast),
			fn('rule:nth-last-of-type(1)', ast),
			fn('*:nth-last-of-type(1)', ast)
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

	it('should process `:nth-last-of-type(5n)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-of-type(5n)', ast),
			fn('rule:nth-last-of-type(5n)', ast),
			fn('*:nth-last-of-type(5n)', ast)
		]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].selector, 'li-li');

		assert.equal(nodesWithUniversal.length, 1);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-last-of-type(3n+4)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-of-type(3n+4)', ast),
			fn('rule:nth-last-of-type(3n+4)', ast),
			fn('*:nth-last-of-type(3n+4)', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].selector, '#main');
		assert.equal(nodesWithTag[1].selector, 'li-ul');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:nth-last-of-type(-n+3)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-of-type(-n+3)', ast),
			fn('rule:nth-last-of-type(-n+3)', ast),
			fn('*:nth-last-of-type(-n+3)', ast)
		]);

		assert.equal(nodesTagless.length, 24);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, 'html');
		assert.equal(nodesWithTag[1].selector, 'div');

		assert.equal(nodesWithUniversal.length, 24);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-last-of-type(odd)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-of-type(odd)', ast),
			fn('rule:nth-last-of-type(odd)', ast),
			fn('*:nth-last-of-type(odd)', ast)
		]);

		assert.equal(nodesTagless.length, 21);
		assert.equal(nodesTagless[0].type, 'comment');

		assert.equal(nodesWithTag.length, 7);
		assert.equal(nodesWithTag[0].selector, '#main');
		assert.equal(nodesWithTag[1].selector, 'li-li');

		assert.equal(nodesWithUniversal.length, 21);
		assert.equal(nodesWithUniversal[0].type, 'comment');
	});

	it('should process `:nth-last-of-type(even)`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':nth-last-of-type(even)', ast),
			fn('rule:nth-last-of-type(even)', ast),
			fn('*:nth-last-of-type(even)', ast)
		]);

		assert.equal(nodesTagless.length, 8);
		assert.equal(nodesTagless[0].type, 'rule');

		assert.equal(nodesWithTag.length, 5);
		assert.equal(nodesWithTag[0].selector, 'body');
		assert.equal(nodesWithTag[1].selector, 'ul li');

		assert.equal(nodesWithUniversal.length, 8);
		assert.equal(nodesWithUniversal[0].type, 'rule');
	});

	it('should process `:matches()`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn(':matches([prop="border"])', ast),
			fn('rule:matches([selector="body"])', ast),
			fn('*:matches([value="red"])', ast)
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

	it('should process `:not()`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('*:not([value="green"])', ast),
			fn('rule:not([selector="body"])', ast),
			fn('*:not([prop="background"])', ast)
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

	it('should process invalid `:nth-child`', async function() {
		const [
			nodesWithInvalidCombinator,
			nodesWithUnparseableValue
		] = await Promise.all([
			fn(':nth-child(5n*1)', ast),
			fn(':nth-child(5n_1)', ast)
		]);

		assert.equal(nodesWithInvalidCombinator.length, 0);
		assert.equal(nodesWithUnparseableValue.length, 0);
	});
});
