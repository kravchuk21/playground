function extend(...objs) {
    return new Proxy({}, {
        get(target, prop, receiver) {
            if (prop in target) {
                return Reflect.get(target, prop, receiver);
            }

            for (const obj of objs) {
                if (prop in obj) {
                    return obj[prop];
                }
            }
        }
    });
}

var o = extend({a: 1}, {b: 2}, {c: 3});

o.e = 4;

console.log(o.a);
console.log(o.b);
console.log(o.c);
console.log(o.e);