const h = require('./lib/create')
const div = h('div', {}, 'hello')
const ul = h('ul', {}, [h('li', {}, 'item - 1'), h('li', {}, 'item - 2')])

document.body.insertBefore(div, document.body.lastElementChild)
document.body.insertBefore(ul, document.body.lastElementChild)