const Discord = require("discord.js");
const ms = require("ms");

module.exports.run = async (bot, message, args) => {

    /**
     * command
     * ice?tempmute @user time(s/m/h)
     * 
     * egin10
     */
    if(!args[0]) return;
    let info = new Discord.RichEmbed()
        .setTitle("Usage **tempmute**")
        .setColor("RANDOM")
        .addField("Command", "ice?tempmute @member time")
        .addField("Tempmute", "Mute member based on the time specified.");
    if(args[0] == "help") return message.channel.send(info);

    let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!tomute) return message.reply("User not found!.");
    if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission!");
    let muterole = message.guild.roles.find(`name`, "muted");

    //start of create role
    if(!muterole){
      try{
        muterole = await message.guild.createRole({
          name: "muted",
          color: "#a81d05",
          permissions:[]
        })
        message.guild.channels.forEach(async (channel, id) => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          });
        });
      }catch(e){
        console.log(e.stack);
      }
      
    }

    //end of create role
    let mutetime = args[1];
    if(!mutetime) return message.reply("Fill a correct time!");

    await(tomute.addRole(muterole.id));
    message.reply(`<@${tomute.id}> is **mute** for ${ms(ms(mutetime))}`);

    setTimeout(function(){
      tomute.removeRole(muterole.id);
      message.channel.send(`<@${tomute.id}> has been unmuted!`);
    }, ms(mutetime));

}

module.exports.help = {
  name: "tempmute"
}