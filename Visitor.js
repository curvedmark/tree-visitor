module.exports = Visitor;

function Visitor() {}

Visitor.prototype.visit = function(node) {
	if (Array.isArray(node)) return this._visitNodes(node);
	return this._visitNode(node);
};

Visitor.prototype._visitNodes = function (nodes) {
	for (var i = 0, len = nodes.length; i < len; ++i) {
		this._visitNode(nodes[i]);
	}
	return nodes;
};

Visitor.prototype._visitNode = function (node) {
	if (node !== Object(node) || typeof node.type !== 'string' || !node.type) return node;
	var method = this['visit_' + node.type] || this.visit_node;
	if (method) return method.call(this, node);
};