import { GatewayIntentBits } from "discord.js"
import { config } from "dotenv"
import Upcoming from "./commands/text/between.js"
import { WMTClient } from "./client.js"
import { importCommands } from "./commands/slashCommands.js"

// Get environment variables from .env file
config()

const client = new WMTClient({
  intents: [
    // Intents needed to get messages in guilds
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

client.on("ready", async () => {
  console.log("Importing commands...")
  importCommands(client)

  console.log("Uploading commands...")
  await client.uploadCommands()

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

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  const { commandName } = interaction

  const command = client.commands.get(commandName)

  if (!command) return

  try {
    await command.execute(interaction)
  } catch (err) {
    console.error(err)
    await interaction.reply("There was an error trying to execute that command!")
  }
})

client.login(process.env.DISCORD_TOKEN)
