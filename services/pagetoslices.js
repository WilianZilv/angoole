const Slices = require('slices')

const cut = (height, targetHeight) => {
    let lines = []

    let start = 1
    while (start < height) {
        const line = targetHeight * start

        if (line >= height) break

        lines.push(line)
        start++
    }
    return lines
}
module.exports = async (page, path) => {
    const viewport = page.viewport()

    const body = await page.$('body')
    const bodySize = await body.boundingBox()
    const lines = cut(bodySize.height, viewport.height)

    const clips = Slices(bodySize.width, bodySize.height, lines, [])

    const saveToDir = path.split('.png')[0]

    let workers = []
    let files = []

    clips.forEach((clip, i) => {
        const slicePath = `${saveToDir}-${i}.png`
        workers.push(
            page.screenshot({
                path: slicePath,
                clip
            })
        )
        files.push(slicePath)
    })
    await Promise.all(workers).catch(err => console.log(err))
    return files
}
