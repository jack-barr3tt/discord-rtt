import { Client, GatewayIntentBits } from "discord.js"
import { config } from "dotenv"
import Upcoming from "./commands/upcoming.js"

// Get environment variables from .env file
config()

const client = new Client({
  intents: [
    // Intents needed to get messages in guilds
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.on("ready", () => {
  console.log("Ready!")
})

client.on("messageCreate", async (message) => {
  // Using comma as prefix
  const PREFIX = ","
  if (!message.content.startsWith(PREFIX)) return

  const [CMD_NAME, ...args] = message.content.trim().substring(PREFIX.length).split(/\s+/)

  try {
    switch (CMD_NAME) {
      case "t":
        await Upcoming(message, args)
        break
    }
  } catch (err) {
    console.error(err)
    await message.reply("There was an error trying to execute that command!")
  }
})

client.login(process.env.DISCORD_TOKEN)
