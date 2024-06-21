import { Message } from "discord.js"
import { betweenCommon } from "../common/between.js"
import { error } from "../common/error.js"

export default async function Upcoming(message: Message<boolean>, args: string[]) {
  if (args.length != 2) {
    return await message.reply({
      embeds: [error("You must supply a pair of valid three-letter CRS station codes!")],
    })
  }

  const crsRegex = /^\w{3}$/
  if (!crsRegex.test(args[0]) || !crsRegex.test(args[1])) {
    return await message.reply({
      embeds: [error("You must supply a pair of valid three-letter CRS station codes!")],
    })
  }

  try {
    const embed = await betweenCommon(args[0], args[1])

    await message.reply({ embeds: [embed] })
  } catch (err) {
    if (err.message === "unknown error occurred")
      return await message.reply({ embeds: [error("Invalid station(s)!")] })

    console.error(err)
    return await message.reply({
      embeds: [error("There was an error trying to execute that command!")],
    })
  }
}
