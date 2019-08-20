const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const app = express()

app.use(express.static('public'))
app.use(express.json())

require('./routes/webhook')(app)

app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))
app.listen(80)
