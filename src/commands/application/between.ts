import { SlashCommandBuilder } from "discord.js"
import { betweenCommon } from "../common/between.js"

export const between = {
  name: "between",
  data: new SlashCommandBuilder()
    .setDescription("See the next 3 trains between two stations")
    .addStringOption((option) =>
      option
        .setName("origin")
        .setDescription("The station you will start your journey from")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("destination")
        .setDescription("The station you will end your journey at")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const origin = interaction.options.getString("origin")
    const destination = interaction.options.getString("destination")

    try {
      const embed = await betweenCommon(origin, destination)

      await interaction.reply({ embeds: [embed] })
    } catch (err) {
      if (err.message === "unknown error occurred")
        return await interaction.reply("Invalid station(s)!")

      console.error(err)
      return await interaction.reply("There was an error trying to execute that command!")
    }
  },
}