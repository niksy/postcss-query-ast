/**
 * @typedef {import('postcss').ChildNode} postcss.ChildNode
 * @typedef {import('postcss-selector-parser').Pseudo} selectorParser.Pseudo
 * @typedef {import('postcss-selector-parser').Root} selectorParser.Root
 * @typedef {import('../../index').ProcessSelectors} ProcessSelectors
 */

import PassthroughContainer from '../passthrough-container';
import { NTH_CHILD_QUERY_REGEX } from '../util';

/**
 * @param {selectorParser.Pseudo} selector
 * @param {postcss.ChildNode[]}   siblings
 */
function processNthNodeQuery(selector, siblings) {
	const [first, , third] = selector.first.map(({ value }) => value);
	const [, negative = '', number] = first?.match(NTH_CHILD_QUERY_REGEX) ?? [];
	const parsedNumber = Number(number);
	const parsedThird = Number(third);
	const range = new Array(
		Number(negative !== '' ? parsedThird : siblings.length)
	)
		.fill(0)
		.map((value, index) => value + index);

	const indices = range
		.map((index) => {
			if (negative !== '') {
				return -(parsedNumber * index) + parsedThird;
			}
			return parsedNumber * index + parsedThird;
		})
		.map((index) => index - 1)
		.filter((index) => index >= 0 && index <= siblings.length - 1);

	const uniqueIndices = [...new Set(indices)];

	return uniqueIndices;
}

/**
 * @param {postcss.ChildNode}     node
 * @param {selectorParser.Pseudo} selector
 * @param {ProcessSelectors}      processSelectors
 */
export default (node, selector, processSelectors) => {
	const result = [];

	if (
		selector.value === ':empty' &&
		'nodes' in node &&
		node.nodes.length === 0
	) {
		result.push(node);
	}

	if (
		selector.value === ':only-child' &&
		node.parent?.nodes.length === 1 &&
		node.parent.nodes[0] === node
	) {
		result.push(node);
	}

	if (selector.value === ':first-child' && node.parent?.first === node) {
		result.push(node);
	}

	if (selector.value === ':last-child' && node.parent?.last === node) {
		result.push(node);
	}

	if (
		selector.value === ':nth-child' ||
		selector.value === ':nth-last-child'
	) {
		const indices = processNthNodeQuery(selector, node.parent?.nodes ?? []);
		const nodesCount = (node.parent?.nodes.length ?? 0) - 1;
		indices.forEach((index) => {
			const nodeIndex =
				selector.value === ':nth-child' ? index : nodesCount - index;
			if (node.parent?.nodes[nodeIndex] === node) {
				result.push(node);
			}
		});
	}

	if (
		selector.value === ':first-of-type' ||
		selector.value === ':last-of-type' ||
		selector.value === ':only-of-type' ||
		selector.value === ':nth-of-type' ||
		selector.value === ':nth-last-of-type'
	) {
		/** @type {postcss.ChildNode[]} */
		const typeResult = [];
		node.parent?.each((resolvedNode) => {
			if (resolvedNode.type === node.type) {
				typeResult.push(resolvedNode);
			}
		});
		const nodesCount = typeResult.length;

		typeResult.forEach((resolvedTypeResultNode, index) => {
			if (
				selector.value === ':first-of-type' &&
				index === 0 &&
				resolvedTypeResultNode === node
			) {
				result.push(node);
			}
			if (
				selector.value === ':last-of-type' &&
				index === nodesCount - 1 &&
				resolvedTypeResultNode === node
			) {
				result.push(node);
			}
			if (
				selector.value === ':only-of-type' &&
				nodesCount === 1 &&
				resolvedTypeResultNode === node
			) {
				result.push(node);
			}
		});

		if (
			selector.value === ':nth-of-type' ||
			selector.value === ':nth-last-of-type'
		) {
			const indices = processNthNodeQuery(selector, typeResult);
			const nthNodesCount = typeResult.length - 1;
			indices.forEach((index) => {
				const nodeIndex =
					selector.value === ':nth-of-type'
						? index
						: nthNodesCount - index;
				if (typeResult[nodeIndex] === node) {
					result.push(node);
				}
			});
		}
	}

	if (selector.value === ':not' || selector.value === ':matches') {
		const container = new PassthroughContainer();
		container.append(node);

		const processSelectorsResult = processSelectors(selector, container);

		if (selector.value === ':not') {
			if (!processSelectorsResult.includes(node)) {
				result.push(node);
			}
		} else {
			processSelectorsResult.forEach(
				(resolvedProcessSelectorsResultNode) => {
					result.push(resolvedProcessSelectorsResultNode);
				}
			);
		}
	}

	return result;
};
