# WheresMyTrain

Use the [Realtime Trains API](https://www.realtimetrains.co.uk/) from your Discord server!

# 👌 Features

## 📝 Text Commands

- `,t <origin> <destination>` - Get the next train between two stations using their [CRS codes](https://www.rail-record.co.uk/railway-location-codes)

## ✨ Slash Commands

- `/between <origin> <destination>` - Get the next train between two stations. Both fields have autocomplete, so you can use the station name or the CRS code - whatever you prefer!

# 💾 Setup Guide

1. Clone this repository
2. Install dependencies using `npm i` or `yarn`
3. Rename `.env.template` to `.env` and fill in the required fields as described in the comments
4. Use `npm run start` or `yarn start` to start the bot!
