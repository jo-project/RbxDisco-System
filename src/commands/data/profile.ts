import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

import { EmbedService } from "../../services/embed.js";
import { Bot } from "../../structures/bot.js";
import { CommandBuilder } from "discordbuilder.js";
import ProfileSchema from '../../models/data/profile.js'

const profile = new CommandBuilder()
.setName('profile')
.setDescription('Command for custom user profile')
.setClass('Member')
.setLevel(1)
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.addSubcommand(option => option
    .setName('edit')
    .setLevel(1)
    .setDescription('Edit your custom profile (Default: null)')
    .addStringOption(opt => opt
        .setName('id')
        .setDescription('ID for your custom profile')
        .setRequired(true)
    )
    .addStringOption(opt => opt
        .setName('name')
        .setDescription('Name for your custom profile')
        .setRequired(true)
    )
)
.addSubcommand(option => option
    .setName('update')
    .setLevel(1)
    .setDescription('Update your custom profile on the server')
)
.setCallback(
    async (client : Bot, interaction: ChatInputCommandInteraction) => {
        const { options, user, guild } = interaction;
        const subCommand = options.getSubcommand();
        const embedService = new EmbedService(guild!)
        await interaction.deferReply({ ephemeral: true })
        if (subCommand === 'edit') {
            const custom_id = options.getString('id')
            const custom_name = options.getString('name')
            const user_data = await ProfileSchema.findOne({ _id: guild!.id, user: user.id }) || new ProfileSchema({
                _id: guild!.id,
                user: user.id
            })

            user_data.custom_id = custom_id!
            user_data.name = custom_name!
            user_data.save()
            console.log(user_data.custom_id, user_data.name)
        } else if (subCommand === 'update') {
            const user_data = await ProfileSchema.findOne({ _id: guild!.id, user: user.id })
            if (user_data) {
                const member = guild!.members.cache.get(user.id)
                member!.setNickname(`${user_data.custom_id} - ${user_data.name}`)
            }
        }
    }
)

export default profile