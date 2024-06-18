import { differenceInMinutes, format } from "date-fns"
import { EmbedBuilder } from "discord.js"
import { RTTClient } from "rttapi"

export async function atCommon(stationCRS: string) {
  // Realtime Trains API client
  const rttClient = new RTTClient(process.env.RTT_USERNAME, process.env.RTT_PASSWORD)

  // Get station
  const station = await rttClient.locations.at(stationCRS)

  // Use services at origin station to get detailed info about next 3 services
  const services = await Promise.all(
    station.services
      .filter((_, i) => i < 5)
      .map(async (service) => await rttClient.service.get(service.serviceUid, service.runDate))
  )

  return new EmbedBuilder()
    .setTitle(`Next trains from ${station.location.name}`)
    .setColor("#39bdb8")
    .setDescription(
      services
        .map((service) => {
          const stop = service.locations.find(
            (stop) => stop.crs.toLowerCase() === stationCRS.toLowerCase()
          )

          // Trains at their origin won't have an arrival time, only a departure time
          const realtime = stop.realtimeArrival || stop.realtimeDeparture
          const booked = stop.gbttBookedArrival || stop.gbttBookedDeparture

          // How late the train is
          const lateness = !realtime || !booked ? 0 : differenceInMinutes(realtime, booked)

          // Format realtime departure
          const formattedTime = realtime ? format(realtime, "HH:mm") : format(booked, "HH:mm")

          // Platform info
          const platformInfo = stop.platform ? `- Platform: ${stop.platform}` : ""

          const destinationInfo = service.destination.map((d) => d.description).join(" & ")

          // Return formatted string
          if (lateness < 0)
            return `:blue_circle: ${formattedTime} (${lateness}) ${destinationInfo} ${platformInfo}`
          if (lateness > 0)
            return `:red_circle: ${formattedTime} (+${lateness})  ${destinationInfo} ${platformInfo}`
          return `:green_circle: ${formattedTime} ${destinationInfo} ${platformInfo}`
        })
        .join("\n")
    )
}
