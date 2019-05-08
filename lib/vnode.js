const version = require('../utils/version')
exports = module.exports = VNode

const noProperties = {}
const noChildren = []

function VNode(tagName, properties, children) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
}

VNode.prototype.type = "VNODE"
VNode.prototype.version = version