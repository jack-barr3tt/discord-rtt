import { SlashCommandBuilder, CommandInteraction } from "discord.js"

export type CommandConfig = {
  name: string
  data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
  execute: (interaction: CommandInteraction) => Promise<void>
}
