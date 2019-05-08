var version = require("./version")

module.exports = isVText

function isVText(x) {
    return x && x.type === "VTEXT" && x.version === version
}