# AST Visitor

Visit nodes in the abstract syntax tree.

## Example

Visit a single node:

```javascript
var Visitor = require('ast-visitor');

var node = { type: 'number', value: 1 };
var visitor = new Visitor({
	number: function (number) {
	    console.log(number.value);
	}
});
visitor.visit(node); // 1
```

Visit an array of nodes:

```javascript
var Visitor = require('ast-visitor');

var nodes = [
	{ type: 'number', value: 1 },
	{ type: 'string', value: 'abc', quote: '"' }
];
var visitor = new Visitor({
	number: function (number) {
	    console.log(number.value);
	},
	string: function (string) {
	    console.log(string.quote + string.value + string.quote);
	}
});
visitor.visit(nodes); // 1 "abc"
```

Visit nested nodes:

```javascript
var Visitor = require('ast-visitor');

var ast = {
		type: 'binaryExpression',
		operator: '+',
		left: { type: 'number', value: 1 },
		right: { type: 'string', value: 'abc' }
};
var visitor = new Visitor({
	binaryExpression: function (binaryExpression) {
		this.visit(binaryExpression.left);
		console.log(binaryExpression.operator);
		this.visit(binaryExpression.right);
	},
	number: function (number) {
	    console.log(number.value);
	},
	string: function (string) {
	    console.log(string.quote + string.value + string.quote);
	}
});
visitor.visit(ast); // 1 + "abc"
```

One function to rule them all:

```javascript
var Visitor = require('ast-visitor');

var nodes = [
	{ type: 'number', value: 1 },
	{ type: 'string', value: 'abc', quote: '"' }
];
var visitor = new Visitor({
	node: function (node) {
		console.log(node.value);
	}
});
visitor.visit(nodes); // 1 abc
```

## API

```javascript
var visitor = new Visitor(actions);
```

`actions` is an object containing functions (each one is call an "action"). If the key and the value of the node's `type` property are equal, that node will be passed to the action. If no such key exists for an node, an action of key `node` will be called, if there is one. Otherwise, the node is silently ignored. Nodes don't have a `type` property are also ignored.

```javascript
var nodes = [
	{ type: 'number', value: 1 },
	{ type: 'string', value: 'abc', quote: '"' }
	{ type: 'boolean', value: true }
];
var visitor = new Visitor({
	number: function (number) {
	    // number nodes are passed here
	},
	node: function (string) {
	    // string and boolean nodes are passed here
	    // number nodes are NOT passed here
	}
});
visitor.visit(nodes);
```

`visitor` has a method `visit()`. You can pass a single node or an array of nodes, in the latter case, each node in the array will be visited sequentially.

`this` keyword in each action refers to the `visitor` object in the previous example. Note however, actions are not added to the `visitor` object, so `visitor.number` does not exist (nor does `this.number` in each action for that matter).