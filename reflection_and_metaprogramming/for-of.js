function gen() {
    function* innerGen(){
        for (let i = 0; i < 5; i++) {
            yield i
        }
    }

    const it = innerGen();

    Object.defineProperty(it, 'return', { value: undefined});

    return it;
}

var iter = gen();

for (const i of iter) {
    break;
}

console.log([...iter])