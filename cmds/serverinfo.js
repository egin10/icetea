const Discord = require("discord.js");

module.exports.run  = async (bot, message, args) => {
    
    /**
     * command
     * ice?serverinfo
     * 
     * egin10
     */

    let sicon       = message.guild.iconURL;
    let serverEmbed = new Discord.RichEmbed()
        .setDescription("**Information of Server**")
        .setColor("#610768")
        .setThumbnail(sicon)
        .addField("Server Name", message.guild.name)
        .addField("Owner", message.guild.owner)
        .addField("Members", message.guild.memberCount)
        .addField("Region", message.guild.region)
        .addField("Create On", message.guild.createdAt)
        .addField("Join At", message.guild.joinedAt)
        .addField("Roles", "Type \`\`ice?serverroles\`\` to see the roles in this server!")
        .setTimestamp(new Date());

    message.channel.send(serverEmbed);
}

module.exports.help = {
    name : "serverinfo"
}