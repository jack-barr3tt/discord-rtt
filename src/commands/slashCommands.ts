import { WMTClient } from "../client.js"
import { between } from "./application/between.js"

export async function importCommands(client: WMTClient) {
  client.addCommand(between)
}
