const version = require('../utils/version')

VPatch.NONE = 0
VPatch.VTEXT = 1
VPatch.VNODE = 2
VPatch.WIDGET = 3
VPatch.PROPS = 4
VPatch.ORDER = 5
VPatch.INSERT = 6
VPatch.REMOVE = 7
VPatch.THUNK = 8

module.exports = VPatch

function VPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VPatch.prototype.type = "VPATCH"
VPatch.prototype.version = version