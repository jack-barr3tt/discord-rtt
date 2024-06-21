import { EmbedBuilder } from "discord.js"

export function error(message: string) {
  return new EmbedBuilder().setColor("#ff0000").setDescription(message)
}
