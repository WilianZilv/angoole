const search = require('../services/google')

module.exports = (messenger, { text }) => {
    if (!text) {
        return
    }
    messenger.send(`Pesquisando: ${text}`)

    search(text)
        .then(results => results.reverse())
        .then(results => {
            if (results.length > 0) {
                results.forEach(result =>
                    messenger.sendButtons(result.title, [
                        {
                            type: 'postback',
                            title: result.title,
                            payload: result.url
                        }
                    ])
                )
            } else {
                messenger.send('Não encontrei nada sobre isso, desculpe 😢')
            }
        })
        .catch(() =>
            messenger.send(
                'Não estou conseguindo fazer pesquisas no momento, tente novamente em outro momento 😞'
            )
        )
}
