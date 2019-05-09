const createElement = require('./lib/create')
const diff = require('./lib/diff')
const diffProps = require('./lib/diff').diffProps
const h = require('./lib/hyperscript')
const patch = require('./lib/patch')
const VNode = require('./lib/models/vnode')
const VText = require('./lib/models/vtext')

module.exports = {
    createElement,
    diff,
    diffProps,
    h,
    patch,
    VNode,
    VText
}