const search = require('../services/google')

const read = (msg, words) => {
    msg = msg.toLowerCase()
    for (const word of words) if (word == msg) return true
    return false
}
module.exports = (messenger, { text }) => {
    if (!text) return messenger.finishSession()

    const msg = text.toLowerCase()
    if (msg.includes('youtube'))
        return messenger.send(
            'Conteúdos do Youtube não podem ser visualizados 😞',
            true
        )
    if (read(msg, ['obrigado', 'obrigado!']))
        return messenger.send('Não há de quê ❤️️', true)

    if (read(msg, ['oi', 'olá']))
        return messenger
            .send('Oi! 😃', true)
            .then(() =>
                messenger.send('Me envie algo que você queira pesquisar')
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
