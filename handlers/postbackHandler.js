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
        .then(async result => {
            if (typeof result == 'object') {
                messenger.send(
                    'A página é muito grande, então vou enviá-la em partes, se algo estiver cortado, me desculpe, estou fazendo o máximo que posso no momento.'
                )
                const { files } = result

                for (const file of files) {
                    try {
                        await messenger.sendFile(file, 'image')
                    } catch (err) {
                        messenger.send(
                            'Não consegui enviar uma parte, vou tentar de novo, se eu não conseguir, vou pular para a próxima, tá bom?'
                        )
                        await messenger.sendFile(file, 'image')
                    }
                }
                messenger.send('Prontinho 🙂')
            } else {
                messenger.send('Estou enviando a imagem 🙂')
                await messenger.sendFile(filePath, 'image')
            }
            fs.dir(recipientPath).remove()
        })
        .catch(() =>
            messenger.send(
                'Eu tive um problema para abrir esta página, desculpe 😢'
            )
        )
}
