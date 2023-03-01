import { ActivityType, ChatInputCommandInteraction } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import { EmbedService } from "../../services/embed.js";
import { EmbedBuilder } from "@discordjs/builders";
import { capitalizeFirstLetter } from "../../extensions/string.js";

const dev = new CommandBuilder()
.setName('dev')
.setDescription('Tools for developer')
.setClass('Developer')
.setLevel(4)
.setCategory({
    name: 'Developer',
    emoji: '<:dev:1071162053319991398>'
})
.addSubcommandGroup(options => options
    .setName('reload')
    .setDescription('Reload commands / events')
    .addSubcommand(option => option
        .setLevel(6)
        .setName('events')
        .setDescription('Reload events')
    )
    .addSubcommand(option => option
        .setLevel(6)
        .setName('commands')
        .setDescription('Reload commands')
    )
)
.addSubcommandGroup(options => options
    .setName('activity')
    .setDescription('Set bot activity')
    .addSubcommand(option => option
        .setName('presence')
        .setDescription('Set bot presence')
        .setLevel(3)
        .addStringOption(opt => opt
            .setName('type')
            .setDescription('Type of presence')
            .addChoices(
                {
                    name: 'Watching',
                    value: 'watching'
                },
                {
                    name: 'Playing',
                    value: 'playing'
                }
            )
            .setRequired(true)
        )
        .addStringOption(opt => opt
            .setName('name')
            .setDescription('Name of presence')
            .setRequired(true)
        )
    )
    .addSubcommand(option => option
        .setName('status')
        .setDescription('Set bot status')
        .setLevel(3)
        .addStringOption(opt => opt
            .setName('type')
            .setDescription('Type of presence')
            .addChoices(
                {
                    name: 'DND',
                    value: 'dnd'
                },
                {
                    name: 'Idle',
                    value: 'idle'
                },
                {
                    name: 'Invisible',
                    value: 'invisible'
                },
                {
                    name: 'Online',
                    value: 'online'
                }
            )
            .setRequired(true)
        )
    )
)
.setCallback(
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        await interaction.deferReply({ ephemeral: true })
        const { options, guild } = interaction;
        const embedService = new EmbedService(guild!)
        const subCommandGroup = options.getSubcommandGroup()
        if (subCommandGroup === 'reload') {
            const subCommand = options.getSubcommand()
            var succEmbed: EmbedBuilder | undefined
            if (subCommand === 'commands') {
                succEmbed = await embedService.success('Reloaded commands')
                const data = await client.reloadCommands()
            } else if (subCommand === 'events') {
                succEmbed = await embedService.success('Reloaded events')
                const data = await client.registerListeners()
            }

            if (succEmbed !== undefined) {
                return interaction.editReply({ embeds: [succEmbed]})
            }
        } else if (subCommandGroup === 'activity') {
            const subCommand = options.getSubcommand()
            if (subCommand === 'presence') {
                const type  = options.getString('type')
                const name = options.getString('name')
                if (type) {
                    var presenceType : number | undefined;
                    switch(type) {
                        case 'watching': {
                            presenceType = ActivityType.Watching
                            break;
                        }
                        case 'playing' : {
                            presenceType = ActivityType.Playing
                            break;
                        }
                    }

                    if (name && presenceType !== undefined) {
                        await client.setPresence({ activities: [{ name: name, type: presenceType }]})
                        const presenceTypeString = await capitalizeFirstLetter(type)
                        const embed = await embedService.success(`Changing bot presence to "${presenceTypeString} ${name}"`)
                        return interaction.editReply({ embeds: [embed]})
                    }

                    return interaction.editReply({})
                }
            } else if (subCommand === 'status') {
                const type  = options.getString('type')
                if (type) {
                    var statusTypeString: string = ''
                    switch(type) {
                        case 'dnd': {
                            await client.setStatus('dnd');
                            statusTypeString = 'DND'
                            break;
                        }
                        case 'idle': {
                            await client.setStatus('idle');
                            statusTypeString = 'Idle'
                            break;
                        }
                        case 'invisible': {
                            await client.setStatus('invisible');
                            statusTypeString = 'Invisible'
                            break;
                        }
                        case 'online': {
                            await client.setStatus('online');
                            statusTypeString = 'Online'
                            break;
                        }
                    }

                    const embed = await embedService.success(`Changing bot status to "${statusTypeString}"`)
                    return interaction.editReply({ embeds: [embed]})
                }
            }
        }
    }
)

export default dev