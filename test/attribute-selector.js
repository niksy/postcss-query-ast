import assert from 'assert';
import fn from '../index';
import beforeHook from './util/before-hook';

let ast;

before(async function() {
	ast = await beforeHook();
	return ast;
});

describe('Attribute selector', function() {
	it('should process `[attr]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector]', ast),
			fn('atrule[params]', ast),
			fn('*[prop]', ast)
		]);

		assert.equal(nodesTagless.length, 12);
		assert.equal(nodesTagless[0].selector, 'body');
		assert.equal(nodesTagless[nodesTagless.length - 1].selector, 'ul > li');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].name, 'media');
		assert.equal(nodesWithTag[nodesWithTag.length - 1].name, 'media');

		assert.equal(nodesWithUniversal.length, 14);
		assert.equal(nodesWithUniversal[0].prop, 'background-color');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].prop,
			'margin'
		);
	});

	it('should process `[attr="value"]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector="body"]', ast),
			fn('decl[prop="border"]', ast),
			fn('*[value="red"]', ast)
		]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].selector, 'body');
		assert.equal(nodesTagless[0].first.prop, 'background-color');
		assert.equal(nodesTagless[0].first.value, 'lightgreen');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].value, '55px solid magenta');
		assert.equal(nodesWithTag[1].value, '1px dotted black');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].prop, 'background');
		assert.equal(nodesWithUniversal[1].prop, 'outline-color');
	});

	it('should process `[attr="VALUE" i]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector="BODY" i]', ast),
			fn('decl[prop="BORDER" i]', ast),
			fn('*[value="RED" i]', ast)
		]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].selector, 'body');
		assert.equal(nodesTagless[0].first.prop, 'background-color');
		assert.equal(nodesTagless[0].first.value, 'lightgreen');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].value, '55px solid magenta');
		assert.equal(nodesWithTag[1].value, '1px dotted black');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].prop, 'background');
		assert.equal(nodesWithUniversal[1].prop, 'outline-color');
	});

	it('should process `[attr~="value"]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector~="li"]', ast),
			fn('decl[value~="magenta"]', ast),
			fn('*[value~="no-repeat"]', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].selector, 'ul li');
		assert.equal(nodesTagless[1].selector, 'ul > li');
		assert.equal(nodesTagless[0].first.prop, 'background');
		assert.equal(nodesTagless[0].first.value, '#f00');
		assert.equal(nodesTagless[0].last.prop, 'padding');
		assert.equal(nodesTagless[0].last.value, '42.9em');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].prop, 'border');
		assert.equal(nodesWithTag[0].value, '55px solid magenta');

		assert.equal(nodesWithUniversal.length, 1);
		assert.equal(nodesWithUniversal[0].prop, 'background');
		assert.equal(
			nodesWithUniversal[0].value,
			'url(goldenrod.jpg) no-repeat'
		);
	});

	it('should process `[attr~="VALUE" i]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector~="LI" i]', ast),
			fn('decl[value~="MAGENTA" i]', ast),
			fn('*[value~="NO-REPEAT" i]', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].selector, 'ul li');
		assert.equal(nodesTagless[1].selector, 'ul > li');
		assert.equal(nodesTagless[0].first.prop, 'background');
		assert.equal(nodesTagless[0].first.value, '#f00');
		assert.equal(nodesTagless[0].last.prop, 'padding');
		assert.equal(nodesTagless[0].last.value, '42.9em');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].prop, 'border');
		assert.equal(nodesWithTag[0].value, '55px solid magenta');

		assert.equal(nodesWithUniversal.length, 1);
		assert.equal(nodesWithUniversal[0].prop, 'background');
		assert.equal(
			nodesWithUniversal[0].value,
			'url(goldenrod.jpg) no-repeat'
		);
	});

	it('should process `[attr|="value"]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector|="li"]', ast),
			fn('decl[prop|="border"]', ast),
			fn('*[prop|="font"]', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].selector, 'li-li');
		assert.equal(nodesTagless[1].selector, 'li-ul');

		assert.equal(nodesWithTag.length, 4);
		assert.equal(nodesWithTag[0].prop, 'border');
		assert.equal(nodesWithTag[1].prop, 'border-width');
		assert.equal(nodesWithTag[2].prop, 'border-color');
		assert.equal(nodesWithTag[3].prop, 'border');

		assert.equal(nodesWithUniversal.length, 1);
		assert.equal(nodesWithUniversal[0].prop, 'font-weight');
	});

	it('should process `[attr|="VALUE" i]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector|="LI" i]', ast),
			fn('decl[prop|="BORDER" i]', ast),
			fn('*[prop|="FONT" i]', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].selector, 'li-li');
		assert.equal(nodesTagless[1].selector, 'li-ul');

		assert.equal(nodesWithTag.length, 4);
		assert.equal(nodesWithTag[0].prop, 'border');
		assert.equal(nodesWithTag[1].prop, 'border-width');
		assert.equal(nodesWithTag[2].prop, 'border-color');
		assert.equal(nodesWithTag[3].prop, 'border');

		assert.equal(nodesWithUniversal.length, 1);
		assert.equal(nodesWithUniversal[0].prop, 'font-weight');
	});

	it('should process `[attr^="value"]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector^="h"]', ast),
			fn('decl[value^="5"]', ast),
			fn('*[prop^="background"]', ast)
		]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].selector, 'html');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].prop, 'border');
		assert.equal(nodesWithTag[0].value, '55px solid magenta');
		assert.equal(nodesWithTag[1].prop, 'margin');
		assert.equal(nodesWithTag[1].value, '5px');

		assert.equal(nodesWithUniversal.length, 5);
		assert.equal(nodesWithUniversal[0].prop, 'background-color');
		assert.equal(nodesWithUniversal[0].value, 'lightgreen');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].prop,
			'background'
		);
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].value,
			'url(goldenrod.jpg) no-repeat'
		);
	});

	it('should process `[attr^="VALUE" i]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector^="H" i]', ast),
			fn('decl[value^="5" i]', ast),
			fn('*[prop^="BACKGROUND" i]', ast)
		]);

		assert.equal(nodesTagless.length, 1);
		assert.equal(nodesTagless[0].selector, 'html');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].prop, 'border');
		assert.equal(nodesWithTag[0].value, '55px solid magenta');
		assert.equal(nodesWithTag[1].prop, 'margin');
		assert.equal(nodesWithTag[1].value, '5px');

		assert.equal(nodesWithUniversal.length, 5);
		assert.equal(nodesWithUniversal[0].prop, 'background-color');
		assert.equal(nodesWithUniversal[0].value, 'lightgreen');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].prop,
			'background'
		);
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].value,
			'url(goldenrod.jpg) no-repeat'
		);
	});

	it('should process `[attr$="value"]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector$="n"]', ast),
			fn('decl[value$="green"]', ast),
			fn('*[value$="red"]', ast)
		]);

		assert.equal(nodesTagless.length, 3);
		assert.equal(nodesTagless[0].selector, '#main');
		assert.equal(nodesTagless[1].selector, 'span');
		assert.equal(nodesTagless[2].selector, '#main');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].prop, 'background-color');
		assert.equal(nodesWithTag[0].value, 'lightgreen');
		assert.equal(nodesWithTag[1].prop, 'background');
		assert.equal(nodesWithTag[1].value, 'green');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].prop, 'background');
		assert.equal(nodesWithUniversal[0].value, 'red');
		assert.equal(nodesWithUniversal[1].prop, 'outline-color');
		assert.equal(nodesWithUniversal[1].value, 'red');
	});

	it('should process `[attr$="VALUE" i]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector$="N" i]', ast),
			fn('decl[value$="GREEN" i]', ast),
			fn('*[value$="RED" i]', ast)
		]);

		assert.equal(nodesTagless.length, 3);
		assert.equal(nodesTagless[0].selector, '#main');
		assert.equal(nodesTagless[1].selector, 'span');
		assert.equal(nodesTagless[2].selector, '#main');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].prop, 'background-color');
		assert.equal(nodesWithTag[0].value, 'lightgreen');
		assert.equal(nodesWithTag[1].prop, 'background');
		assert.equal(nodesWithTag[1].value, 'green');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].prop, 'background');
		assert.equal(nodesWithUniversal[0].value, 'red');
		assert.equal(nodesWithUniversal[1].prop, 'outline-color');
		assert.equal(nodesWithUniversal[1].value, 'red');
	});

	it('should process `[attr*="value"]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector*="ai"]', ast),
			fn('decl[value*="ee"]', ast),
			fn('*[value*="re"]', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].selector, '#main');
		assert.equal(nodesTagless[1].selector, '#main');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].prop, 'background-color');
		assert.equal(nodesWithTag[0].value, 'lightgreen');
		assert.equal(nodesWithTag[1].prop, 'background');
		assert.equal(nodesWithTag[1].value, 'green');

		assert.equal(nodesWithUniversal.length, 5);
		assert.equal(nodesWithUniversal[0].prop, 'background-color');
		assert.equal(nodesWithUniversal[0].value, 'lightgreen');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].prop,
			'background'
		);
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].value,
			'url(goldenrod.jpg) no-repeat'
		);
	});

	it('should process `[attr*="VALUE" i]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector*="AI" i]', ast),
			fn('decl[value*="EE" i]', ast),
			fn('*[value*="RE" i]', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].selector, '#main');
		assert.equal(nodesTagless[1].selector, '#main');

		assert.equal(nodesWithTag.length, 2);
		assert.equal(nodesWithTag[0].prop, 'background-color');
		assert.equal(nodesWithTag[0].value, 'lightgreen');
		assert.equal(nodesWithTag[1].prop, 'background');
		assert.equal(nodesWithTag[1].value, 'green');

		assert.equal(nodesWithUniversal.length, 5);
		assert.equal(nodesWithUniversal[0].prop, 'background-color');
		assert.equal(nodesWithUniversal[0].value, 'lightgreen');
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].prop,
			'background'
		);
		assert.equal(
			nodesWithUniversal[nodesWithUniversal.length - 1].value,
			'url(goldenrod.jpg) no-repeat'
		);
	});

	it('should process `[attr="/^v.+?e$/"]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector="/^#m.+?n$/"]', ast),
			fn('decl[value="/^green$/"]', ast),
			fn('*[value="/green$/"]', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].selector, '#main');
		assert.equal(nodesTagless[1].selector, '#main');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].prop, 'background');
		assert.equal(nodesWithTag[0].value, 'green');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].prop, 'background-color');
		assert.equal(nodesWithUniversal[0].value, 'lightgreen');
		assert.equal(nodesWithUniversal[1].prop, 'background');
		assert.equal(nodesWithUniversal[1].value, 'green');
	});

	it('should process `[attr="/^V.+?E$/i"]`', async function() {
		const [
			nodesTagless,
			nodesWithTag,
			nodesWithUniversal
		] = await Promise.all([
			fn('[selector="/^#M.+?N$/i"]', ast),
			fn('decl[value="/^GREEN$/i"]', ast),
			fn('*[value="/GREEN$/i"]', ast)
		]);

		assert.equal(nodesTagless.length, 2);
		assert.equal(nodesTagless[0].selector, '#main');
		assert.equal(nodesTagless[1].selector, '#main');

		assert.equal(nodesWithTag.length, 1);
		assert.equal(nodesWithTag[0].prop, 'background');
		assert.equal(nodesWithTag[0].value, 'green');

		assert.equal(nodesWithUniversal.length, 2);
		assert.equal(nodesWithUniversal[0].prop, 'background-color');
		assert.equal(nodesWithUniversal[0].value, 'lightgreen');
		assert.equal(nodesWithUniversal[1].prop, 'background');
		assert.equal(nodesWithUniversal[1].value, 'green');
	});
});
