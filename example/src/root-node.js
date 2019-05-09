import {
    h
} from 'VirtualDOM'

export default function renderRoot(props, children) {
    return h('div.root', props || {}, children || [])
}