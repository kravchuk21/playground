var a = {a: 1, b: 2};

var proxy = new Proxy(a, {
    get(target, prop, receiver) {
        console.log(prop);
        return target[prop];
    }
});

// ==================================================

var b = Map();

// var proxy2 = new Proxy(b, {
var {proxy2, revoke} = new Proxy.revocable(b, {
    get(target, prop, receiver) {
        const val = Reflect.get(target, prop, receiver);

        if (
            typeof val === 'function' &&
            /\[native code]/.test(val.toString())
        ) {
            return val.bind(target);
        }

        return val;
    },

    set(target, p, newValue, receiver) {
        return Reflect.set(target, p, newValue, receiver);
    },

    deleteProperty(target, p) {
        if (typeof p === 'string' && p.startsWith('_')) {
            return false;
        }

        return Reflect.deleteProperty(target, p);
    },

    has(target, p) {
        return Reflect.has(target, p);
    },


    getOwnPropertyDescriptor(target, p) {
        // return {
        //     value: target[p],
        //     writable: false,
        //     enumerable: false,
        //     configurable: false
        // }

        return Reflect.getOwnPropertyDescriptor(target, p);
    },

    ownKeys(target) {
        return Reflect.ownKeys(target).filter(key => !key.startsWith('_'));
    },

    defineProperty(target, p, attributes) {
        return Reflect.defineProperty(target, p, attributes);
    },

    preventExtensions(target) {
        return Reflect.preventExtensions(target);
    },

    isExtensible(target) {
        return Reflect.isExtensible(target);
    },

    apply(target, thisArg, argArray) {
        return Reflect.apply(target, thisArg, argArray);
    },

    construct(target, argArray, newTarget) {
        return Reflect.construct(target, argArray, newTarget);
    },

    getPrototypeOf(target) {
        return Reflect.getPrototypeOf(target);
    },

    setPrototypeOf(target, v) {
        return Reflect.setPrototypeOf(target, v);
    }
});

