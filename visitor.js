'use strict';

module.exports = Visitor;

function Visitor(actions) {
	this._actions = actions;
}

Visitor.prototype.visit = function(node) {
	if (Array.isArray(node)) this._visitNodes(node);
	else this._visitNode(node);
};

Visitor.prototype._visitNodes = function (nodes) {
	nodes.forEach(this._visitNode.bind(this));
};

Visitor.prototype._visitNode = function(node) {
	if (node !== Object(node)) return;
	if (!node.type) return;
	var action = this._actions[node.type] || this._actions.node;
	if (action) action.call(this, node);
};