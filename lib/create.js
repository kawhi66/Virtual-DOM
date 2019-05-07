'use strict';
exports = module.exports = createElement

/**
 * @description create element
 * @param {String} name element name
 * @param {Object} attributes 
 * @param {String | Array} children 
 */
function createElement(name, attributes, children) {
    const node = document.createElement(name)

    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            node.setAttribute(key, attributes[key])
        }
    }

    if (typeof children === 'string') {
        node.innerText = children
    } else {
        children.forEach(child => {
            node.appendChild(child)
        })
    }

    return node
}