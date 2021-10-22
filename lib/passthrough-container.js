/**
 * @typedef {import('postcss').ChildNode} postcss.ChildNode
 */

import Container from 'postcss/lib/container';

export default class PassthroughContainer extends Container {
	constructor() {
		super();

		this.type = 'passthrough-container';

		/** @type {postcss.ChildNode[]} */
		this.nodes = [];
	}

	/**
	 * @param {postcss.ChildNode[]} nodes
	 */
	normalize(nodes) {
		return [nodes];
	}
}
