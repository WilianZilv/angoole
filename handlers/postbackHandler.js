const fs = require('fs-jetpack')
const publicdir = require('../public')
const os_path = require('path')
const slice = require('../services/imageslicer')
const sizeOf = require('image-size')

module.exports = (browser, messenger, { title, payload }) => {
    messenger.send('Estou abrindo a página para você, aguarde...')

    title = title.replace(/[^a-z0-9]/gi, '') + '.png'

    const recipientPath = os_path.join(publicdir, messenger.recipient_id)
    const filePath = os_path.join(recipientPath, title)
    fs.dir(recipientPath)

    browser
        .screenshot(filePath, payload)
        .then(() => {
            const { height } = sizeOf(filePath)
            if (height > process.env.SLICE_HEIGHT_LIMIT) {
                messenger.send(
                    'A página é grande demais para meu processadorzinho, não vou conseguir recortar para você 😥'
                )
                return filePath
            }
            messenger.send(
                'Consegui abrir a página! Aguarde mais um pouquinho.'
            )
            return slice(filePath)
        })
        .then(async result => {
            if (result) {
                if (typeof result == 'object') {
                    messenger.send(
                        'A página é muito grande, então vou enviá-la em partes, se algo estiver cortado, me desculpe, estou fazendo o máximo que posso no momento.'
                    )
                    const { files } = result

                    for (const file of files) {
                        await messenger
                            .sendFile(file, 'image')
                            .catch(err => console.log(err))
                    }
                    messenger.send('Prontinho 🙂', true)
                } else {
                    await messenger.sendFile(filePath, 'image', true)
                }
            }
            fs.dir(recipientPath).remove()
        })
        .catch(() =>
            messenger.send(
                'Eu tive um problema para abrir esta página, desculpe 😢',
                true
            )
        )
}
