const Discord = require("discord.js");
const {prefix} = require("./../conf/bot.json");

module.exports.run  = async (bot, message, args) => {

    /**
     * command
     * ice?botinfo
     * 
     * egin10
     */

    let bicon       = bot.user.displayAvatarURL;
    let botEmbed    = new Discord.RichEmbed()
        .setDescription("**Informasi Bot**")
        .setColor("#d802e8")
        .setThumbnail(bicon)
        .addField("Nama Bot", bot.user.username)
        .addField("Dibuat pada", bot.user.createdAt)
        .addField("Prefix", prefix)
        .addField("Dibuat oleh", "It'sMe#0184")
        .setTimestamp(new Date());

    message.channel.send(botEmbed);
}

module.exports.help = {
    name : "botinfo"
}