const fetch = require('node-fetch')
const FormData = require('form-data')
const __publicdir = require('../public')
const fs = require('fs-jetpack')
const dotenv = require('dotenv')
dotenv.config()

const api = event =>
    `https://graph.facebook.com/v4.0/me/${event}?access_token=${
        process.env.PAGE_TOKEN
    }`
const message = (message, recipient_id) => ({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        message,
        recipient: {
            id: recipient_id
        }
    })
})
const attachment = (payload, type = 'image') => ({
    attachment: {
        type,
        payload
    }
})

class Messenger {
    constructor(recipient_id) {
        this.recipient_id = recipient_id
        this.messages = api('messages')
    }
    async send(text) {
        text = typeof text == 'object' ? text : { text }
        return await fetch(this.messages, message(text, this.recipient_id))
    }
    async sendButtons(text, buttons) {
        return await this.send(
            attachment(
                {
                    template_type: 'button',
                    text,
                    buttons
                },
                'template'
            )
        )
    }
    async sendFile(file, type = 'file', stream = null) {
        let body = new FormData()
        body.append('recipient', JSON.stringify({ id: this.recipient_id }))
        body.append('message', JSON.stringify(attachment({}, type)))
        body.append(
            'file',
            stream || fs.createReadStream(__publicdir + '/' + file)
        )
        return await fetch(this.messages, {
            method: 'POST',
            body
        })
    }
}

module.exports = Messenger
