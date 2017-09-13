# Haiku-bot

This is a haiku bot for a discord server.  Currently it just hangs out and waits for a message to contain 17 syllables in a message.  Once it sees a qualifying message it will return the message formatted as a haiku in a code block.

## Requirements

- node v8
- mongodb
- discord bot token
  - this means I assume you know how to connect your bot to channels etc.


## Installation

`npm i`

Next make sure your config is setup.

Create a `.env` file 

it should looks like this

```
DB_URI=mongodb://<USERNAME>:<PASSWORD>@url/db
DISCORD_TOKEN=token
```

If you don't want to setup a mongodb just comment out the mongo parts for now shouldn't be hard.

Next run 

`npm run dev`

This will start a server on port 8080 listening for messages from whatever channels your bot is currently in.

## Tests

`npm test`

## Deployment

Using heroku at the moment seems easy enough, but should be able to host it wherever you want.