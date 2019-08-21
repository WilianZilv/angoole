const search = require('../services/google')

module.exports = (messenger, { text }) => {
    if (!text) messenger.finishSession()

    if (text.toLowerCase().includes('youtube'))
        messenger.send(
            'Conteúdos do Youtube não podem ser visualizados 😞',
            true
        )

    messenger.send(`Pesquisando: ${text}`)

    search(text)
        .then(results =>
            results.reverse().filter(({ url }) => !url.includes('youtube'))
        )
        .then(results => {
            if (results.length > 0) {
                let buttons = []

                results.forEach(result => {
                    const button = messenger.sendButtons(result.title, [
                        {
                            type: 'postback',
                            title: result.title,
                            payload: result.url
                        }
                    ])
                    buttons.push(button)
                })
                Promise.all(buttons)
                    .then(messenger.finishSession())
                    .catch(messenger.finishSession())
            } else {
                messenger.send(
                    'Não encontrei nada sobre isso, desculpe 😢',
                    true
                )
            }
        })
        .catch(() =>
            messenger.send(
                'Não estou conseguindo fazer pesquisas no momento, tente novamente em outro momento 😞',
                true
            )
        )
}
