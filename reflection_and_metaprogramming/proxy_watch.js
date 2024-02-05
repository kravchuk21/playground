function watch(obj, handler, path = []) {
    if (Object.isFrozen(obj) || Object.isSealed(obj)) {
        return obj;
    }

    const proxy = new Proxy(obj, {
        get(target, p, receiver) {
            const val = Reflect.get(target, p, receiver);

            if (
                typeof val === 'function' &&
                /\[native code]/.test(val.toString())
            ) {
                if (Array.isArray(target)) {
                    return val;
                }

                if (p === 'set') {
                    return (key, valToSet) => {
                        handler(valToSet, target[key], [...path, key]);
                        return val.call(target, key, valToSet);
                    }
                }

                return val.bind(target);
            }

            if (val != null && typeof val === 'object') {
                return watch(val, handler, [...path, p]);
            }

            return val;
        },

        set(target, p, value, receiver) {
            const
                old = Reflect.get(target, p, receiver),
                result = Reflect.set(target, p, value, receiver);

            if (result) {
                handler(value, old, [...path, p]);
            }

            return result
        },

        deleteProperty(target, p) {
            const
                old = Reflect.get(target, p, receiver),
                result = Reflect.deleteProperty(target, p);

            if (result) {
                handler(undefined, old, [...path, p]);
            }

            return result
        }
    });

    return proxy;
}