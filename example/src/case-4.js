import {
    createElement,
    h
} from 'VirtualDOM'
import renderRoot from './root-node'
import renderSub from './sub-node'

const scriptNode = document.getElementsByTagName('script')[0];
document.body.insertBefore(createElement(h('h1', '子元素未知宽高(或已知宽高)，父子元素基于 table-cell 和 inline-block 实现')), scriptNode)
document.body.insertBefore(createElement(renderRoot({
    style: {
        display: 'table-cell',
        'text-align': 'center',
        'vertical-align': 'middle',
        border: '1px solid black',
        width: '250px',
        height: '250px'
    }
}, renderSub({
    style: {
        display: 'inline-block',
        border: '1px solid red',
        'line-height': '50px'
    }
}))), scriptNode)

document.body.insertBefore(createElement(h('pre', [h('code', `
.root {
    display: 'table-cell';
    text-align: 'center';
    vertical-align: 'middle';
}

.sub {
    display: 'inline-block';
}
`)])), scriptNode)