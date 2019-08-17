const fs = require('fs-jetpack')
const urltoimage = require('url-to-image')

module.exports = (path, link) => {
    return new Promise((resolve, reject) => {
        urltoimage(link, path, {
            fileQuality: 65,
            width: 1920,
            verbose: true,
            phantomArguments: '--ignore-ssl-errors=true '
        })
            .then(() => resolve(fs.createReadStream(path)))
            .catch(err => reject(err))
    })
}
