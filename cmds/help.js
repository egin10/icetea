const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    /**
     * command
     * ice?help
     * 
     * egin10
     */

    const ask = await message.channel.send("Help ? :thinking: ");
    ask.delete();

    let help = new Discord.RichEmbed()
    .setTitle("**Hai! I'm IceTea.** :tropical_drink: ")
    .setDescription("Command List")
    .addField("IceTea", "`help, ping, botinfo, avatar, serverinfo, serverroles, userinfo`")
    .addField("Moderation", "`tempmute`")
    .addField("Utils", "`translate`")
    .addField("Music", "`join, play, skip, stop, volume, np (now playing), queue, pause, resume, leave \nmore info : ice?music`")
    .addField("Info Command", "ice?<command> help")
    .addField("Link", "[Invite](https://discordapp.com/api/oauth2/authorize?client_id=446436555985256448&permissions=1391470694&scope=bot)")
    .setTimestamp(new Date());
    
    setTimeout(()=>{
        ask.delete();
        message.channel.send(help);
    }, 2000);
}

module.exports.help = {
    name : "help"
}