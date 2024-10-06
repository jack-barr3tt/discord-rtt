import { Message } from "discord.js"
import { helpCommon } from "../common/help.js"

export default async function At(message: Message<boolean>) {
  message.reply({
    embeds: [helpCommon()],
  })
}
