import { readFileSync } from "fs"

function loadEmojiConfig() {
  try {
    const data = readFileSync("./toc_emojis.json", "utf8")
    const jsonData = JSON.parse(data)
    return jsonData
  } catch {
    return {}
  }
}

const emojis = loadEmojiConfig()

export default function tocEmoji(atocCode: string) {
  return atocCode in emojis ? emojis[atocCode] : null
}
