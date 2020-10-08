import Container from 'postcss/lib/container';
import PassthroughContainer from '../passthrough-container';

function isValidNode(node, selector) {
	return (
		selector &&
		((selector.type === 'tag' && selector.value === node.type) ||
			selector.type === 'universal')
	);
}

export default (node, selector) => {
	const container = new PassthroughContainer();
	const result = [];

	const nodeIndex = node.parent.index(node);
	const nextNode = node.next();
	const nextSelector = selector.next();
	const isNodeContainer = node instanceof Container;

	if (selector.value === ' ' && isNodeContainer) {
		node.walk((resolvedNode) => {
			container.append(resolvedNode);
		});
		result.push(container);
	}

	if (selector.value === '+') {
		if (typeof nextNode !== 'undefined') {
			if (isValidNode(nextNode, nextSelector)) {
				container.append(nextNode);
			}
		}
		result.push(container);
	}

	if (selector.value === '~') {
		node.parent.each((resolvedNode, index) => {
			if (index > nodeIndex && isValidNode(resolvedNode, nextSelector)) {
				container.append(resolvedNode);
			}
		});
		result.push(container);
	}

	if (selector.value === '>' && isNodeContainer) {
		node.each((resolvedNode) => {
			if (nextSelector && isValidNode(resolvedNode, nextSelector)) {
				container.append(resolvedNode);
			}
		});
		result.push(container);
	}

	return result;
};
