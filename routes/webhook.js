const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()
const messages = require('../controllers/messages')

router.get('/', async (req, res) => {
	let mode = req.query['hub.mode']
	let token = req.query['hub.verify_token']
	let challenge = req.query['hub.challenge']

	if (mode && token) {
		if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
			res.status(200).send(challenge)
		} else {
			res.sendStatus(403)
		}
	}
})

router.post('/', (req, res) => {
	const { object, entry } = req.body

	if (object === 'page') {
		entry.forEach(function(entry) {
			const { sender, message } = entry.messaging[0]
			messages({ recipient: sender.id, message: message.text })
		})
		res.status(200).send('EVENT_RECEIVED')
	} else {
		res.sendStatus(404)
	}
})

module.exports = app => app.use('/webhook', router)
