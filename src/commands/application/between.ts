import { AutocompleteInteraction, SlashCommandBuilder } from "discord.js"
import { betweenCommon } from "../common/between.js"
import { RTTStation } from "../../types.js"

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
        return await interaction.reply("Invalid station(s)!")

      console.error(err)
      return await interaction.reply("There was an error trying to execute that command!")
    }
  },
  autocomplete: async (interaction: AutocompleteInteraction, stations: RTTStation[]) => {
    const focusedValue = interaction.options.getFocused().toLowerCase()

    const descStartsWith = stations.filter((station) =>
      station.description.toLowerCase().startsWith(focusedValue)
    )
    const crsStartsWith =
      focusedValue.length > 3
        ? []
        : stations.filter((station) => station.crs.toLowerCase().startsWith(focusedValue))

    const options = Array.from(
      new Set(
        focusedValue.length === 3
          ? [...crsStartsWith, ...descStartsWith]
          : [...descStartsWith, ...crsStartsWith]
      )
    )

    await interaction.respond(
      options
        .map((station) => ({
          name: `${station.description} (${station.crs.toUpperCase()})`,
          value: station.crs,
        }))
        .slice(0, 25)
    )
  },
}
