import Container from 'postcss/lib/container';

export default class PassthroughContainer extends Container {
	constructor() {
		super();
		this.nodes = [];
	}

	normalize(nodes) {
		return [nodes];
	}
}
