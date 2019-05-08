const EvStore = require('ev-store')
const h = require('../index').h

describe('hyperscript', () => {
    test('h is a function', () => {
        expect(typeof h).toBe('function')
    });

    test('h returns a vnode', () => {
        expect(h('div').tagName).toBe('DIV')
    });

    test('h defaults tagName to uppercase', () => {
        expect(h('').tagName).toBe('DIV')
        expect(h('div').tagName).toBe('DIV')
    });

    test('h preserves tagName case if namespace is given', () => {
        expect(h("test", {
            namespace: "http://www.w3.org/XML/1998/namespace"
        }).tagName).toBe('test')
    });

    test('h has props', () => {
        expect(h("div", {
            foo: "bar"
        }).properties.foo).toBe('bar')
    });

    test('h with text', () => {
        const node = h('div', 'text')
        expect(node.children[0].text).toBe('text')
    });

    test('h with key', () => {
        const node = h('div', {
            key: 'bar'
        })
        expect(node.key).toBe('bar')
    });

    test('h with ev-', () => { // I haven't get it, but it can pass
        const node = h("div", {
            "ev-foo": "bar"
        })
        expect(node.properties['ev-foo'].value).toBe('bar')

        const hook = node.properties["ev-foo"]
        const elem = {}
        hook.hook(elem, "ev-foo")
        expect(EvStore(elem).foo).toBe('bar')
    });

    test('input.value soft hook', () => { // I haven't get it, but it can pass
        const node = h("input", {
            value: "text"
        })
        expect(typeof node.properties.value).toBe('object')

        const elem = {}
        node.properties.value.hook(elem, "value")
        expect(elem.value).toBe('text')
    });

    test('input.value must be string', () => {
        expect(function () {
            h('input', {
                value: 1234
            })
        }).toThrow()

        expect(function () {
            h('input', {
                value: {}
            })
        }).toThrow()
    });

    test('h with child', () => {
        const node = h('div', h('span'))
        expect(node.children[0].tagName).toBe('SPAN')
    });

    test('h with children', () => {
        const node = h('div', [h('span')])
        expect(node.children[0].tagName).toBe('SPAN')
    });

    test('h with null or undefined', () => {
        expect(h('div', null).children).toHaveLength(0)
        expect(h('div', [null]).children).toHaveLength(0)
        expect(h('div', undefined).children).toHaveLength(0)
        expect(h('div', [undefined]).children).toHaveLength(0)
    });

    test('h with foreign object', () => {
        let errorSingleChild, errorChildren;

        try {
            h('div', null, {
                foreign: 'object'
            })
        } catch (error) {
            errorSingleChild = error
        }

        try {
            h('div', [{
                foreign: 'object'
            }])
        } catch (error) {
            errorChildren = error
        }

        expect(errorSingleChild.message).toMatch(/Unexpected virtual child/)
        expect(errorChildren.message).toMatch(/Unexpected virtual child/)
    });

    test('h with class', () => {
        const node = h('.foo')
        expect(node.properties.className).toBe('foo')
    });

    test('h with id', () => {
        const node = h('#foo')
        expect(node.properties.id).toBe('foo')
    });

    test('h with empty string', () => {
        const node = h("")
        expect(node.tagName).toBe('DIV')
    });

    test('h with two classes', () => {
        const node = h('.foo', {
            className: 'bar'
        })
        expect(node.properties.className).toBe('foo bar')
    });

    test('h with two ids', () => {
        const node = h('#foo', {
            id: 'bar'
        })
        expect(node.properties.id).toBe('bar')
    });
});