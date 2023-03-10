<center><img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=RbxDisco-System&fontSize=80&fontAlignY=35&animation=twinkling&fontColor=gradient" /></center>
<br>
<h2 align="center">Our System Bot</h2>
<h4 align="center">High Quality Multipurpose Bot with 100+ Slash Commands Support and more for FREE!</h4>
<p align="center">
<br />
<br />
<br />

[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/jo-project/RbxDisco-System">
    <img src="https://cdn.discordapp.com/attachments/1072938695956643920/1080604791069220874/Logo.png" alt="rbxdisco-plus" width="200" height="200">
  </a>

  <h3 align="center">rbxdisco-system</h3>

  <p align="center">
    RbxDisco-System is a powerful multi functionality Bot
    <br />
    <br />
    <a href="https://discord.com/api/oauth2/authorize?client_id=1070643822041772035&permissions=8&scope=bot">Invite Bot (Coming Soon)</a>
    ยท
    <a href="https://github.com/jo-project/RbxDisco-System/issues">Report Bug</a>
    ยท
    <a href="https://github.com/jo-project/RbxDisco-System/issues">Request Feature</a>
  </p>
</p>

## ๐ญ Features

- โ Setup System
- โ Moderation
- โ 24/7
- โ SlashCommand
- โ Filters
- โ Easy to use
- โ And much more!

## ๐ Requirements

- [Nodejs](https://nodejs.org/en/) v18 and more
- [Discord.js](https://github.com/discordjs/discord.js/) v14

### ๐ Main

- Discord bot's
  token `You should know why you need this or you won't go to this repo` [Get or create bot here](https://discord.com/developers/applications)
- Mongodb
  URI `for custom prefix` [MongoDB](https://account.mongodb.com/account/login)
- Your ID `for eval command. It's dangerous if eval accessible to everyone`
- OpenWeather API `for weather support` [Click here to get](https://openweathermap.org/home/sign_in)
- TimezoneDB Key `for timezone support` [Click here to get](https://timezonedb.com/)

<!-- INSTALL -->

```yaml
TOKEN: "put your bot token"
MONGO_DB: "put your mongo db url"
WEATHER_KEY: "your openweather api"
TIMEZONE_KEY: "your timezonedb key"
GITHUB_KEY: "your github key" (optional)
OWNER_ID: "your discord id"
```

Put that on .env file or you can copy .env.example and change it to .env

After that, you only need to type on the terminal

```bash
npm run build
```

Do note that the bot need to be restart manually unless you're using nodemon!

## ๐ Installation from source

```bash
git clone https://github.com/jo-project/rbxdiscord-system
```

After cloning, run

```bash
npm install
```

- Start the bot with `npm run build`

to snag all of the dependencies. Of course, you need [node](https://nodejs.org/en/) installed. I also strongly recommend [nodemon](https://www.npmjs.com/package/nodemon) as it makes testing _much_ easier.

## Intents

<p align="center">
  <a href="https://github.com/jo-project/rbxdiscord-system">
    <img src="https://media.discordapp.net/attachments/848492641585725450/894114853382410260/unknown.png">

  </a>
</p>
When you are running the Code you must have gotten this Error. To fix this head over to your Bot's Discord Application and go to the Bot Settings and find this:

<p align="center">
  <a href="https://github.com/jo-project/rbxdiscord-system">
    <img src="https://user-images.githubusercontent.com/50886682/196232974-d9cfc18c-92c5-43bd-b1bc-ff1cae3df701.png">

  </a>
</p>
Then turn on both of those Settings and click "Save Changes". Then you are done and it should be fixed!
<!-- CONFIGURATION -->

## โ๏ธ Configurations

- edit src/config/data.config.ts and don't forget to fill it on .env

```js
  token: process.env.TOKEN || "", // your bot token
  mongoDB: process.env.MONGO_DB || "", // MongoDB URL
  weatherKey: process.env.WEATHER_KEY || "", // OpenWeather API Key
  timezoneKey: process.env.TIMEZONE_KEY || "" // TimezoneDB Key
  githubKey: process.env.GITHUB_KEY || "", // Github Key
  ownerId: process.env.OWNER_ID || "", // Owner ID
```

## โ๏ธ SHARDS

- edit in `src/index.ts`

```js
  totalShards: number || 'auto',
  shardsPerClusters: number,
  totalClusters: number || 'auto',
  mode: 'process' || 'worker',
  token: process.env.TOKEN! || 'botToken',
```

<!-- ABOUT THE PROJECT -->

## ๐ About
Coming Soon

## ๐ Support Server
Coming Soon

# Donate

By donating, you will help me to maintain this Project!

<!-- LICENSE -->

## ๐ License

Distributed under the Apache-2.0 license License. See [`LICENSE`](https://github.com/jo-project/rbxdisco-system/blob/main/LICENSE) for more information.

[version-shield]: https://img.shields.io/github/package-json/v/brblacky/lavamusic?style=for-the-badge
[version-url]: https://github.com/brblacky/lavamusic
[contributors-shield]: https://img.shields.io/github/contributors/brblacky/lavamusic.svg?style=for-the-badge
[contributors-url]: https://github.com/brblacky/lavamusic/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/brblacky/lavamusic.svg?style=for-the-badge
[forks-url]: https://github.com/brblacky/lavamusic/network/members
[stars-shield]: https://img.shields.io/github/stars/brblacky/lavamusic.svg?style=for-the-badge
[stars-url]: https://github.com/brblacky/lavamusic/stargazers
[issues-shield]: https://img.shields.io/github/issues/brblacky/lavamusic.svg?style=for-the-badge
[issues-url]: https://github.com/brblacky/lavamusic/issues
[license-shield]: https://img.shields.io/github/license/brblacky/lavamusic.svg?style=for-the-badge
[license-url]: https://github.com/brblacky/lavamusic/blob/master/LICENSE
[spon-img]: https://media.discordapp.net/attachments/979364157541462066/982734017671606322/Vultr_Logo_Download_Vector.png