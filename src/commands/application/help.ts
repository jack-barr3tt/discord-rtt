import { SlashCommandBuilder } from "discord.js"
import { helpCommon } from "../common/help.js"

export const help = {
  name: "help",
  data: new SlashCommandBuilder().setDescription("Get help with using the bot"),
  execute: async (interaction) => interaction.reply({ embeds: [helpCommon()] }),
}
