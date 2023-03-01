import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

import { EmbedService } from "../../services/embed.js";
import { Bot } from "../../structures/bot.js";
import { CommandBuilder } from "discordbuilder.js";
import CharacterSchema from '../../models/data/character.js'
import { capitalizeWords } from "../../extensions/string.js";

const character = new CommandBuilder()
.setName('character')
.setDescription('Command for user custom character')
.setClass('Member')
.setLevel(1)
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.addSubcommand(option => option
    .setName('register')
    .setLevel(1)
    .setDescription('Register your custom character (Default: null)')
    .addStringOption(opt => opt
        .setName('name')
        .setDescription('Name of your custom character')
        .setRequired(true)
    )
    .addIntegerOption(opt => opt
        .setName('age')
        .setMinValue(13)
        .setMaxValue(100)
        .setDescription('Age of your custom character')
        .setRequired(true)
    )
    .addStringOption(opt => opt
        .setName('gender')
        .setDescription('Gender of your custom character')
        .setRequired(true)
        .setChoices({
            name: 'Male',
            value: 'male'
        }, {
            name: 'Female',
            value: 'female'
        })
    )
    .addStringOption(opt => opt
        .setName('nationality')
        .setDescription('Nationality of your custom character')
        .setRequired(true)
    )
)
.addSubcommand(option => option
    .setName('edit')
    .setDescription('Edit your custom character')
    .setLevel(1)
    .addStringOption(opt => opt
        .setName('name')
        .setDescription('Name of your custom character')
        .setRequired(false)
    )
    .addIntegerOption(opt => opt
        .setName('age')
        .setMinValue(13)
        .setMaxValue(100)
        .setDescription('Age of your custom character')
        .setRequired(false)
    )
    .addStringOption(opt => opt
        .setName('gender')
        .setDescription('Gender of your custom character')
        .setRequired(false)
        .setChoices({
            name: 'Male',
            value: 'male'
        }, {
            name: 'Female',
            value: 'female'
        })
    )
    .addStringOption(opt => opt
        .setName('nationality')
        .setDescription('Nationality of your custom character')
        .setRequired(false)
    )
)
.addSubcommand(opt => opt
    .setName('view')
    .setDescription('View your custom character')
    .setLevel(1)
    .addUserOption(opt => opt
        .setName('user')
        .setDescription('User to lookup (admin only)')
        .setLevel(3)
        .setRequired(false)
    )
)
.setCallback(
    async (client : Bot, interaction: ChatInputCommandInteraction) => {
        const { options, user, guild } = interaction;
        const subCommand = options.getSubcommand();
        const embedService = new EmbedService(guild!)
        if (subCommand === 'register') {
            const data = await CharacterSchema.findOne({ guild: guild!.id, _id: user.id })
            if (data) {
                await interaction.deferReply({ ephemeral: true })
                const errEmbed = await embedService.error('You already register a custom character, please use /edit to modify.')
                return interaction.editReply({ embeds: [errEmbed] })
            } else {
                await interaction.deferReply()
                const name = options.getString('name')!
                const gender = options.getString('gender')!
                const age = options.getInteger('age')!
                const nationality = options.getString('nationality')!
                const newData = new CharacterSchema({
                    _id: user.id,
                    guild: guild!.id,
                    name: name.toLowerCase(),
                    age: age,
                    gender: gender.toLowerCase(),
                    nationality: nationality.toLowerCase()
                })
                newData.save();

                const succEmbed = new EmbedBuilder()
                .setTitle('Create New Character')
                .setDescription(`**This character belongs to** <@${user.id}>`)
                .setColor(0x4876f5)
                .setThumbnail(user.displayAvatarURL({ extension: 'png'}))
                .addFields(
                    {
                        name: 'Name',
                        value: capitalizeWords(name)
                    },
                    {
                        name: 'Age',
                        value: `${age} years old`
                    },
                    {
                        name: 'Gender',
                        value: capitalizeWords(gender)
                    },
                    {
                        name: 'Nationality',
                        value: capitalizeWords(nationality)
                    }
                )
                .setTimestamp()
                .setFooter({ text: guild!.name,  iconURL: guild!.iconURL({ size: 1024, extension: 'png' }) || ''})

                return interaction.editReply({ embeds: [succEmbed] })
            }
        } else if (subCommand === 'edit') {
            const data = await CharacterSchema.findOne({ guild: guild!.id, _id: user.id })
            if (!data) {
                await interaction.deferReply({ ephemeral: true })
                const errEmbed = await embedService.error('You have not register your custom character, please do /character register.')
                return interaction.editReply({ embeds: [errEmbed] })
            } else {
                await interaction.deferReply()
                const name = options.getString('name')
                const gender = options.getString('gender')
                const age = options.getInteger('age')
                const nationality = options.getString('nationality');
                const fieldsData : {
                    name: string,
                    value: string
                }[] = [];
                if (name) {
                    data.name = name.toLowerCase();
                    fieldsData.push({
                        name: 'Name',
                        value: capitalizeWords(name)
                    })
                }

                if (age) {
                    data.age = age
                    fieldsData.push({
                        name: 'Age',
                        value: `${age} years old`
                    })
                }

                if (gender) {
                    data.gender = gender.toLowerCase()
                    fieldsData.push({
                        name: 'Gender',
                        value: capitalizeWords(gender)
                    })
                }

                if (nationality) {
                    data.nationality = nationality.toLowerCase()
                    fieldsData.push({
                        name: 'Nationality',
                        value: capitalizeWords(nationality)
                    })
                }

                data.save();

                const succEmbed = new EmbedBuilder()
                .setTitle('Edit Character')
                .setDescription(`**This character belongs to** <@${user.id}>`)
                .setColor(0x4876f5)
                .setThumbnail(user.displayAvatarURL({ extension: 'png'}))
                .addFields(fieldsData.map(function(val) {
                    return {
                        name: val.name,
                        value: val.value
                    }
                }))
                .setTimestamp()
                .setFooter({ text: guild!.name,  iconURL: guild!.iconURL({ size: 1024, extension: 'png' }) || ''})

                return interaction.editReply({ embeds: [succEmbed] })
            }
        } else if (subCommand === 'view') {
            const data = await CharacterSchema.findOne({ guild: guild!.id, _id: user.id })
            if (!data) {
                await interaction.deferReply({ ephemeral: true })
                const errEmbed = await embedService.error('You have not register your custom character, please do /character register.')
                return interaction.editReply({ embeds: [errEmbed] })
            } else {
                await interaction.deferReply()
                const succEmbed = new EmbedBuilder()
                .setTitle('View Character')
                .setDescription(`**This character belongs to** <@${user.id}>`)
                .setColor(0x4876f5)
                .setThumbnail(user.displayAvatarURL({ extension: 'png'}))
                .addFields(
                    {
                        name: 'Name',
                        value: capitalizeWords(data.name)
                    }, 
                    {
                        name: 'Age',
                        value: `${data.age} years old`
                    },
                    {
                        name: 'Gender',
                        value: capitalizeWords(data.gender)
                    },
                    {
                        name: 'Nationality',
                        value: capitalizeWords(data.nationality)
                    }
                )
                .setTimestamp()
                .setFooter({ text: guild!.name,  iconURL: guild!.iconURL({ size: 1024, extension: 'png' }) || ''})

                return interaction.editReply({ embeds: [succEmbed] })
            }
        }
    }
)

export default character