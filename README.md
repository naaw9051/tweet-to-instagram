# Tweet-To-Instagram

## Installation

Run `npm i`.

To protect your secrets, like your Twitter-APIKEYS, it's best to configure them in environment variables with an `.env` file.
Just create a file named `.env` and add your token:

```yaml
TWITTER_ACCESS_TOKEN=REPLACE_WITH_YOUR_TOKEN
TWITTER_ACCESS_TOKEN_SECRET=REPLACE_WITH_YOUR_TOKEN
TWITTER_CONSUMER_KEY=REPLACE_WITH_YOUR_TOKEN
TWITTER_CONSUMER_SECRET=REPLACE_WITH_YOUR_TOKEN
TWITTER_WEBHOOK_ENV=REPLACE_WITH_YOUR_TOKEN

INSTAGRAM_USERNAME=REPLACE_WITH_YOUR_USERNAME
INSTAGRAM_PASSWORD=REPLACE_WITH_YOUR_PASSWORD
```

For more env configurations, please check the respective libraries:

[Twitter API](https://www.npmjs.com/package/twitter-autohook)

[Instagram API](https://www.npmjs.com/package/instagram-private-api)

Setup complete!

## Usage

Start bot

```cmd
npm run start
```

Start bot with automatic reloads on save

```cmd
npm run dev
```
