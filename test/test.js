var assert = require('assert');
var Visitor = require('../Visitor');

describe('Visitor', function () {
	it('should visit a single node', function () {
		var count = 0;

		var node = { type: 'number', value: 1 };
		new Visitor({
			number: function (number) {
				++count;
				assert.equal(number.value, 1);
			}
		}).visit(node);

		if (!count) throw new Error('node is never visited');
	});

	it('should visit an array of nodes', function () {
		var count = 0;

		var nodes = [
			{ type: 'number', value: 1 },
			{ type: 'string', value: 'abc'}
		];
		new Visitor({
			number: function (number) {
				++count;
				assert.equal(number.value, 1);
			},
			string: function (string) {
				++count;
				assert.equal(string.value, 'abc');
			}
		}).visit(nodes);

		if (count !== 2) throw new Error('some node is never visited');
	});

	it('should visit nested node', function () {
		var count = 0;

		var node = {
			type: 'expression',
			value: { type: 'number', value: 1 }
		};
		new Visitor({
			expression: function (expression) {
				++count;
				this.visit(expression.value);
			},
			number: function (number) {
				++count;
				assert.equal(number.value, 1);
			}
		}).visit(node);

		if (count !== 2) throw new Error('some node is never visited');
	});

	it('should visit node with catch-all action', function () {
		var count = 0;

		var node = { type: 'number', value: 1 };
		new Visitor({
			node: function (number) {
				++count;
				assert.equal(number.value, 1);
			}
		}).visit(node);

		if (!count) throw new Error('node is never visited');
	});

	it('should ignore object does not have key type', function () {
		var count = 0;

		var node = { value: 1 };
		new Visitor({
			node: function () {
				++count;
			}
		}).visit(node);

		if (count) throw new Error('node is not ignored');
	});

	it('should ignore null', function () {
		var count = 0;

		var node = null;
		new Visitor({
			node: function () {
				++count;
			}
		}).visit(node);

		if (count) throw new Error('node is not ignored');
	});
});