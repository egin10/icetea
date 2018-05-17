const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    /**
     * command
     * ice?avatar @member
     * 
     * egin10
     */
    let user = message.mentions.users.first();
    let author = message.author;
    
    user = user ? user : author;
    let uEmbed = new Discord.RichEmbed()
    .setColor("RANDOM")
    .setImage(user.displayAvatarURL)
    .setDescription(`[open original](${user.displayAvatarURL})`)
    .setTimestamp(new Date());

    message.channel.send(uEmbed);
    
}

module.exports.help = {
    name : "avatar"
}