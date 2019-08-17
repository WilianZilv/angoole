const Messenger = require('../services/messenger')

const messages = ({ recipient, message }) => {
	const messenger = new Messenger(recipient)

	if (message == 'image') {
		messenger.sendImage('lisa.png')
		return
	}

	messenger.send(`Oi, você me mandou: ${message}?`)
}
module.exports = messages
