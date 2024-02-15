import { differenceInMinutes, format } from "date-fns"
import { EmbedBuilder, Message } from "discord.js"
import { RTTClient } from "rttapi"

export default async function Upcoming(message: Message<boolean>, args: string[]) {
  // Realtime Trains API client
  const rttClient = new RTTClient(process.env.RTT_USERNAME, process.env.RTT_PASSWORD)

  // Get origin and destination stations
  const [origin, destination] = await Promise.all([
    rttClient.locations.between(args[0], args[1]),
    rttClient.locations.at(args[1]),
  ])

  // Currently does nothing because the API library has an issue
  // if (!origin || !destination) return await message.reply("Invalid station(s)!")

  // Use services at origin station to get detailed info about next 3 services
  const services = await Promise.all(
    origin.services
      .filter((_, i) => i < 3)
      .map(async (service) => await rttClient.service.get(service.id, service.runDate))
  )

  // Get info about when each service stops at the origin station
  const originStops = services.map((service) =>
    service.stops.find((stop) => stop.crs.toLowerCase() === args[0].toLowerCase())
  )

  const embed = new EmbedBuilder()
    .setTitle(`${origin.name} to ${destination.name}`)
    .setColor("#39bdb8")
    .setDescription(
      originStops
        .map((stop) => {
          // Trains at their origin won't have an arrival time, only a departure time
          const realtime = stop.realtimeArrival || stop.realtimeDeparture
          const booked = stop.bookedArrival || stop.bookedDeparture

          // How late the train is
          const lateness = !realtime || !booked ? 0 : differenceInMinutes(realtime, booked)

          // Format realtime departure
          const formattedTime = realtime ? format(realtime, "HH:mm") : "?"

          // Platform info
          const platformInfo = `Platform: ${stop.platform?.name || "?"}`

          // Return formatted string
          if (lateness < 0) return `:blue_circle: ${formattedTime} (${lateness}) ${platformInfo}`
          if (lateness > 0) return `:red_circle: ${formattedTime} (+${lateness}) ${platformInfo}`
          return `:green_circle: ${formattedTime} ${platformInfo}`
        })
        .join("\n")
    )

  await message.reply({ embeds: [embed] })
}
