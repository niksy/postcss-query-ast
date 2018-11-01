import getSelectorAst from './lib/selector-ast';
import getCombinator from './lib/node/combinator';
import getTag from './lib/node/tag';
import getAttribute from './lib/node/attribute';
import getPseudo from './lib/node/pseudo';

function processSelectors ( selectors, ast ) {

	const nodes = selectors
		.map(( rootSelector ) => (
			rootSelector
				.reduce(( astContainer, selector ) => (
					astContainer
						.map(( node ) => {

							switch ( selector.type ) {

								case 'combinator':
									return getCombinator(node, selector);

								case 'attribute':
									return getAttribute(node, selector);

								case 'pseudo':
									return getPseudo(node, selector, processSelectors);

								case 'tag':
								case 'universal':
								default:
									return getTag(node, selector);

							}

						})
						.reduce(( arr, result ) => [ ...arr, ...result ], [])
						.filter(( result ) => result !== null)
				), [ast])
		))
		.reduce(( arr, result ) => [ ...arr, ...result ], []);

	const uniqueNodes = [...new Set(nodes)];

	return uniqueNodes;

}

export default async ( query, postcssAst ) => {
	const selectorAst = await getSelectorAst(query);
	return processSelectors(selectorAst, postcssAst);
};
