var assert = require('assert');
var Visitor = require('..');

describe('Visitor', function () {
	it('should visit a single node', function () {
		var count = 0;
		var node = { type: 'number', value: 1 };

		function MyVisitor() {}
		MyVisitor.prototype = new Visitor();

		MyVisitor.prototype.visit_number = function (number) {
			++count;
			assert.equal(number.value, 1);
		};

		new MyVisitor().visit(node);

		if (!count) throw new Error('node is never visited');
	});

	it('should visit an array of nodes', function () {
		var count = 0;
		var nodes = [
			{ type: 'number', value: 1 },
			{ type: 'string', value: 'abc'}
		];

		function MyVisitor() {}
		MyVisitor.prototype = new Visitor();

		MyVisitor.prototype.visit_number = function (number) {
			++count;
			assert.equal(number.value, 1);
		};

		MyVisitor.prototype.visit_string = function (string) {
			++count;
			assert.equal(string.value, 'abc');
		};

		new MyVisitor().visit(nodes);

		if (count !== 2) throw new Error('some node is never visited');
	});

	it('should visit nested node', function () {
		var count = 0;
		var node = {
			type: 'expression',
			value: { type: 'number', value: 1 }
		};

		function MyVisitor() {}
		MyVisitor.prototype = new Visitor();

		MyVisitor.prototype.visit_number = function (number) {
			++count;
			assert.equal(number.value, 1);
		};

		MyVisitor.prototype.visit_expression = function (expression) {
			++count;
			this.visit(expression.value);
		};

		new MyVisitor().visit(node);

		if (count !== 2) throw new Error('some node is never visited');
	});

	it('should visit node with visit_node method', function () {
		var count = 0;
		var node = { type: 'number', value: 1 };

		function MyVisitor() {}
		MyVisitor.prototype = new Visitor();

		MyVisitor.prototype.visit_node = function (number) {
			++count;
			assert.equal(number.value, 1);
		};

		new MyVisitor().visit(node);

		if (!count) throw new Error('node is never visited');
	});

	it('should ignore object does not have key type', function () {
		var count = 0;
		var node = { value: 1 };

		function MyVisitor() {}
		MyVisitor.prototype = new Visitor();

		MyVisitor.prototype.visit_node = function () {
			++count;
		};

		new MyVisitor().visit(node);

		if (count) throw new Error('node is not ignored');
	});

	it('should ignore object does not have key type of type string', function () {
		var count = 0;
		var node = { type: null, value: 1 };

		function MyVisitor() {}
		MyVisitor.prototype = new Visitor();

		MyVisitor.prototype.visit_null = function () {
			++count;
		};

		new MyVisitor().visit(node);

		if (count) throw new Error('node is not ignored');
	});

	it('should ignore null node', function () {
		var count = 0;
		var node = null;

		function MyVisitor() {}
		MyVisitor.prototype = new Visitor();

		MyVisitor.prototype.visit_node = function () {
			++count;
		};

		new MyVisitor().visit(node);

		if (count) throw new Error('node is not ignored');
	});

	it('should return the returning value of the corresponding method', function () {
		var node = { type: 'number', value: 1 };

		function MyVisitor() {}
		MyVisitor.prototype = new Visitor();

		MyVisitor.prototype.visit_number = function () {
			return 1;
		};

		var ret = new MyVisitor().visit(node);
		assert.equal(ret, 1);
	});

	it('should return array when visiting an array of nodes', function () {
		var nodes = [];

		var ret = new Visitor().visit(nodes);
		assert.equal(ret, nodes);
	});

	it('should return original node when visiting null node', function () {
		var node = null;

		var ret = new Visitor().visit(node);
		assert.strictEqual(ret, node);
	});
});