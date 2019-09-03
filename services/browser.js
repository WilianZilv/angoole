const puppeteer = require('puppeteer')
const pagetoslices = require('./pagetoslices')

class Browser {
    constructor() {
        puppeteer
            .launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            .then(browser => (this.browser = browser))
            .catch(error => console.log(error))
    }

    async screenshot(path, link) {
        try {
            const page = await this.browser.newPage()
            await page.goto(link, {
                waitUntil: 'networkidle2'
            })

            await page.setViewport({ width: 1280, height: 4096 })
            const files = await pagetoslices(page, path)
            await page.close()
            return files
        } catch (err) {
            console.log(err)
            throw new Error(err)
        }
    }
}
module.exports = new Browser()
