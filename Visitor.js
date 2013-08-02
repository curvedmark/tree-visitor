module.exports = Visitor;

function Visitor(actions) {
	this._actions = actions;
}

Visitor.prototype.visit = function(node) {
	if (Array.isArray(node)) return this._visitNodes(node);
	return this._visitNode(node);
};

Visitor.prototype._visitNodes = function (nodes) {
	nodes.forEach(this._visitNode.bind(this));
	return nodes;
};

Visitor.prototype._visitNode = function (node) {
	if (node !== Object(node) || !node.type) return node;
	var action = this._actions[node.type] || this._actions.node;
	if (action) return action.call(this, node);
};