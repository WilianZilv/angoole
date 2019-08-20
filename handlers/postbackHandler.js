const webtopdf = require('../services/webtopdf')
const fs = require('fs-jetpack')
const __publicdir = require('../public')

module.exports = (messenger, { title, payload }) => {
    messenger.send('Estou abrindo a página para você, aguarde...')

    title = title.replace(/[^a-z0-9]/gi, '') + '.pdf'

    const path = `${__publicdir}/${messenger.recipient_id}/${title}`

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
