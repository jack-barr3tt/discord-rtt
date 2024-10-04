import { differenceInMinutes, format } from "date-fns"
import { EmbedBuilder } from "discord.js"
import { RTTClient } from "rttapi"
import tocEmoji from "./emojis.js"

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

          // Realtime Trains website link
          const rttLink = `https://www.realtimetrains.co.uk/service/gb-nr:${
            service.serviceUid
          }/${format(booked, "yyyy-MM-dd")}`

          // Platform info
          const platformInfo = stop.platform ? `- Platform: ${stop.platform}` : ""

          // Destination info
          const destinationInfo = service.destination.map((d) => d.description).join(" & ")

          // Operator emoji
          const operatorInfo = tocEmoji(service.atocCode) ? `${tocEmoji(service.atocCode)} ` : ""

          // Return formatted string
          if (lateness < 0)
            return `${operatorInfo}:blue_circle: [${formattedTime}](${rttLink}) (${lateness}) ${destinationInfo} ${platformInfo}`
          if (lateness > 0)
            return `${operatorInfo}:red_circle: [${formattedTime}](${rttLink}) (+${lateness})  ${destinationInfo} ${platformInfo}`
          return `${operatorInfo}:green_circle: [${formattedTime}](${rttLink}) ${destinationInfo} ${platformInfo}`
        })
        .join("\n")
    )
}
