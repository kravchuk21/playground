function watch(obj, handler, path = []) {
    if(Object.isFrozen(obj) || Object.isSealed(obj)) {
        return obj;
    }

    Object.entries(Object.getOwnPropertyDescriptors(obj))
        .forEach(([key, desc]) => {
            if (desc.get || desc.set || !desc.writable || !desc.configurable) {
                return;
            }

            const sKey = Symbol(key);

            obj[sKey] = desc.value;

            Object.defineProperty(obj, key, {
                get() {
                    const val = obj[sKey];

                    if (val != null && typeof val === 'object') {
                        return watch(val, handler, [...path, key]);
                    }

                    return val;
                },
                set(val) {
                    const old = obj[sKey];
                    obj[sKey] = val;
                    handler(val, old, [...path, key]);
                }
            });
        })

    return obj;
}