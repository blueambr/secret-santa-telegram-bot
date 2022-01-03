# Secret Santa Telegram Bot 2.0.1

> "engines": { "node": "12.x" }

### Content

**[How to start](#how-to-start)**  
**[How to launch](#how-to-launch)**  
**[How to deploy](#how-to-deploy)**  
**[What can I edit](#what-can-i-edit)**  
**[Dependencies](#dependencies)**  
**[License](#license)**

## How to start

1. Sign Up / Log in to [Telegram](https://telegram.org/)
2. Write to [@BotFather](https://t.me/botfather)
3. `/start`
4. `/newbot`
5. Follow the instructions
6. Copy your token and store it **safely**, it can be used by anyone to control your bot

## How to launch

1. `git clone`
2. `git remote set-url origin https://github.com/USERNAME/REPOSITORY.git` to update the origin remote with your own repository / `git remote rm origin` to remove the origin remote
3. `npm i`
4. `process.env.TOKEN` inside `index.js` is your bot token. Do not store your token in public! Always store it as a **sensitive** information
5. `process.env.DB` inside `index.js` is your MongoDB access string. Do not store your acess string in public! Always store it as a **sensitive** information.
6. Create or import (e.g., from Google Sheets) `data.csv` file
7. Update bot messages, buttons and prompts as you wish, as well as edit csv output (data arrays are formed from `.csv` strings) in `index.js`
8. Update the database models in the `models` folder to match your data
9. `node index.js`

P.S. Don't forget to remove extra info like keywords, repository, etc. from `package.json`.

## How to deploy

I recommend to use [Heroku](https://devcenter.heroku.com/categories/nodejs-support). They have a great Documentation on Node.js and easy and accessible deploy approaches.

## What can I edit

You can edit whatever you want! You can add commands/conditions, remove commands/conditions, change the text of the messages etc. If you need more information on how this bot works, check [node-telegram-api-bot](https://github.com/yagop/node-telegram-bot-api).

## Dependencies

```
"dependencies": {
  "csvtojson": "^2.0.10",
  "express": "^4.17.1",
  "mongoose": "^5.10.14",
  "node-telegram-bot-api": "^0.50.0"
}
```

## License

Copyright © 2019 - 2022 Vlad Gerasimovich <hotepp@pm.me>

Licensed under the ISC license.
