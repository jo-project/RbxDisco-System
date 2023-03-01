import { ChatInputCommandInteraction, Role, GuildMember, EmbedBuilder } from "discord.js";
import { CommandBuilder } from "discordbuilder.js";
import { Bot } from "../../structures/bot.js";
import AdminSchema from "../../models/data/admin.js";
import { AdminProvider } from "../../providers/admin.js";
import { EmbedService } from "../../services/embed.js";

const admins = new CommandBuilder()
.setName('admins')
.setDescription('Admin command')
.setLevel(3)
.setClass('Head Administrator')
.setCategory({
    name: 'Administration',
    emoji: '<:administration:1071160563813593109>'
})
.addSubcommand(opt => opt
    .setName('view')
    .setDescription('Lists all the admin(s) in the server')
    .setLevel(3)
)
.addSubcommand(opt => opt
    .setName('add')
    .setDescription('Add new role or member to an admin level')
    .setLevel(3)
    .addMentionableOption(opt => opt
        .setName('member_or_role')
        .setDescription('The member or role you wish to assign admin to.')
        .setRequired(true)
    )
    .addIntegerOption(opt => opt
        .setName('admin_level')
        .setDescription('The level of admin you wish to assign.')
        .setRequired(true)
        .setMinValue(2)
    )
)
.setCallback(
    async (client: Bot, interaction: ChatInputCommandInteraction) => {
        const { options } = interaction;
        const sub = options.getSubcommand()
        const adminSystem = new AdminProvider(interaction.guildId!)
        await adminSystem._initialize()
        if (sub === 'view') {
            await interaction.deferReply()
            const data = await  adminSystem.view()
            const succEmbed = new EmbedBuilder()
            .setTitle('Admin List')
            .setColor(0xffc21a)
            .addFields(data!.field_2, data!.field_3, data!.field_4, data!.field_5, data!.field_6)
            .setTimestamp()
            .setFooter({
                text: interaction.guild!.name,
                iconURL: interaction.guild!.iconURL({ extension: 'png' }) || ''
            })

            return interaction.editReply({ embeds: [succEmbed]})
        } else if (sub === 'add') {
            const role_or_member = options.getMentionable('member_or_role');
            var type: string = '';
            var id: string = ''
            if (role_or_member) {
                if (role_or_member instanceof Role) {
                    type = 'Role'
                    id = role_or_member.id
                } else if (role_or_member instanceof GuildMember) {
                    type = 'Member'
                    id = role_or_member.id
                }

                if (type !== '') {
                    await interaction.deferReply()
                    const level = options.getInteger('admin_level')
                    const added = {
                        type: type,
                        id: id
                    }
                    const res = await adminSystem.add(added.id, added.type, level!)
                    if (res) {
                        if (res.status === 404) {
                            const embedService = new EmbedService(interaction.guild!)
                            const errEmbed = await embedService.error(res.response.error!)

                            return interaction.editReply({ embeds: [errEmbed]})
                        } else if (res.status === 200) {
                            const succEmbed = new EmbedBuilder()
                            .setTitle('Success')
                            .setColor(0x198754)
                            .setDescription(res.response.success!)
                            .setTimestamp()
                            .setFooter({ text: interaction.guild!.name,  iconURL: interaction.guild!.iconURL({ size: 1024, extension: 'png' }) || ''})

                            return interaction.editReply({ embeds: [succEmbed]})
                        } else if (res.status === 503) {
                            const errEmbed = new EmbedBuilder()
                            .setTitle('Error')
                            .setColor(0xB12626)
                            .setDescription(res.response.error!)
                            .setTimestamp()
                            .setFooter({ text: interaction.guild!.name,  iconURL: interaction.guild!.iconURL({ size: 1024, extension: 'png' }) || ''})

                            return interaction.editReply({ embeds: [errEmbed]})
                        }
                    }
                }
            }
        }
    }
)

export default admins