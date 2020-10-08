import parser from 'postcss-selector-parser';
import { NTH_CHILD_QUERY_REGEX } from './util';

function normalizeTagSelector(selectors) {
	selectors.walk((selector, index) => {
		if (['selector', 'tag', 'universal'].includes(selector.type)) {
			return;
		}

		let referenceSelector = null;

		if (index === 0 && selector.type !== 'combinator') {
			referenceSelector = selector;
		}
		if (index !== 0 && selector.type === 'combinator') {
			referenceSelector = selector.next();
		}

		if (
			referenceSelector !== null &&
			!['tag', 'universal'].includes(referenceSelector.type)
		) {
			selector.parent.insertBefore(referenceSelector, parser.universal());
		}
	});
}

function normalizeNthChildSelector(selectors) {
	selectors.walkTags((number) => {
		if (number.parent.parent && number.parent.parent.type !== 'pseudo') {
			return;
		}

		const position = Number(number.value);
		const previousSelector = number.prev();
		const nextSelector = number.next();

		if (
			number.type === 'tag' &&
			Number.isInteger(position) &&
			position >= 0 &&
			!previousSelector &&
			!nextSelector
		) {
			number.parent.insertBefore(number, parser.tag({ value: '0n' }));
			number.parent.insertBefore(
				number,
				parser.combinator({ value: '+' })
			);
			number.parent.insertBefore(number, parser.tag({ value: position }));
			number.remove();
		}

		if (number.type === 'tag' && number.value === 'odd') {
			number.parent.insertBefore(number, parser.tag({ value: '2n' }));
			number.parent.insertBefore(
				number,
				parser.combinator({ value: '+' })
			);
			number.parent.insertBefore(number, parser.tag({ value: '1' }));
			number.remove();
		}

		if (number.type === 'tag' && number.value === 'even') {
			number.parent.insertBefore(number, parser.tag({ value: '2n' }));
			number.parent.insertBefore(
				number,
				parser.combinator({ value: '+' })
			);
			number.parent.insertBefore(number, parser.tag({ value: '2' }));
			number.remove();
		}

		if (NTH_CHILD_QUERY_REGEX.test(number.value)) {
			const [, negative = '', regexNumber = 1] = number.value.match(
				NTH_CHILD_QUERY_REGEX
			);
			const isAlone = !nextSelector;
			const isInvalidCombinator =
				nextSelector &&
				nextSelector.type !== 'combinator' &&
				nextSelector.value !== '+';

			if (isInvalidCombinator) {
				number.parent.insertBefore(number, parser.tag({ value: '-n' }));
				number.parent.insertBefore(
					number,
					parser.combinator({ value: '+' })
				);
				number.parent.insertBefore(number, parser.tag({ value: 0 }));
			} else {
				const value = isAlone
					? `${regexNumber}n`
					: `${negative}${regexNumber}n`;

				number.parent.insertBefore(number, parser.tag({ value }));

				if (isAlone && negative === '') {
					number.parent.insertBefore(
						number,
						parser.combinator({ value: '+' })
					);
					number.parent.insertBefore(
						number,
						parser.tag({ value: regexNumber })
					);
				}
			}

			number.remove();
		}
	});
}

export default (query) =>
	parser((selectors) => {
		normalizeTagSelector(selectors);
		normalizeNthChildSelector(selectors);
	}).ast(query);
