const fetch = require('node-fetch')
const topdf = require('pdf-puppeteer')
const fs = require('fs-jetpack')

module.exports = (path, link) => {
	return new Promise((resolve, reject) => {
		const save = pdf => {
			fs.write(path, pdf)
			resolve(fs.createReadStream(path))
		}
		fetch(link)
			.then(r => r.text())
			.then(html => topdf(html, save))
			.catch(err => reject(err))
	})
}
