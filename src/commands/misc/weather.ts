import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { CommandBuilder } from 'discordbuilder.js';
import { Bot } from '../../structures/bot.js';
import { getCityInfo } from '../../extensions/cityInfo.js';

const cityinfo = new CommandBuilder()
.setName('cityinfo')
.setDescription('City info command')
.setLevel(1)
.setCategory({
    name: 'Miscellaneous',
    emoji: '<:misc:1071160889773932654>'
})
.addStringOption(opt => opt
    .setName('city')
    .setDescription('City to lookup')
    .setRequired(true)
)
.setCallback(
    async (bot: Bot, interaction: ChatInputCommandInteraction) => {
        const { options, user } = interaction;
        const city = options.getString('city')
        if (city) {
            const data = await getCityInfo(city)
            if (data) {
                const city_data = data.data
                const weather_data = data.weather
                if (city_data && weather_data) {
                    await interaction.deferReply()

                    const cityName = city_data.city
                    const regionName = city_data.region
                    const countryName = city_data.country
                    const cityCode: string = city_data.code
                    const countryFlag = `https://countryflagsapi.com/png/${cityCode.toLowerCase()}`
                    const population = `${city_data.population}`
                    const time = `<t:${city_data.time}>`
                    console.log(time)
                    const embed = new EmbedBuilder()
                    .setAuthor({ name: `City Data`, iconURL: countryFlag})
                    //@ts-ignore
                    .setColor(city_data.color || '#fff')
                    .addFields(
                        {
                            name: 'Code',
                            value: city_data.code,
                            inline: true
                        },
                        {
                            name: 'City',
                            value: cityName,
                            inline: true
                        },
                        {
                            name: 'Region',
                            value: regionName,
                            inline: true
                        },
                        {
                            name: 'Country',
                            value: countryName,
                            inline: true
                        },
                        {
                            name: 'Population',
                            value: population,
                            inline: true
                        },
                        {
                            name: 'Time',
                            value: time,
                            inline: true
                        }
                    )
                    .setFooter({ text: `Requested by ${user.tag}`, iconURL: user.displayAvatarURL({ extension: 'png'}) || ''})

                    return interaction.editReply({ embeds: [embed]})
                }
            }
        }
    }
)

export default cityinfo