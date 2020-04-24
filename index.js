require('dotenv').config();
const fs = require('fs');
const { Autohook } = require('twitter-autohook');
const oauth_token = process.env.TWITTER_ACCESS_TOKEN;
const oauth_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

(async ƛ => {
  const webhook = new Autohook({
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    env: process.env.TWITTER_WEBHOOK_ENV
  });
  
  // Removes existing webhooks
  await webhook.removeWebhooks();
  
  // Listens to incoming activity
  webhook.on('event', event => {
    console.log('Something happened:', event)
    if(event.tweet_create_events) {
      fs.appendFileSync('./tweetlog.txt', JSON.stringify(event) + '\n');
    }
  });
  
  // Starts a server and adds a new webhook
  await webhook.start();
  
  // Subscribes to a user's activity
  await webhook.subscribe({oauth_token, oauth_token_secret});
})();