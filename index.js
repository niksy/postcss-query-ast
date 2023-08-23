/* eslint-disable import/no-namespace */

import * as postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import getSelectorAst from './lib/selector-ast';
import getCombinator from './lib/node/combinator';
import getTag from './lib/node/tag';
import getAttribute from './lib/node/attribute';
import getPseudo from './lib/node/pseudo';
import PassthroughContainer from './lib/passthrough-container';

/**
 * @typedef {(
 *     selectors: selectorParser.Container|selectorParser.Root,
 *     ast: postcss.Root|postcss.ChildNode|PassthroughContainer
 * ) => (postcss.Root|postcss.ChildNode|PassthroughContainer)[]} ProcessSelectors
 */

/**
 * @type {ProcessSelectors}
 */
function processSelectors(selectors, ast) {
	const nodes = selectors
		.map((rootSelector) => {
			if (!selectorParser.isSelector(rootSelector)) {
				return [];
			}
			return rootSelector.reduce(
				(astContainer, selector) => {
					return astContainer
						.map((node) => {
							if (
								node instanceof postcss.Root ||
								node instanceof PassthroughContainer
							) {
								switch (selector.type) {
									case 'tag':
									case 'universal':
										return getTag(node, selector);
									default:
										return [];
								}
							}
							switch (selector.type) {
								case 'combinator':
									return getCombinator(node, selector);

								case 'attribute':
									return getAttribute(node, selector);

								case 'pseudo':
									return getPseudo(
										node,
										selector,
										processSelectors
									);
								default:
									return [];
							}
						})
						.reduce(
							(
								/** @type {(postcss.ChildNode|PassthroughContainer)[]}*/ array,
								result
							) => [...array, ...result],
							[]
						)
						.filter((result) => result !== null);
				},
				[ast]
			);
		})
		.reduce((array, result) => [...array, ...result], []);

	const uniqueNodes = [...new Set(nodes)];

	return uniqueNodes;
}

/**
 * Queries PostCSS with CSS selector.
 *
 * @param {string}       query CSS selector.
 * @param {postcss.Root} ast   PostCSS AST.
 */
export default async function (query, ast) {
	const selectorAst = await getSelectorAst(query);
	const result = [];
	for (const node of processSelectors(selectorAst, ast)) {
		if (!(node instanceof PassthroughContainer)) {
			result.push(node);
		}
	}
	return result;
}
