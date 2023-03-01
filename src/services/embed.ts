import { EmbedBuilder, Guild, ColorResolvable, APIEmbed, JSONEncodable, RestOrArray } from "discord.js";
import { APIEmbedField } from "discord-api-types/v10";


type MultipleEmbedsOptions = Array<{
    title?: string,
    image?: string
    description?: string
    thumbnail?: string
    color?: ColorResolvable
    fields?: APIEmbedField[],
    timestamp?: boolean,
    defaultFooter?: boolean,
    footer?: {
        text: string,
        icon: string
    }
}>

export class EmbedService {

    readonly guild: Guild;
    constructor(guild: Guild) {
        this.guild = guild;
    }

    async sendMultipleEmbeds(options: MultipleEmbedsOptions) {
        const embeds: (APIEmbed | JSONEncodable<APIEmbed>)[] = []
        options.forEach(option => {
            const newEmbed = new EmbedBuilder()

            if (option.title) newEmbed.setTitle(option.title)
            if (option.image) newEmbed.setImage(option.image)
            if (option.description) newEmbed.setDescription(option.description)
            if (option.color) newEmbed.setColor(option.color)
            if (option.fields) newEmbed.addFields(option.fields)
            if (option.timestamp) newEmbed.setTimestamp()
            if (option.footer) {
                newEmbed.setFooter({
                    text: option.footer.text,
                    iconURL: option.footer.icon
                })
            } else {
                if (option.defaultFooter) {
                    newEmbed.setFooter({
                        text: this.guild!.name,
                        iconURL: this.guild!.iconURL({ extension: 'png' }) || ''
                    })
                }
            }

            embeds.push(newEmbed)
        })

        return embeds
    }

    async success(succMessage:string) {
        const succEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setColor(0x198754)
        .setDescription(`\`\`\`${succMessage}\`\`\``)
        .setTimestamp()
        .setFooter({ text: this.guild.name,  iconURL: this.guild.iconURL({ size: 1024, extension: 'png' }) || ''})

        return succEmbed
    }
    
    async error(errMessage: string) {
        const errEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xB12626)
        .setDescription(`\`\`\`${errMessage}\`\`\``)
        .setTimestamp()
        .setFooter({ text: this.guild.name,  iconURL: this.guild.iconURL({ size: 1024, extension: 'png' }) || ''})

        return errEmbed
    }

    async commandError(errMessage: string) {
        const errEmbed = new EmbedBuilder()
        .setTitle('⚠️ Command Error')
        .setDescription(errMessage)
        .setColor(0xB12626)
        .setTimestamp()
        .setFooter({ text: this.guild.name,  iconURL: this.guild.iconURL({ size: 1024, extension: 'png' }) || ''})

        return errEmbed
    }

    async commandSucces(succMessage: string) {
        const succEmbed = new EmbedBuilder()
        .setTitle('✔️ Command Error')
        .setColor(0x198754)
        .setDescription(succMessage)
        .setTimestamp()
        .setFooter({ text: this.guild.name,  iconURL: this.guild.iconURL({ size: 1024, extension: 'png' }) || ''})

        return succEmbed
    }
    
    async successField(...successField: APIEmbedField[]) {
        const succEmbed = new EmbedBuilder()
        .setTitle('Success')
        .setColor(0x198754)
        .addFields(successField)
        .setFooter({ text: this.guild.name,  iconURL: this.guild.iconURL({ size: 1024, extension: 'png' }) || ''})
        .setTimestamp()

        return succEmbed
    }

    async errorField(...errorField: APIEmbedField[]) {
        const errEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setColor(0xB12626)
        .addFields(errorField)
        .setFooter({ text: this.guild.name,  iconURL: this.guild.iconURL({ size: 1024, extension: 'png' }) || ''})
        .setTimestamp()

        return errEmbed
    }
}