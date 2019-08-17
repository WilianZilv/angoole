const fs = require('fs-jetpack')
const urltoimage = require('url-to-image')

module.exports = (path, link) => {
	return new Promise((resolve, reject) => {
		urltoimage(link, path, {
			requestTimeout: 500,
			fileQuality: 65,
			width: 1920
		})
			.then(() => resolve(fs.createReadStream(path)))
			.catch(err => reject(err))
	})
}
