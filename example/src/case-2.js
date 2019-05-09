import {
    createElement,
    h
} from 'VirtualDOM'
import renderRoot from './root-node'
import renderSub from './sub-node'

const scriptNode = document.getElementsByTagName('script')[0];
document.body.insertBefore(createElement(h('h1', '子元素未知宽高(或已知宽高)，父元素相对定位，子元素绝对定位配合 transform - translate 实现')), scriptNode)
document.body.insertBefore(createElement(renderRoot({
    style: {
        display: 'block',
        border: '1px solid black',
        width: '250px',
        height: '250px',
        position: 'relative'
    }
}, renderSub({
    style: {
        display: 'block',
        border: '1px solid red',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        'line-height': '50px',
        'text-align': 'center'
    }
}))), scriptNode)

document.body.insertBefore(createElement(h('pre', [h('code', `
.root {
    position: 'relative';
}

.sub {
    transform: 'translate(-50%, -50%)';
    position: 'absolute';
    left: '50%';
    top: '50%';
}
`)])), scriptNode)