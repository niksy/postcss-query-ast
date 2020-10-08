const REGEX_REGEX = /^\/(.+)\/([gimuy]+)?$/; // eslint-disable-line unicorn/no-unsafe-regex

function isRegexMatched(regex, flags, node, selector) {
	return new RegExp(regex, flags).test(node[selector.attribute]);
}

function whitespaceSeparatedWordTest(selector) {
	return (value) => {
		if (selector.insensitive) {
			return value.toLowerCase() === selector.value.toLowerCase();
		}
		return value === selector.value;
	};
}

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

export default (node, selector) => {
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
		REGEX_REGEX.test(selector.value)
	) {
		const [, regex, flags = ''] = selector.value.match(REGEX_REGEX);
		if (isRegexMatched(regex, flags, node, selector)) {
			result.push(node);
		}
	}

	if (hasSelectorAttribute && selector.operator === '=') {
		if (
			(node[selector.attribute] === selector.value &&
				!selector.insensitive) ||
			(node[selector.attribute].toLowerCase() ===
				selector.value.toLowerCase() &&
				selector.insensitive)
		) {
			result.push(node);
		}
	}

	if (hasSelectorAttribute && selector.operator === '~=') {
		if (
			node[selector.attribute]
				.split(' ')
				.some(whitespaceSeparatedWordTest(selector))
		) {
			result.push(node);
		}
	}

	if (
		hasSelectorAttribute &&
		['|=', '^=', '$=', '*='].includes(selector.operator)
	) {
		const flags = selector.insensitive ? 'i' : '';
		const regex = getRegexByOperator(selector.operator, selector.value);

		if (regex !== null && isRegexMatched(regex, flags, node, selector)) {
			result.push(node);
		}
	}

	return result;
};
