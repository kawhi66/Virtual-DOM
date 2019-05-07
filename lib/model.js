exports = module.exports = Model

function Model(options) {
    this.data = options.data || {}
    this.el = options.el || '#app'
    this.template = options.template || ''
}