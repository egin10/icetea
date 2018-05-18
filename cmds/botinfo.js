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
        .setDescription("**Information of Bot**")
        .setColor("#d802e8")
        .setThumbnail(bicon)
        .addField("Bot Name", bot.user.username)
        .addField("Create On", bot.user.createdAt)
        .addField("Prefix", prefix)
        .addField("Owner", "It'sMe#0184")
        .setTimestamp(new Date());

    message.channel.send(botEmbed);
}

module.exports.help = {
    name : "botinfo"
}