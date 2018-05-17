const Discord = require("discord.js");

module.exports.run  = async (bot, message, args) => {
    
    /**
     * command
     * ice?serverroles
     * 
     * egin10
     */

    var roles = message.guild.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => `<@&${role.id}>`);
    if (roles.length < 1) roles = ['None'];
    let serverEmbed = new Discord.RichEmbed()
        .setDescription("**List Roles in this Server**")
        .setColor("#610768")
        .addField("Roles", roles.join('❱ '))
        .addField("Total", roles.length)
        .setTimestamp(new Date());

    message.channel.send(serverEmbed);
}

module.exports.help = {
    name : "serverroles"
}