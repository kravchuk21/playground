function wrap(fn) {
    if (fn.name.startsWith('ignore')) {
        return fn;
    }

    return fn.bind({bla: 1});
}

wrap(function foo(a, b) { console.log(this) })();

// ==================================================

var f = Function('a', 'b', 'console.log(a + b)');
