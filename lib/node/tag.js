function addNodeToResult ( result ) {
	return ( resolvedNode ) => {
		result.push(resolvedNode);
	};
}

export default ( node, selector ) => {

	const previousSelector = selector.prev();
	const result = [];

	const isPreviousSelectorCombinator = previousSelector && previousSelector.type === 'combinator' && [ '>', '+', '~' ].includes(previousSelector.value);
	const cb = addNodeToResult(result);

	if ( selector.type === 'universal' ) {
		if ( isPreviousSelectorCombinator ) {
			node.each(cb);
		} else {
			node.walk(cb);
		}
	}

	if ( selector.type === 'tag' ) {
		if ( isPreviousSelectorCombinator ) {
			node.each(( resolvedNode ) => {
				if ( selector.value === resolvedNode.type ) {
					cb(resolvedNode);
				}
			});
		} else {
			switch ( selector.value ) {
				case 'decl':
					node.walkDecls(cb);
					break;
				case 'atrule':
					node.walkAtRules(cb);
					break;
				case 'rule':
					node.walkRules(cb);
					break;
				case 'comment':
					node.walkComments(cb);
					break;
				default:
			}
		}
	}

	return result;

};
