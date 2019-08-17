const express = require('express')
const router = express.Router()
const messageHandler = require('../handlers/messageHandler')
const dotenv = require('dotenv')
dotenv.config()

router.get('/', async ({ query }, res) => {
	let mode = query['hub.mode']
	let token = query['hub.verify_token']
	let challenge = query['hub.challenge']

	if (mode && token) {
		if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
			res.status(200).send(challenge)
		} else {
			res.sendStatus(403)
		}
	}
})

router.post('/', ({ body }, res) => {
	const { object, entry: entries } = body

	if (object === 'page') {
		for (const entry of entries) {
			const { sender, message, postback } = entry.messaging[0]
			if (postback) {
				messageHandler(
					{ recipient: sender.id, message: postback },
					true
				)
			} else {
				messageHandler({ recipient: sender.id, message: message.text })
			}
		}
		res.status(200).send('EVENT_RECEIVED')
	} else {
		res.sendStatus(404)
	}
})

module.exports = app => app.use('/webhook', router)
