'use strict';
const evHook = require('./hooks/ev-hook.js')
const isArray = require('../utils/is-array')
const isVHook = require('../utils/is-vhook')
const isVNode = require('../utils/is-vnode')
const isVText = require('../utils/is-vtext')
const parseTag = require('../utils/parse-tag')
const softSetHook = require('./hooks/soft-set-hook')
const VNode = require('./models/vnode')
const VText = require('./models/vtext')
module.exports = h

function h(tagName, properties, children) {
    let childNodes = [];
    let tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties
        props = {}
    }

    props = props || properties || {}
    tag = parseTag(tagName, props)

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key
        props.key = undefined
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace
        props.namespace = undefined
    }

    // fix cursor bug
    if (
        tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isVHook(props.value)
    ) {
        if (props.value !== null && typeof props.value !== 'string') {
            throw UnsupportedValueType({
                expected: 'String',
                received: typeof props.value,
                Vnode: {
                    tagName: tag,
                    properties: props
                }
            })
        }
        props.value = softSetHook(props.value)
    }

    transformProperties(props)

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props)
    }

    return new VNode(tag, props, childNodes, key, namespace)
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c))
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)))
    } else if (isChild(c)) {
        childNodes.push(c)
    } else if (isArray(c)) {
        for (let i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props)
        }
    } else if (c === null || c === undefined) {
        return
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        })
    }
}

function transformProperties(props) {
    for (let propName in props) {
        if (props.hasOwnProperty(propName)) {
            const value = props[propName]

            if (isVHook(value)) {
                continue
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value)
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x)
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x)
}

function UnexpectedVirtualElement(data) {
    var err = new Error()

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
    '\n' +
    'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function UnsupportedValueType(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unsupported.value-type';
    err.message = 'Unexpected value type for input passed to h().\n' +
        'Expected a ' +
        errorString(data.expected) +
        ' but got:\n' +
        errorString(data.received) +
        '.\n' +
        'The vnode is:\n' +
        errorString(data.Vnode)
    '\n' +
    'Suggested fix: Cast the value passed to h() to a string using String(value).';
    err.Vnode = data.Vnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ')
    } catch (e) {
        return String(obj)
    }
}