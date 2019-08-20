const search = require('../services/google')

module.exports = (messenger, { text }) => {
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
            messenger.send('Algo deu errado e eu não sei o que houve 😞')
        )
}
