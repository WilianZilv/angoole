const webtopdf = require('../services/webtopdf')
const fs = require('fs-jetpack')
const publicdir = require('../public')
const os_path = require('path')

module.exports = (messenger, { title, payload }) => {
    messenger.send('Estou abrindo a página para você, aguarde...')

    title = title.replace(/[^a-z0-9]/gi, '') + '.pdf'

    const path = os_path.join(publicdir, messenger.recipient_id, title)

    webtopdf(path, payload)
        .then(() => {
            messenger.send('Estou enviando o arquivo 🙂')
            return messenger.sendFile(path, 'file')
        })
        .then(() => fs.remove(path))
        .catch(() =>
            messenger.send(
                'Eu tive um problema para abrir esta página, desculpe 😢'
            )
        )
}
