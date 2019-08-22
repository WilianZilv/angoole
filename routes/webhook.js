const express = require('express')
const router = express.Router()
const Messenger = require('../services/messenger')
const postbackHandler = require('../handlers/postbackHandler')
const messageHandler = require('../handlers/messageHandler')
const browser = require('../services/browser')
const Sessions = require('../services/sessions')

const sessions = new Sessions()
Sessions.instance = sessions

router.get('/', async ({ query }, res) => {
    const mode = query['hub.mode']
    const token = query['hub.verify_token']
    const challenge = query['hub.challenge']

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

            const messenger = new Messenger(sender.id)

            if (sessions.start(sender.id)) {
                if (postback) {
                    postbackHandler(browser, messenger, postback)
                } else {
                    messageHandler(messenger, message)
                }
            }
        }
        res.status(200).send('EVENT_RECEIVED')
    } else {
        res.sendStatus(404)
    }
})

module.exports = app => app.use('/webhook', router)
