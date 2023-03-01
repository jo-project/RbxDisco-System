import { EmbedBuilder } from "@discordjs/builders";
import { Bot } from "../structures/bot.js";
export function log(client: Bot) {
    const errChannel = `1071626253314039958`
    // process.on("unhandledRejection", async (reason, p) => {
    //   console.log('[Anti-Crash] :: Unhandled Rejection/Catch')
    //   const pPromise = await p
    //   console.log(reason, pPromise)

    //   const embed = new EmbedBuilder()
    //   .setTitle('⚠️ Error')
    //   .setColor(0xB12626)
    //   .setDescription(`**Unhandled Rejection/Catch**\n\n\`\`\`ERROR: ${reason}\n\n${pPromise}\`\`\``)
    //   .setTimestamp()
    //   .setFooter({
    //     text: 'Anti Crash System',
    //     iconURL: client.user?.avatarURL({ extension: 'png'}) || ''
    //   })

    //   const channel = await client.channels.cache.get(errChannel)

    //   if (channel && channel.isTextBased()) {
    //     await channel.send({ embeds: [embed] })
    //   }
    // });

    // process.on("uncaughtException", async (err, origin) => {
    //   console.log('[Anti-Crash] :: Uncaught Exception/Catch')
    //   console.log(err, origin)

    //   const embed = new EmbedBuilder()
    //   .setTitle('⚠️ Error')
    //   .setColor(0xB12626)
    //   .setDescription(`**Uncaught Exception/Catch**\n\n\`\`\`ERROR: ${err}\n\n${origin}\`\`\``)
    //   .setTimestamp()
    //   .setFooter({
    //     text: 'Anti Crash System',
    //     iconURL: client.user?.avatarURL({ extension: 'png'}) || ''
    //   })

    //   const channel = await client.channels.cache.get(errChannel)

    //   if (channel && channel.isTextBased()) {
    //     await channel.send({ embeds: [embed] })
    //   }
    // });

    // process.on("uncaughtExceptionMonitor", async (err, origin) => {
    //   console.log('[Anti-Crash] :: Uncaught Exception/Catch (MONITOR)')
    //   console.log(err, origin)

    //   const embed = new EmbedBuilder()
    //   .setTitle('⚠️ Error')
    //   .setColor(0xB12626)
    //   .setDescription(`**Uncaught Exception/Catch (MONITOR)**\n\n\`\`\`ERROR: ${err}\n\n${origin}\`\`\``)
    //   .setTimestamp()
    //   .setFooter({
    //     text: 'Anti Crash System',
    //     iconURL: client.user?.avatarURL({ extension: 'png'}) || ''
    //   })

    //   const channel = await client.channels.cache.get(errChannel)

    //   if (channel && channel.isTextBased()) {
    //     await channel.send({ embeds: [embed] })
    //   }
    // });
}