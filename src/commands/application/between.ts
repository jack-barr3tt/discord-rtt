import { AutocompleteInteraction, SlashCommandBuilder } from "discord.js"
import { betweenCommon } from "../common/between.js"
import { RTTStation } from "../../types.js"
import { stationAutocomplete } from "./autocomplete/station.js"
import { error } from "../common/error.js"

export const between = {
  name: "between",
  data: new SlashCommandBuilder()
    .setDescription("See the next 3 trains between two stations")
    .addStringOption((option) =>
      option
        .setName("origin")
        .setDescription("The station you will start your journey from")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName("destination")
        .setDescription("The station you will end your journey at")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  execute: async (interaction) => {
    const origin = interaction.options.getString("origin")
    const destination = interaction.options.getString("destination")

    try {
      const embed = await betweenCommon(origin, destination)

      await interaction.reply({ embeds: [embed] })
    } catch (err) {
      if (err.message === "unknown error occurred")
        return await interaction.reply({ embeds: [error("Invalid station(s)!")], ephemeral: true })

      console.error(err)
      return await interaction.reply({
        embeds: [error("There was an error trying to execute that command!")],
        ephemeral: true,
      })
    }
  },
  autocomplete: async (interaction: AutocompleteInteraction, stations: RTTStation[]) => {
    const focusedValue = interaction.options.getFocused().toLowerCase()

    try {
      await interaction.respond(stationAutocomplete(focusedValue, stations))
    } catch (err) {
      console.error(err)
    }
  },
}
