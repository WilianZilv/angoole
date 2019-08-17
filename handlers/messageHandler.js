const Messenger = require('../services/messenger')
const search = require('../services/google')
const webtopdf = require('../services/webtopdf')
const fs = require('fs-jetpack')
const __publicdir = require('../public')

module.exports = ({ recipient, message }, postback = false) => {
	const messenger = new Messenger(recipient)

	if (postback) {
		messenger.send('Estou abrindo a página para você, aguarde...')

		let { title, payload } = message

		title = title.replace(/[^a-z0-9]/gi, '') + '.pdf'

		const path = `${__publicdir}\\${recipient}\\${title}`

		webtopdf(path, payload)
			.then(file => {
				messenger.send('Estou enviando o arquivo 🙂')
				return messenger.sendFile(null, 'file', file)
			})
			.then(() => fs.remove(path))
			.catch(err => {
				console.log(err)
				messenger.send(
					'Eu tive um problema para abrir esta página, desculpe 😢 '
				)
			})
		return
	}

	messenger.send(`Pesquisando: ${message}`)

	search(message)
		.then(results => {
			for (const result of results) {
				messenger.sendButtons(result.title, [
					{
						type: 'postback',
						title: result.title,
						payload: result.link
					}
				])
			}
		})
		.catch(() => null)
}
