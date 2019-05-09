import {
    createElement,
    h
} from 'VirtualDOM'
import renderRoot from './root-node'
import renderSub from './sub-node'

const scriptNode = document.getElementsByTagName('script')[0];
document.body.insertBefore(createElement(h('h1', '子元素未知宽高(或已知宽高)，父子元素基于弹性盒子实现')), scriptNode)
document.body.insertBefore(createElement(renderRoot({
    style: {
        display: 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        border: '1px solid black',
        width: '250px',
        height: '250px'
    }
}, renderSub({
    style: {
        border: '1px solid red',
        'line-height': '50px',
        'text-align': 'center'
    }
}))), scriptNode)

document.body.insertBefore(createElement(h('pre', [h('code', `
.root {
    display: 'flex';
    align-items: 'center';
    justify-content: 'center';
}

.sub {}
`)])), scriptNode)