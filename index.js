const createElement = require('./lib/create')
const diff = require('./lib/diff')
const diffProps = require('./lib/diff').diffProps
const h = require('./lib/hyperscript')
const VNode = require('./lib/vnode')
const VText = require('./lib/vtext')

module.exports = {
    createElement,
    diff,
    diffProps,
    h,
    VNode,
    VText
}