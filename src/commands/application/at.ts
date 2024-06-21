import { AutocompleteInteraction, SlashCommandBuilder } from "discord.js"
import { RTTStation } from "../../types.js"
import { stationAutocomplete } from "./autocomplete/station.js"
import { atCommon } from "../common/at.js"
import { error } from "../common/error.js"

export const at = {
  name: "at",
  data: new SlashCommandBuilder()
    .setDescription("See upcoming departures at a station")
    .addStringOption((option) =>
      option
        .setName("station")
        .setDescription("The station to see upcoming departures for")
        .setRequired(true)
        .setAutocomplete(true)
    ),
  execute: async (interaction) => {
    const station = interaction.options.getString("station")

    try {
      const embed = await atCommon(station)

      await interaction.reply({ embeds: [embed] })
    } catch (err) {
      if (err.message === "unknown error occurred")
        return await interaction.reply({ embeds: [error("Invalid station!")] })

      console.error(err)
      return await interaction.reply({
        embeds: [error("There was an error trying to execute that command!")],
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
