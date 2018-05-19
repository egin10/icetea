const Discord = require("discord.js");
const ms = require("ms");
const sql = require("sqlite");
const dbPromise = sql.open('./db/ice.db', {Promise});

module.exports.run = async (bot, message, args) => {
    /**
     * command
     * ice?mutetime set time(s/m/h)
     * ice?mutetime info
     * ice?mutetime del
     * 
     * egin10
     */
    
    const db = await dbPromise;
    let cmd = args[0];
    let time = args[1];
    let guild = message.guild.id;
    let info = new Discord.RichEmbed()
        .setTitle("Usage **MuteTime**")
        .setColor("RANDOM")
        .addField("Command", "-**ice?mutetime set time(s/m/h)** \t= set time to mute, like 2s/5m/10h. \n-**ice?mutetime info** \t= show mute time for the server. \n-**ice?mutetime del** \t= remove mute time for the server.")
        .addField("Description", "Setting time for mute member when get **2** warnings.")
        .setTimestamp(new Date());
    
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("You don't have permission!.");
    if(!cmd) return;
    if(cmd == "help") return message.channel.send(info);
    
    if(cmd == 'set'){
        if(!time){
            message.channel.send(`<@${message.author.id}>,You must fill a time(s/m/h) after **set**!`);
        } else {
            db.get(`SELECT * FROM mutetime WHERE guild_Id = ${guild}`).then(row => {
                if(!row){
                    db.run("INSERT INTO mutetime VALUES (?, ?)", [guild, time]);
                    message.channel.send(`The mute time has been set to **${ms(ms(time))}**.`);
                } else {
                    db.run(`UPDATE mutetime SET waktu='${time}' WHERE guild_Id = ${guild}`);
                    message.channel.send(`The mute time has been change to **${ms(ms(time))}**.`);
                }
            });
        }
    } else if (cmd == 'info') {
        db.get(`SELECT waktu FROM mutetime WHERE guild_Id = ${guild}`).then(row => {
            if(row){
                message.channel.send(`The mute time for this server is **${ms(ms(row.waktu))}**.`);
            } else {
                message.channel.send(`The mute time for this server has not been set!`);
            }
        });
    } else if (cmd == 'del') {
        db.get(`SELECT * FROM mutetime WHERE guild_Id = ${guild}`).then(row => {
            if(!row) {
                message.channel.send(`The mute time for this server has not been set!.`);
            } else {
                db.run(`DELETE FROM mutetime WHERE guild_Id = ${guild}`);
                message.channel.send(`The mute time has been deleted!.`);
            }
        });
    }
}

module.exports.help = {
    name : "mutetime"
}