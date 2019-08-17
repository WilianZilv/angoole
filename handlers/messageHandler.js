const Messenger = require('../services/messenger')

module.exports = ({ recipient, message }) => {
	const messenger = new Messenger(recipient)

	if (message == 'image') {
		messenger.sendAttachment('lisa.png')
		return
	}

	messenger.send(`Oi, você me mandou: ${message}?`)
}
