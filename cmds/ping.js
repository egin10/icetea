const Discord = require("discord.js");

module.exports.run  = async (bot, message, args) => {

    /**
     * command
     * ice?ping
     * 
     * egin10
     */

    const m = await message.channel.send("Ping?");
    m.delete();
    let pingEmbed = new Discord.RichEmbed()
    .setTitle("**Ping-Pong!**")
    .addField(":ping_pong: Pong!", `${m.createdTimestamp - message.createdTimestamp}ms`, true)
    .addField(":desktop: API Latency", `${Math.round(bot.ping)}ms`, true)
    .addField(`Ping By`, `**${message.author.tag}**`)
    .setTimestamp(new Date());

    message.channel.send(pingEmbed);

}

module.exports.help = {
    name : "ping"
}