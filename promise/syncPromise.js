class SyncPromise {
    static resolve(value) {
        if (value instanceof SyncPromise) {
            return value;
        }

        return new SyncPromise((resolve) => resolve(value));
    }

    static reject(reason) {
        return new SyncPromise((_, reject) => reject(reason));
    }

    static all(iterable) {
        const tasks = Array.from(iterable);

        if (tasks.length === 0) {
            return SyncPromise.resolve([]);
        }

        return new SyncPromise((resolve, reject) => {
            const results = new Array(tasks.length);
            let done = 0;

            for (let i = 0; i < tasks.length; i++) {
                tasks[i] = SyncPromise.resolve(tasks[i]);

                tasks[i].then((res) => {
                    results[i] = res;
                    done++;

                    if (done === tasks.length) {
                        resolve(results);
                    }
                }).catch(reject);
            }
        })
    }

    static allSettled(iterable) {
        const tasks = Array.from(iterable);

        if (tasks.length === 0) {
            return SyncPromise.resolve([]);
        }

        return new SyncPromise((resolve, reject) => {
            const results = new Array(tasks.length);
            let done = 0;

            for (let i = 0; i < tasks.length; i++) {
                tasks[i] = SyncPromise.resolve(tasks[i]);

                tasks[i].then((value) => {
                    results[i] = {
                        status: 'fulfilled',
                        value,
                    };
                    done++;

                    if (done === tasks.length) {
                        resolve(results);
                    }
                }).catch((reason) => {
                    results[i] = {
                        status: 'rejected',
                        reason,
                    };
                    done++;

                    if (done === tasks.length) {
                        resolve(results);
                    }

                });
            }
        })
    }

    static race(iterable) {
        const tasks = Array.from(iterable);

        if (tasks.length === 0) {
            return SyncPromise.resolve([]);
        }

        return new SyncPromise((resolve, reject) => {
            for (let i = 0; i < tasks.length; i++) {
                SyncPromise.resolve(tasks[i]).then(resolve, reject);
            }
        })
    }

    constructor(constructor) {
        this.value = undefined;
        this.reason = undefined;

        this.status = 'pending';
        this.onFullfilled = [];
        this.onRejected = [];

        const resolve = (value) => {
            if (this.status !== 'pending') {
                return;
            }

            if (value != null && typeof value.then === 'function') {
                value.then(resolve, reject);
                return;
            }

            this.status = 'fulfilled';
            this.value = value;

            for (const fn of this.onFullfilled) {
                fn(this.value);
            }
        }

        const reject = (error) => {
            if (this.status !== 'pending') {
                return;
            }

            this.status = 'rejected';
            this.reason = error;

            for (const fn of this.onRejected) {
                fn(this.reason);
            }

            queueMicrotask(() => {
                if (this.onRejected.length === 0) {
                    void Promise.reject(this.reason);
                }
            })
        }

        try {
            constructor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(onFullfilled, onRejected) {
        return new SyncPromise((resolve, reject) => {

            const wrappedResolve = () => {
                try {
                    resolve(onFullfilled ? onFullfilled(this.value) : this.value);
                } catch (error) {
                    reject(error);
                }
            }

            const wrappedReject = () => {
                if (onRejected) {
                    try {
                        resolve(onRejected(this.reason));
                    } catch (error) {
                        reject(error);
                    }

                } else {
                    reject(this.reason);
                }
            }

            if (this.status === 'fulfilled') {
                wrappedResolve();
                return;
            }

            if (this.status === 'rejected') {
                wrappedReject();
                return;
            }

            this.onFullfilled.push(wrappedResolve);
            this.onRejected.push(wrappedReject);
        })
    }

    catch(onRejected) {
        return new SyncPromise((resolve, reject) => {
            if (this.status === 'fulfilled') {
                resolve(this.value);

                return;
            }

            const wrappedReject = () => {
                if (onRejected) {
                    try {
                        resolve(onRejected(this.reason));
                    } catch (error) {
                        reject(error);
                    }

                } else {
                    reject(this.reason);
                }
            }

            if (this.status === 'rejected') {
                wrappedReject();
                return;
            }

            this.onFullfilled.push(resolve);
            this.onRejected.push(wrappedReject);
        })
    }

    finally(cb) {
        return new SyncPromise((resolve, reject) => {

            const wrappedResolve = () => {
                try {
                    let res = cb();

                    if (typeof res.then === 'function') {
                        res = res.then(() => this.value);
                    } else {
                        res = this.value;
                    }

                    resolve(res);
                } catch (error) {
                    reject(error);
                }
            }

            const wrappedReject = () => {
                try {
                    let res = cb();

                    if (typeof res.then === 'function') {
                        res = res.then(() => {
                            throw this.reason
                        });

                        resolve(res);
                    } else {
                        reject(this.reason);
                    }

                } catch (error) {
                    reject(error);
                }
            }

            if (this.status === 'fulfilled') {
                wrappedResolve();
                return;
            }

            if (this.status === 'rejected') {
                wrappedReject();
                return;
            }

            this.onFullfilled.push(wrappedResolve);
            this.onRejected.push(wrappedReject);
        })
    }
}


new SyncPromise((resolve) => {
    resolve(1);
}).then(console.log)

console.log(2)