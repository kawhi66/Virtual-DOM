const version = require('../../utils/version')
exports = module.exports = VText

function VText(text) {
    this.text = String(text)
}

VText.prototype.type = "VTEXT"
VText.prototype.version = version