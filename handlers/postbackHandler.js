const fs = require('fs-jetpack')
const publicdir = require('../public')
const os_path = require('path')

module.exports = (browser, messenger, { title, payload }) => {
    messenger.send('Estou abrindo a página para você, aguarde...')

    title = title.replace(/[^a-z0-9]/gi, '') + '.png'

    fs.dir(os_path.join(publicdir, messenger.recipient_id))
    const path = os_path.join(publicdir, messenger.recipient_id, title)

    browser
        .screenshot(path, payload)
        .then(() => {
            messenger.send('Estou enviando a imagem 🙂')
            messenger.sendFile(path, 'image').then(() => fs.remove(path))
        })
        .catch(() =>
            messenger.send(
                'Eu tive um problema para abrir esta página, desculpe 😢'
            )
        )
}
