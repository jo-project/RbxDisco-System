import { Message, EmbedBuilder, WebhookClient, TextChannel } from "discord.js";
import { EventBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";


const regex = /\[`(.*)`\]\((.*)\) (.*) - (.*)/;
const another_regex = /^\[(.*):(.*)\] (.*)$/;

const message = new EventBuilder(false)
.setName('messageCreate')
.setCallback(
    async(client: Bot, message: Message) => {
        if (message.channelId === `1080544269011529808`) {
            console.log(message.content)
            const postEmbed = message.embeds[0]
            const str = postEmbed.description!;
            const titleStr = postEmbed.title!;

            const matches = str.match(regex);
            const matches_1 = titleStr.match(another_regex)

            if (matches_1) {
                const repoName = matches_1[1];
                const branch = matches_1[2];
                const type = matches_1[3];

                if (matches) {
                    const id = matches[1];
                    const link = matches[2];
                    const msg = matches[3];
                    const author = matches[4];

                    const webhook = new WebhookClient({ id: `1080636459247218698`, token: `h8xoRBD1nIXu7zPYkTz2AReocE6wVnUoeI6SwBjcev0TiKRx7-NHO1Cre9WJDvDCSA7T`})

                    const embedBuilder = new EmbedBuilder()
                    .setAuthor({
                        name: postEmbed.author!.name,
                        iconURL: postEmbed.author!.iconURL || ''
                    })
                    .setTitle(`${repoName} on branch ${branch}`)
                    .setURL(postEmbed.url)
                    .setColor(postEmbed.color)
                    .setDescription(`**${type}**`)
                    .addFields(
                        {
                            name: 'Committer',
                            value: `${author.replace('\\', '')}`
                        },
                        {
                            name: 'ID',
                            value: id
                        },
                        {
                            name: 'Link',
                            value: link
                        },
                        {
                            name: 'Message',
                            value: msg
                        }
                    )
                    .setTimestamp()
                    .setFooter({
                        text: `${message.guild!.name} - GitHub`,
                        iconURL: message.guild!.iconURL({ extension: 'png' }) || ''
                    })

                    await webhook.send({
                        embeds: [embedBuilder]
                    })
                }
            }
        }
    }
)

export default message