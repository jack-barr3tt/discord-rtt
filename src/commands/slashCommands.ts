import { WMTClient } from "../client.js"
import { at } from "./application/at.js"
import { between } from "./application/between.js"

export async function importCommands(client: WMTClient) {
  client.addCommand(between)
  client.addCommand(at)
}
