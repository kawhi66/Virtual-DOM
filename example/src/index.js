import {
    createElement,
    h
} from 'VirtualDOM'

const scriptNode = document.getElementsByTagName('script')[0];
document.body.insertBefore(createElement(h('h1', '子元素水平垂直居中的解决方案')), scriptNode)
document.body.insertBefore(createElement(h('h2', '目录：')), scriptNode)
document.body.insertBefore(createElement(h('div', h('a', {
    href: '/case1.html'
}, '1、子元素已知宽高，父元素相对定位，子元素绝对定位配合 margin: auto 实现'))), scriptNode)

document.body.insertBefore(createElement(h('div', h('a', {
    href: '/case2.html'
}, '2、子元素未知宽高(或已知宽高)，父元素相对定位，子元素绝对定位配合 transform - translate 实现'))), scriptNode)

document.body.insertBefore(createElement(h('div', h('a', {
    href: '/case3.html'
}, '3、子元素未知宽高(或已知宽高)，父子元素基于弹性盒子实现'))), scriptNode)

document.body.insertBefore(createElement(h('div', h('a', {
    href: '/case4.html'
}, '4、子元素未知宽高(或已知宽高)，父子元素基于 table-cell 和 inline-block 实现'))), scriptNode)