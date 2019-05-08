const isVHook = require('../utils/is-vhook')
const isVNode = require('../utils/is-vnode')
const version = require('../utils/version')
exports = module.exports = VNode

const noProperties = {}
const noChildren = []

function VNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    let count = (children && children.length) || 0
    let descendants = 0
    let descendantHooks = false
    let hooks

    for (let propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            let property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        }
    }

    this.count = count + descendants
    this.descendantHooks = descendantHooks
    this.hooks = hooks
}

VNode.prototype.type = "VNODE"
VNode.prototype.version = version