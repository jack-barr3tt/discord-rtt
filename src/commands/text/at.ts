import { Message } from "discord.js"
import { atCommon } from "../common/at.js"
import { error } from "../common/error.js"

export default async function At(message: Message<boolean>, args: string[]) {
  if (args.length != 1) {
    return await message.reply({
      embeds: [error("You must supply a valid three-letter CRS station code!")],
    })
  }

  const crsRegex = /^\w{3}$/
  if (!crsRegex.test(args[0])) {
    return await message.reply({
      embeds: [error("You must supply a valid three-letter CRS station code!")],
    })
  }

  try {
    const embed = await atCommon(args[0])

    await message.reply({ embeds: [embed] })
  } catch (err) {
    if (err.message === "unknown error occurred")
      return await message.reply({ embeds: [error("Invalid station!")] })

    console.error(err)
    return await message.reply({
      embeds: [error("There was an error trying to execute that command!")],
    })
  }
}
