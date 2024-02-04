// enumerable - нельзя перечислять
// writable - нельзя перезаписывать, но можно удалять и можно переконфигурировать
// configurable - нельзя удалять, конфигурировать, но можно менять значение

var a = {}

Object.defineProperty(a, 'foo', {
    enumerable: true,
    get() {
        return this._bar * 10
    },
    set(v) {
        if (typeof v !== 'number') throw new TypeError('bla must be a number')

        this._bar = v
    }
})

// ==================================================

class Foo {
    #bar = 0
    get foo() {
        return this.#bar * 10
    }

    set foo(v) {
        if (typeof v !== 'number') throw new TypeError('bla must be a number')

        this.#bar = v
    }
}