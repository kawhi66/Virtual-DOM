import {
    createElement,
    diff,
    h,
    patch
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


document.body.insertBefore(createElement(h('h1', {
    style: {
        'margin-top': '50px'
    }
}, '一个有趣的例子，猜到 100 的时候会发生什么')), scriptNode)

// 1: Create a function that declares what the DOM should look like
function render(count) {
    return h('div', {
        style: {
            textAlign: 'center',
            lineHeight: (25 + count) + 'px',
            border: '1px solid red',
            width: (25 + count) + 'px',
            height: (25 + count) + 'px'
        }
    }, [String(count)]);
}

// 2: Initialise the document
var count = 0; // We need some app data. Here we just store a count.

var tree = render(count); // We need an initial tree
var rootNode = createElement(tree); // Create an initial root DOM node ...
document.body.insertBefore(rootNode, scriptNode); // ... and it should be in the document

// 3: Wire up the update logic
setInterval(function () {
    count++;

    var newTree = render(count);
    var patches = diff(tree, newTree);
    rootNode = patch(rootNode, patches);
    tree = newTree;
}, 1000);

document.body.insertBefore(createElement(h('pre', [h('code', `
// 1: Create a function that declares what the DOM should look like
function render(count) {
    return h('div', {
        style: {
            textAlign: 'center',
            lineHeight: (25 + count) + 'px',
            border: '1px solid red',
            width: (25 + count) + 'px',
            height: (25 + count) + 'px'
        }
    }, [String(count)]);
}

// 2: Initialise the document
var count = 0; // We need some app data. Here we just store a count.

var tree = render(count); // We need an initial tree
var rootNode = createElement(tree); // Create an initial root DOM node ...
document.body.insertBefore(rootNode, scriptNode); // ... and it should be in the document

// 3: Wire up the update logic
setInterval(function () {
    count++;

    var newTree = render(count);
    var patches = diff(tree, newTree);
    rootNode = patch(rootNode, patches);
    tree = newTree;
}, 1000);
`)])), scriptNode)