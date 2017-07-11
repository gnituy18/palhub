const fs = require('fs')
const path = require('path')

module.exports.features = fs.readdirSync(path.join(__dirname, '../web/feature'))
