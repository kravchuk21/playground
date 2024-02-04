Symbol.iterator
Symbol.asyncIterator
Symbol.replace
Symbol.split
Symbol.search
Symbol.match
Symbol.matchAll
Symbol.isConcatSpreadable
Symbol.unscopables
Symbol.hasInstance
Symbol.species
Symbol.toPrimitive
Symbol.toStringTag

const a = {
    * [Symbol.iterator]() {
        for (let i = 0; i < 5; i++) {
            yield i;
        }
    }
}

for (const i of a) {
    console.log(i);
}

// ==================================================

const b = {
    async* [Symbol.asyncIterator]() {
        for (let i = 0; i < 5; i++) {
            yield Promise.resolve(i);
        }
    }
}

(async () => {
    for await (const i of b) {
        console.log(i);
    }
})();

// ==================================================

const normalize = {
    [Symbol.replace](str) {
        return str.replace(/^[\s*]+|[\s*]+$/g, '');
    }
};

'    hello world    '.replace(normalize);

// ==================================================

[].concat(1, 2, 3, {0: 4, 1: 5, length: 2, [Symbol.isConcatSpreadable]: true});

// ==================================================

class MyArray extends Array {
    static [Symbol.species] = Array;
}

new MyArray(1, 2, 3).filter(x => x > 2) instanceof MyArray; // false
new MyArray(1, 2, 3).filter(x => x > 2) instanceof Array; // true
