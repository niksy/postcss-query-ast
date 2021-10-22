/**
 * @typedef {import('postcss').ChildNode} postcss.ChildNode
 * @typedef {import('postcss-selector-parser').Attribute} selectorParser.Attribute
 * @typedef {import('postcss-selector-parser').Node} selectorParser.Node
 */

const REGEX_REGEX = /^\/(.+)\/([gimuy]+)?$/; // eslint-disable-line unicorn/no-unsafe-regex

/**
 * @param {string}                   regex
 * @param {string}                   flags
 * @param {postcss.ChildNode}        node
 * @param {selectorParser.Attribute} selector
 */
function isRegexMatched(regex, flags, node, selector) {
	/** @type {string} */
	// @ts-ignore
	const composedAttribute = node[selector.attribute];

	return new RegExp(regex, flags).test(composedAttribute);
}

/**
 * @param {selectorParser.Attribute} selector
 */
function whitespaceSeparatedWordTest(selector) {
	/**
	 * @param {string} value
	 */
	return (value) => {
		if (selector.insensitive) {
			return value.toLowerCase() === selector.value?.toLowerCase();
		}
		return value === selector.value;
	};
}

/**
 * @param {string} operator
 * @param {string} value
 */
function getRegexByOperator(operator, value) {
	switch (operator) {
		case '|=':
			return `^${value}-?`;
		case '^=':
			return `^${value}`;
		case '$=':
			return `${value}$`;
		case '*=':
		default:
			return `${value}`;
	}
}

/**
 * @param {postcss.ChildNode}        node
 * @param {selectorParser.Attribute} selector
 */
export default (node, selector) => {
	/** @type {postcss.ChildNode[]} */
	const result = [];
	const hasSelectorAttribute = selector.attribute in node;

	if (
		hasSelectorAttribute &&
		(typeof selector.operator === 'undefined' ||
			typeof selector.value === 'undefined')
	) {
		result.push(node);
	}

	if (
		hasSelectorAttribute &&
		selector.operator === '=' &&
		selector.quoted &&
		typeof selector.value !== 'undefined' &&
		REGEX_REGEX.test(selector.value)
	) {
		const [, regex, flags = ''] = selector.value.match(REGEX_REGEX) ?? [];
		if (isRegexMatched(regex, flags, node, selector)) {
			result.push(node);
		}
	}

	/** @type {string} */
	// @ts-ignore
	const composedAttribute = node[selector.attribute];

	if (
		hasSelectorAttribute &&
		selector.operator === '=' &&
		((composedAttribute === selector.value && !selector.insensitive) ||
			(composedAttribute.toLowerCase() ===
				selector.value?.toLowerCase() &&
				selector.insensitive))
	) {
		result.push(node);
	}

	if (
		hasSelectorAttribute &&
		selector.operator === '~=' &&
		composedAttribute.split(' ').some(whitespaceSeparatedWordTest(selector))
	) {
		result.push(node);
	}

	if (
		hasSelectorAttribute &&
		typeof selector.operator !== 'undefined' &&
		['|=', '^=', '$=', '*='].includes(selector.operator)
	) {
		const flags = selector.insensitive ? 'i' : '';
		const regex = getRegexByOperator(
			selector.operator,
			selector.value ?? ''
		);

		if (regex !== null && isRegexMatched(regex, flags, node, selector)) {
			result.push(node);
		}
	}

	return result;
};
