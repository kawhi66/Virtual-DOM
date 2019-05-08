const applyProperties = require("../utils/apply-properties")
const document = require("global/document")
const isVNode = require("../utils/is-vnode")
const isVText = require("../utils/is-vtext")

module.exports = createElement

function createElement(vnode, opts) {
    const doc = opts ? opts.document || document : document
    const warn = opts ? opts.warn : null

    if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    const node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    const props = vnode.properties
    applyProperties(node, props)

    const children = vnode.children

    for (let i = 0; i < children.length; i++) {
        const childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}