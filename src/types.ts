import { SlashCommandBuilder, CommandInteraction, AutocompleteInteraction } from "discord.js"

export type CommandConfig = {
  name: string
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  execute: (interaction: CommandInteraction) => Promise<void>,
  autocomplete?: (interaction: AutocompleteInteraction, stations: RTTStation[]) => Promise<void>,
}

export type RTTStation = {
  description: string
  crs: string
}