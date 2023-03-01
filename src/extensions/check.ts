const discordLinkRegex = /^https?:\/\/(www\.)?discord(?:app)?\.com\/channels\/(\d{17,19})\/(\d{17,19})\/(\d{17,19})$/;

const discordIdRegex = /^(\d{17,19})$/;

function isDiscordLink(input: string): boolean {
  return discordLinkRegex.test(input);
}

function isDiscordId(input: string): boolean {
  return discordIdRegex.test(input);
}

export function getDiscordMessageInfo(input: string): {  channelId?: string; messageId?: string } {
    if (isDiscordLink(input)) {
      const match = discordLinkRegex.exec(input);
      if (match !== null) {
        const [, channelId, messageId] = match.slice(2);
        return { channelId, messageId };
      } else {
        throw new Error("Invalid Discord link");
      }
    } else if (isDiscordId(input)) {
      return { channelId: `1080557241800867880`, messageId: input };
    } else {
      throw new Error("Invalid Discord link or ID");
    }
  }