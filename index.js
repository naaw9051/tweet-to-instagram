require('dotenv').config();
const fs = require('fs');
const { get } = require('request-promise');
const { Autohook } = require('twitter-autohook');
const { IgApiClient } = require('instagram-private-api');
const oauth_token = process.env.TWITTER_ACCESS_TOKEN;
const oauth_token_secret = process.env.TWITTER_ACCESS_TOKEN_SECRET;
const username = process.env.INSTAGRAM_USERNAME;
const password = process.env.INSTAGRAM_PASSWORD;

(async ƛ => {
  const webhook = new Autohook({
    token: process.env.TWITTER_ACCESS_TOKEN,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    env: process.env.TWITTER_WEBHOOK_ENV
  });
  
  const ig = new IgApiClient();

  // Removes existing webhooks
  await webhook.removeWebhooks();
  
  // Listens to incoming activity
  webhook.on('event', async (event) => {
    if(event.tweet_create_events) {
      fs.appendFileSync('./tweetlog.txt', JSON.stringify(event) + '\n');
      const tweet = event.tweet_create_events[0];
      const caption = removeUrlFromCaption(tweet.text);

      if (tweet.extended_entities.media) {
        let tweetPhotos = tweet.extended_entities.media;

        // login to instagram
        ig.state.generateDevice(username);
        await ig.account.login(username, password)
        .then((response) => {
          console.log('login successful', JSON.stringify(response));
        })
        .catch((err) => {
          console.error(err);
        });
        if (tweetPhotos.length === 1) {
          const bufferedImage = await get({
            url: 'https://picsum.photos/800/800', // TODO: repalce with tweet img url
            encoding: null,
          });

         await ig.publish.photo({
            caption: caption,
            file: bufferedImage,
          })
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.error(err);
          });
        } else if (tweetPhotos.length > 1) {
          let bufferedImages = await bufferPhotos(tweetPhotos);

          await ig.publish.album({
            caption: caption,
            items: bufferedImages
          })
          .then((response) => {
            console.log(response);
          })
          .catch((err) => {
            console.error(err);
          });
        }
        // logout from instagram
        await ig.account.logout()
        .then((response) => {
          console.log('logged out', JSON.stringify(response));
        })
        .catch((err) => {
          console.error(err);
        });
      }
    }
  });
  
  // Starts a server and adds a new webhook
  await webhook.start();
  
  // Subscribes to a user's activity
  await webhook.subscribe({oauth_token, oauth_token_secret});
})();

//                  H E L P E R

async function bufferPhotos(photoArray) {
  let images = [];
  for (let i = 0; i < photoArray.length; i++) {
    let photo = photoArray[i];
    let photoBuffer = await get({
      url: 'https://picsum.photos/800/800',
      // url: photo.media_url_https, // TODO: repalce with
      encoding: null,
    });

    images.push({
      file: photoBuffer
    })
  }
  return images;
}

async function removeUrlFromCaption(caption) {
  let linkIndex = caption.search('http');
  let linkString = caption.slice(linkIndex);
  let cutCaption = caption.replace(linkString, '');

  return cutCaption;
}
