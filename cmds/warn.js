const Discord = require("discord.js");
const ms = require("ms");
const sql = require("sqlite");
const dbPromise = sql.open('./db/ice.db', {Promise});

module.exports.run = async (bot, message, args) => {

    /**
     * command
     * ice?warn @user reason
     * 
     * egin10
     */
    
    const db = await dbPromise;
    let guild = message.guild.id;
    let info = new Discord.RichEmbed()
        .setTitle("Usage **Warn**")
        .setColor("RANDOM")
        .addField("Command", "-**ice?warn @user reason**.")
        .addField("Description", "Warning a member in this server.")
        .setTimestamp(new Date());
    if(args[0] == "help") return message.channel.send(info);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("You don't have permission!.");
    
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.reply("User not found!");
    if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have permission!");
    
    let reason = args.join(" ").slice(22);
    if(!reason) return message.reply("Reason can't be empty!");

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

    let warnchannel = message.guild.channels.find(`name`, "warn-channel");
    if(!warnchannel) {
        return message.reply("Can't find **warn-channel**.");
    } else {
        db.get(`SELECT guildID, userID, COUNT(userID) as warns FROM warning WHERE guildID = ${guild} AND userID = ${wUser.id}`).then(row => {
            let warning = row.warns + 1;
            if(warning == 1){
                db.run(`INSERT INTO warning VALUES (?,?,?)`, [guild, wUser.id, reason]);
                message.guild.channels.find(`name`, "warn-channel").send(`<@${wUser.id}> has warned by <@${message.author.id}>. reason is **${reason}** and it's first warning!`).catch(err => message.channel.send(`<@${message.author.id}>, I don't have permission to chat on **warn-channel**, but warning keep save!`));
            } else if(warning == 2){
                db.get(`SELECT waktu FROM mutetime WHERE guild_Id = ${guild}`).then(field => {
                    if(!field){
                        message.channel.send(`<@${message.author.id}>, You're not yet set **mutetime**, use **ice?mutetime help** for more info.`);
                    } else {
                        db.run(`INSERT INTO warning VALUES (?,?,?)`, [guild, wUser.id, reason]);
                        let muterole = message.guild.roles.find(`name`, "muted");
                        if(!muterole) return message.reply("You don't have permission for create the Roles.");

                        let mutetime = field.waktu;
                        wUser.addRole(muterole.id);
                        message.channel.send(`<@${wUser.id}> has been mute for **${mutetime}**!.`);

                        setTimeout(function(){
                            wUser.removeRole(muterole.id)
                            message.reply(`<@${wUser.id}> has been unmuted.`)
                        }, ms(mutetime));
                        message.guild.channels.find(`name`, "warn-channel").send(`<@${wUser.id}> has warned by <@${message.author.id}>. reason is **${reason}** and it's ${warning} warnings!`).catch(err => message.channel.send(`<@${message.author.id}>, I don't have permission to chat on **warn-channel**, but warning keep save!`));
                    }
                });
            } else if(warning == 3){
                db.run(`INSERT INTO warning VALUES (?,?,?)`, [guild, wUser.id, reason]);
                message.guild.member(wUser).ban(reason);
                message.guild.channels.find(`name`, "warn-channel").send(`<@${wUser.id}> has warned by <@${message.author.id}>. reason is **${reason}**, it's ${warning} warnings and has been ban!`).catch(err => message.channel.send(`<@${message.author.id}>, I don't have permission to chat on **warn-channel**, but warning keep save!`));
            }
        });
    }

}

module.exports.help = {
  name: "warn"
}