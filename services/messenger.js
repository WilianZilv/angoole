const dotenv = require('dotenv')
const fetch = require('node-fetch')
dotenv.config()

const image = payload => ({
	attachment: {
		type: 'image',
		payload
	}
})
const template = (message, recipient_id) => ({
	method: 'POST',
	headers: { 'Content-Type': 'application/json' },
	body: JSON.stringify({
		message,
		recipient: {
			id: recipient_id
		}
	})
})

class Messenger {
	constructor(recipient) {
		this.recipient = recipient
		this.url = `https://graph.facebook.com/v4.0/me/messages?access_token=${
			process.env.PAGE_TOKEN
		}`
	}

	async send(text) {
		try {
			const r = await fetch(
				this.url,
				template(
					typeof text == 'object' ? text : { text },
					this.recipient
				)
			)
			return await r.json()
		} catch (err) {
			return null
		}
	}
	sendImage(path) {
		this.send(
			image({
				url: `${process.env.HOST}/${path}`,
				is_reusable: true
			})
		)
	}
}

module.exports = Messenger
