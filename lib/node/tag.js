function addNodeToResult(result) {
	return (resolvedNode) => {
		result.push(resolvedNode);
	};
}

export default (node, selector) => {
	const previousSelector = selector.prev();
	const result = [];

	const isPreviousSelectorCombinator =
		previousSelector &&
		previousSelector.type === 'combinator' &&
		['>', '+', '~'].includes(previousSelector.value);
	const callback = addNodeToResult(result);

	if (selector.type === 'universal') {
		if (isPreviousSelectorCombinator) {
			node.each(callback);
		} else {
			node.walk(callback);
		}
	}

	if (selector.type === 'tag') {
		if (isPreviousSelectorCombinator) {
			node.each((resolvedNode) => {
				if (selector.value === resolvedNode.type) {
					callback(resolvedNode);
				}
			});
		} else {
			switch (selector.value) {
				case 'decl':
					node.walkDecls(callback);
					break;
				case 'atrule':
					node.walkAtRules(callback);
					break;
				case 'rule':
					node.walkRules(callback);
					break;
				case 'comment':
					node.walkComments(callback);
					break;
				default:
			}
		}
	}

	return result;
};
