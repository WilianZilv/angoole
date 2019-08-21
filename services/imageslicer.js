const fs = require('fs-jetpack')
const sizeOf = require('image-size')
const imageToSlices = require('image-to-slices')
imageToSlices.configure({
    clipperOptions: {
        canvas: require('canvas')
    }
})

const maxHeight = 2048
const offset = 200

module.exports = async path => {
    let lines = []

    const { height } = sizeOf(path)

    if (height <= maxHeight + offset) {
        return path
    }

    let start = 1
    while (start < height) {
        const line = maxHeight * start

        if (line >= height) break

        lines.push(line)
        start++
    }

    const saveToDir = path.split('.png')[0]

    fs.dir(saveToDir)
    return new Promise(resolve => {
        imageToSlices(
            path,
            lines,
            [],
            {
                saveToDir
            },
            () => {
                lines.push(0)
                resolve({
                    folder: saveToDir,
                    files: lines.map(
                        (line, i) => `${saveToDir}/section-${i + 1}.png`
                    )
                })
            }
        )
    })
}
