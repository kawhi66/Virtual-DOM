const diff = require('../index').diff
const diffProps = require('../index').diffProps
const h = require('../index').h

describe('diff algorithm', () => {
    test('diff', () => {
        const nodeA = h('.foo')
        const nodeB = h('.bar')
        console.log(diff(nodeA, nodeB))
    });

    test('add attributes to empty attributes', () => {
        const propsA = {
            attributes: {}
        }
        const propsB = {
            attributes: {
                class: "standard",
                "e-text": "custom"
            }
        }
        const diff = diffProps(propsA, propsB)
        expect(diff.attributes.class).toBe('standard')
        expect(diff.attributes['e-text']).toBe('custom')
    });
});