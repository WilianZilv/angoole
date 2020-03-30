const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs-jetpack");
const Sessions = require("./sessions");

const api = event =>
    `https://graph.facebook.com/v4.0/me/${event}?access_token=${process.env.PAGE_TOKEN}`;
const message = (message, recipient_id) => ({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        message,
        recipient: {
            id: recipient_id
        }
    })
});
const attachment = (payload, type = "image") => ({
    attachment: {
        type,
        payload
    }
});

class Messenger {
    constructor(recipient_id) {
        this.recipient_id = recipient_id;
        this.messages = api("messages");
    }
    async send(text, finish = false) {
        text = typeof text == "object" ? text : { text };
        const res = await fetch(
            this.messages,
            message(text, this.recipient_id)
        ).catch(err => console.log("Messenger <ERROR>:", err));
        console.log("Messenger <SUCCESS>:", text);

        res.json()
            .then(data => console.log("Facebook <RESPONSE>:", data))
            .catch(err => console.log("Facebook <ERROR>:", err));

        if (finish) this.finishSession();
    }
    async sendButtons(text, buttons) {
        return await this.send(
            attachment(
                {
                    template_type: "button",
                    text,
                    buttons
                },
                "template"
            )
        );
    }
    async sendFile(path, type = "file", finish = false) {
        let body = new FormData();
        body.append("recipient", JSON.stringify({ id: this.recipient_id }));
        body.append("message", JSON.stringify(attachment({}, type)));
        body.append("file", fs.createReadStream(path));

        await fetch(this.messages, {
            method: "POST",
            body
        }).catch(err => {
            throw new Error(err);
        });
        if (finish) this.finishSession();
    }
    finishSession() {
        Sessions.instance.finish(this.recipient_id);
    }
}

module.exports = Messenger;
