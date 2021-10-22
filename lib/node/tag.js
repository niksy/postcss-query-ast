/**
 * @typedef {import('postcss').ChildNode} postcss.ChildNode
 * @typedef {import('postcss').Root} postcss.Root
 * @typedef {import('postcss-selector-parser').Tag} selectorParser.Tag
 * @typedef {import('postcss-selector-parser').Universal} selectorParser.Universal
 * @typedef {import('../passthrough-container').default} PassthroughContainer
 */

/**
 * @param {postcss.ChildNode[]} result
 */
function addNodeToResult(result) {
	/**
	 * @param {postcss.ChildNode} resolvedNode
	 */
	return (resolvedNode) => {
		result.push(resolvedNode);
	};
}

/**
 * @param {postcss.Root|PassthroughContainer}           node
 * @param {selectorParser.Tag|selectorParser.Universal} selector
 */
export default (node, selector) => {
	const previousSelector = selector.prev();
	/** @type {postcss.ChildNode[]} */
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
