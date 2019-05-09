const diffProps = require('../index').diffProps

describe('diff algorithm', () => {
    test.todo('diff');
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