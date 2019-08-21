const puppeteer = require('puppeteer')

class Browser {
    constructor() {
        puppeteer
            .launch({ args: ['--no-sandbox'] })
            .then(browser => (this.browser = browser))
    }
    async screenshot(path, link) {
        try {
            const page = await this.browser.newPage()
            await page.goto(link, {
                waitUntil: 'networkidle2'
            })
            await page.setViewport({ width: 1280, height: 720 })
            await page.screenshot({ path, fullPage: true })
            await page.close()
        } catch (err) {
            throw new Error(err)
        }
    }
}
module.exports = new Browser()
