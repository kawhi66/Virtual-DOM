var version = require("./version")

module.exports = isVNode

function isVNode(x) {
    return x && x.type === "VNODE" && x.version === version
}