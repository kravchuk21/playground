function symbolGenerator() {
    return new Proxy({}, {
        get(target, prop) {
            if (prop in target) {
                return target[prop];
            }

            return target[prop] = Symbol(String(prop));
        }
    });
}

var $$ = symbolGenerator();

console.log($$.foo)
console.log($$.foo === $$.foo)