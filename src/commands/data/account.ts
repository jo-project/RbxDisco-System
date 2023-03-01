import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

import { EmbedService } from "../../services/embed.js";
import { Bot } from "../../structures/bot.js";
import { AccountProvider } from "../../providers/account.js";
import { CommandBuilder } from "discordbuilder.js";
import { AdminProvider } from "../../providers/admin.js";

const account = new CommandBuilder()
.setName('account')
.setDescription('Command for account system')
.setClass('Member')
.setLevel(1)
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.addSubcommand(option => option
    .setName('check')
    .setLevel(1)
    .setDescription('Check your account information')
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to check (Admin only)')
        .setRequired(false)
    )
)
.addSubcommand(option => option
    .setName('login')
    .setLevel(1)
    .setDescription('Login to your account')
    .addStringOption(opt => opt
        .setName('username')
        .setDescription('Account username')
        .setRequired(true)
    )
    .addStringOption(opt => opt
        .setName('password')
        .setDescription('Account password')
        .setRequired(true)
    )
)
.setCallback(
    async (client : Bot, interaction: ChatInputCommandInteraction) => {
        const { options, user, guild } = interaction;
        const subCommand = options.getSubcommand();
        const embedService = new EmbedService(guild!)
        await interaction.deferReply({ ephemeral: true })
        if (subCommand === 'check') {
            const userTarget = options.getUser('user') || user;
            const userMember = guild!.members.cache.get(userTarget.id)

            if (userMember) {
                const accountProvider = new AccountProvider(userMember)
                const adminProvider = new AdminProvider(guild!.id)
                await adminProvider._initialize()

                const checkLevel = await adminProvider.check(interaction.user.id, 4)
                if (checkLevel) {
                    if (userTarget.id !== user.id && checkLevel.status === 404) {
                        const errEmbed = new EmbedBuilder()
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.avatarURL({ extension: 'png'}) || `https://external-preview.redd.it/4PE-nlL_PdMD5PrFNLnjurHQ1QKPnCvg368LTDnfM-M.png?auto=webp&s=ff4c3fbc1cce1a1856cff36b5d2a40a6d02cc1c3`
                        })
                        .setTitle('Warning - Insufficient Permission')
                        .setColor(0xB12626)
                        .setDescription(`The \`user\` option of this command is limited to the admin level **7**!`)
                        .setTimestamp()
                        .setFooter({ text: interaction.guild!.name,  iconURL: interaction.guild!.iconURL({ size: 1024, extension: 'png' }) || ''})
    
                        return interaction.editReply({ embeds: [errEmbed] })
                    }
                }

                const res = await accountProvider.check()
                if (res.status === 200) {
                    const data = res.response
                    var sendEmbed: EmbedBuilder | undefined;
                    if (data) {
                        if (!data.username && !data.password) {
                            sendEmbed = await embedService.error(`${userTarget.id !== user.id ? `${userTarget.tag} does` : `You do`} not have any account.`)
                        } else {
                            sendEmbed = await embedService.successField(
                                {
                                    name: 'Username',
                                    value: data.username
                                },
                                {
                                    name: 'Password',
                                    value: data.password
                                },
                                {
                                    name: 'Status',
                                    value: data.is_login === false ? 'Logged out' : 'Logged in'
                                },
                                {
                                    name: 'Password Strength',
                                    value: data.password_strength
                                }
                            )
                        }
                    } else {
                        sendEmbed = await embedService.error(`${userTarget.id !== user.id ? `${userTarget.tag} does` : `You do`} not have any account.`)
                    }

                    if (sendEmbed !== undefined) {
                        return interaction.editReply({ embeds: [sendEmbed] })
                    }
                }
            }
        } else if (subCommand === 'login') {
            const username = options.getString('username')
            console.log(username)
            const userMember = guild!.members.cache.get(user.id)
            if (username) {
                const password = options.getString('password')
                const userAccount = new AccountProvider(userMember!)
                const doLogin = await userAccount.login(username!, password!)
                if (doLogin.status === 404) {
                    const sendEmbed = await embedService.error(doLogin.response)
                    return interaction.editReply({ embeds: [sendEmbed]})
                } else if (doLogin.status === 200) {
                    const sendEmbed = await embedService.success(doLogin.response)
                    return interaction.editReply({ embeds: [sendEmbed]})
                }
            }
        }
    }
)

export default account