const fs = require('fs-jetpack')
const publicdir = require('../public')
const os_path = require('path')

module.exports = (browser, messenger, { title, payload }) => {
    messenger.send('Estou abrindo a página para você, aguarde...')

    title = title.replace(/[^a-z0-9]/gi, '') + '.png'

    const recipientPath = os_path.join(publicdir, messenger.recipient_id)
    const filePath = os_path.join(recipientPath, title)
    fs.dir(recipientPath)

    browser
        .screenshot(filePath, payload)
        .then(async files => {
            const fileCount = files.length
            if (fileCount > 1) {
                messenger.send(
                    `A página é muito grande, estou enviando em ${fileCount} partes para você conseguir ler o conteúdo 😎.`
                )
            } else {
                messenger.send('Estou enviando ✌')
            }

            for (const file of files) {
                await messenger
                    .sendFile(file, 'image')
                    .catch(err => console.log(err))
            }
            messenger.send('Prontinho 🙂', true)

            fs.dir(recipientPath).remove()
        })
        .catch(() =>
            messenger.send(
                'Eu tive um problema para abrir esta página, desculpe 😢',
                true
            )
        )
}
