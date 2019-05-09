const createElement = require('./lib/create')
const diff = require('./lib/diff')
const diffProps = require('./lib/diff').diffProps
const h = require('./lib/hyperscript')
const VNode = require('./lib/model/vnode')
const VText = require('./lib/model/vtext')

module.exports = {
    createElement,
    diff,
    diffProps,
    h,
    VNode,
    VText
}