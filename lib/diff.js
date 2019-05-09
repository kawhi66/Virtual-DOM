const getPrototype = require('../utils/get-prototype')
const isArray = require('../utils/is-array')
const isObject = require('../utils/is-object')
const isVHook = require('../utils/is-vhook')
const isVNode = require('../utils/is-vnode')
const isVText = require('../utils/is-vtext')
const VPatch = require('./vpatch')

exports = module.exports = diff
exports.diffProps = diffProps

/**
 * @description the implementation of Diff Algorithm, I haven't get it, there are some articles about it
 * @todo https://zhuanlan.zhihu.com/p/25630842
 * @todo http://www.cnblogs.com/fengyuqing/p/virtual-dom.html
 */

function diff(a, b) {
    let patch = {
        a: a
    }
    walk(a, b, patch, 0)
    return patch
}

function diffProps(a, b) {
    let diff

    for (let aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        let aValue = a[aKey]
        let bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isVHook(bValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (let bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function diffChildren(a, b, patch, apply, index) {
    const aChildren = a.children
    const orderedSet = reorder(aChildren, b.children)
    const bChildren = orderedSet.children

    const aLen = aChildren.length
    const bLen = bChildren.length
    const len = aLen > bLen ? aLen : bLen

    for (let i = 0; i < len; i++) {
        let leftNode = aChildren[i]
        let rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply, new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(VPatch.ORDER, a, orderedSet.moves))
    }

    return apply
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    let apply = patch[index]
    let applyClear = false

    if (b == null) {
        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                let propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply, new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(patch[index], new VPatch(VPatch.PROPS, vNode, undefinedKeys(vNode.hooks)))
        }

        if (vNode.descendantHooks) {
            const children = vNode.children
            const len = children.length
            for (let i = 0; i < len; i++) {
                let child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    }
}

function undefinedKeys(obj) {
    let result = {}

    for (let key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    const bChildIndex = keyIndex(bChildren)
    const bKeys = bChildIndex.keys
    const bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    const aChildIndex = keyIndex(aChildren)
    const aKeys = aChildIndex.keys
    const aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    let newChildren = []

    let freeIndex = 0
    let freeCount = bFree.length
    let deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (let i = 0; i < aChildren.length; i++) {
        const aItem = aChildren[i]
        let itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    let lastFreeIndex = freeIndex >= bFree.length ? bChildren.length : bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (let j = 0; j < bChildren.length; j++) {
        const newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    let simulate = newChildren.slice()
    let simulateIndex = 0
    let removes = []
    let inserts = []
    let simulateItem

    for (let k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({
                                key: wantedItem.key,
                                to: k
                            })
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    } else {
                        inserts.push({
                            key: wantedItem.key,
                            to: k
                        })
                    }
                } else {
                    inserts.push({
                        key: wantedItem.key,
                        to: k
                    })
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        } else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while (simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    let keys = {}
    let free = []
    let length = children.length

    for (let i = 0; i < length; i++) {
        let child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys, // A hash of key name to index
        free: free // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}