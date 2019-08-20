# Angoole

Angoole is a Facebook Messenger bot that reads the messages, search it on Google search and output back the results for the user.

## Configuration steps

### Project folder
We need to make a small change in the project folder to continue the process.

#### .env
First, rename the **.template.env** to **.env**

#### Verify Token
To facebook start using the bot, we need to generate a token for the bot, i used https://randomkeygen.com/ to generate mine, so get a token for you, copy it, open the **.env** and overwrite the <code>VERIFY_TOKEN=<YOUR_RANDOM_TOKEN_GENERATED_BY_YOU></code> with your token.

### Facebook
To make it work, we need a Facebook page, so go there and create it. Next, we need to create a Facebook App, go to https://developers.facebook.com/ (create an account if you don't have one).
Go to <code>My Apps > Create App</code> and follow the steps shown.
Once you land on the app page, go to Products and click on **configure** in the Messenger product.


#### Access Tokens
Inside this block, we need to add our page to get the page access token so we can send messages using the Messenger Api.
Click on **Add or remove pages**, log in, select your page and follow the shown steps. Your page will be displayed in the list and next to it there will be a **Generate Token**, click on it and copy your page token. Next, open the **.env** and overwrite the <code>PAGE_TOKEN=<YOUR_PAGE_TOKEN></code> with your token.

#### Webhooks

To configure webhooks, we first need to run our app, you can either run it with
<code>$ npm start</code> or

<code>$ docker-compose up</code>(recommended)

##### Without Docker Compose
Run <code>npm install</code> and then <code>npm start</code>

##### With Docker Compose
Just run <code>$ docker-compose up</code>

Now bot is running locally, we need to make it accessible in the internet, you can use a server or openning your ports, in my case i use **ngrok** to generate a public address to access my local service.

Once you get it running publicly, add your URL. Ex: **https://myurl.com/webhook**
And paste your **Verify Token**, hit **verify and save**. Now click on **Add signatures** and select ***messages*** and ***messages_postbacks***, hit save and you are done! The bot is working for developers and testers. Go there and send a message to the bot!

***I will not cover the process to make it public for everyone***
