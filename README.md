# Secret Santa Telegram Bot 1.0.0

> "engines": { "node": "12.x" }

### Content

**[How to start](#how-to-start)**  
**[How to launch](#how-to-launch)**  
**[How to deploy](#how-to-deploy)**  
**[What can I edit](#what-can-i-edit)**  
**[Dependencies](#dependencies)**  
**[License](#license)**

## How to start:
1. Sign Up / Log in to [Telegram](https://telegram.org/)
2. Write to [@BotFather](https://t.me/botfather)
1. `/start`
2. `/newbot`
3. Follow the instructions
3. Copy your token and store it **safely**, it can be used by anyone to control your bot

## How to launch:
1. `git clone`
2. `git remote set-url origin https://github.com/USERNAME/REPOSITORY.git` to update the origin remote with your own repository / `git remote rm origin` to remove the origin remote
3. `yarn` / `npm i`
4. `process.env.TOKEN` inside `index.js` is your token. Do not store your token in public! Always store it as a **sensitive** information
5. `node index.js`
   
P.S. Don't forget to remove extra info like keywords, repository, etc. from `package.json`.

## How to deploy
I recommend to use [Heroku](https://devcenter.heroku.com/categories/nodejs-support). They have a great Documentation on Node.js and easy and accessible deploy approaches.

## What can I edit
You can edit whatever you want! You can add commands/conditions, remove commands/conditions, change the text of the messages, etc. If you need more information on how this bot works, check [node-telegram-api-bot](https://github.com/yagop/node-telegram-bot-api).

## Dependencies

```
"dependencies": {
  "csvtojson": "^2.0.10",
  "express": "^4.17.1",
  "node-telegram-bot-api": "^0.40.0"
}
```

## License

Copyright © 2019

Licensed under the MIT license.