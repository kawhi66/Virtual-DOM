import {
    h
} from 'VirtualDOM'

export default function renderSub(props, text) {
    return h('div.sub', props || {}, text || 'hello you')
}