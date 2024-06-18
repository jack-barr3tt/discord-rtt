import {
  ApplicationCommandManager,
  ChatInputApplicationCommandData,
  Client,
  Collection,
  CommandInteraction,
  REST,
  RESTGetAPIApplicationGuildCommandsResult,
  Routes,
  SlashCommandBuilder,
} from "discord.js"
import { CommandConfig } from "./types.js"
import { config } from "dotenv"
import loadashpkg from "lodash"

const { isEqual } = loadashpkg

config()

export class WMTClient extends Client {
  commands: Collection<string, CommandConfig> = new Collection()

  addCommand(command: CommandConfig) {
    this.commands.set(command.name, { ...command, data: command.data.setName(command.name) })
  }

  private async uploadCommandType(guildId: string, commands: ChatInputApplicationCommandData[]) {
    console.log(`Uploading commands to guild ${guildId}`)

    const rest = new REST().setToken(this.token)

    const current = (await rest.get(
      Routes.applicationGuildCommands(this.user?.id || "", guildId)
    )) as RESTGetAPIApplicationGuildCommandsResult

    console.log(`Current there are ${current.length} commands`)

    const additions = commands.filter((cmd) => !current.find((c) => c.name === cmd.name))
    const removals = current.filter((cmd) => !commands.find((c) => c.name === cmd.name))
    const edits = commands
      .filter((cmd) => {
        const sameName = current.find((c) => c.name === cmd.name)
        if (!sameName) return false
        const sameProps = sameName.description === cmd.description

        const sameOptions = isEqual(sameName.options, cmd.options)
        return sameName && (!sameProps || !sameOptions)
      })
      .map((cmd) => {
        return {
          id: current.find((c) => c.name === cmd.name)?.id,
          name: cmd.name,
          description: cmd.description,
          options: cmd.options,
        }
      })

    console.log(`Additions: ${additions.length}`)
    console.log(`Removals: ${removals.length}`)
    console.log(`Edits: ${edits.length}`)

    if (additions.length + removals.length + edits.length > 3) {
      console.log("Bulk updating commands")
      await rest.put(Routes.applicationGuildCommands(this.user?.id || "", guildId), {
        body: commands,
      })
    } else {
      console.log("Individually updating commands")
      await Promise.all([
        ...additions.map((cmd) =>
          rest.post(Routes.applicationGuildCommands(this.user?.id || "", guildId), { body: cmd })
        ),
        ...removals.map((cmd) =>
          rest.delete(Routes.applicationGuildCommand(this.user?.id || "", guildId, cmd.id))
        ),
        ...edits.map((cmd) =>
          rest.patch(Routes.applicationGuildCommand(this.user?.id || "", guildId, cmd.id || ""), {
            body: cmd,
          })
        ),
      ])
    }
  }

  public async uploadCommands() {
    const guilds = JSON.parse(process.env.GUILDS || "[]") as string[]

    await Promise.all(
      guilds.map((id) =>
        this.uploadCommandType(
          id,
          this.commands.map((cmd) => cmd.data.toJSON()) as ChatInputApplicationCommandData[]
        )
      )
    )
  }
}
