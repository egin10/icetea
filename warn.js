const Discord = require("discord.js");
const ms = require("ms");
const sql = require("sqlite");
const dbPromise = sql.open('./sql/garuda.db', {Promise});

exports.run = async (garuda, bot, client, message, args) => {
  const db = await dbPromise;
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return;
  let member = message.mentions.members.first() || message.guild.members.get(args[0]);
  if (!member) return;
  let reason = args.join(" ").slice(22);
  db.get(`SELECT * FROM warn WHERE guilduser ="${message.guild.id + member.id}"`).then(row => {
    if (!row) {
      db.run("INSERT INTO warn (guilduser, guildId, userId, warns) VALUES (?, ?, ?, ?)", [message.guild.id + member.id, message.guild.id, member.id, 1]);
      message.channel.send(`**${member.user.tag}** Has been warned!`);
    } else {
      db.run(`UPDATE warn SET warns = "${row.warns + 1}" WHERE guilduser = "${message.guild.id + member.id}"`);
      message.channel.send(`**${member.user.tag}** Has been warned!`);
    }
  }).catch(() => {
    db.run("CREATE TABLE IF NOT EXISTS warn (guilduser TEXT, guildId TEXT, userId TEXT, warns INTEGER)").then(() => {
      db.run("INSERT INTO warn (guilduser, guildId, userId, warns) VALUES (?, ?, ?, ?)", [message.guild.id + member.id, message.guild.id, member.id, 1]);
      message.channel.send(`**${member.user.tag}** Has been warned!`);
    });
  });
  db.get(`SELECT warns FROM warn WHERE guilduser = "${message.guild.id + member.id}"`).then(row => {
    console.log(row.guilduser)
    if (row.guilduser === '3') {
      let muterole = message.guild.roles.find(`name`, "Muted");
      if (!muterole) return message.channel.send("Kamu harus membuat role Muted dulu!").then(msg => msg.delete(3000));
      let mutetime = "12h";
      await (member.addRole(muterole.id));
      message.channel.send(`<@${member.id}> Termuted karena mendapat warn 3 kali!`);

      setTimeout(function() {
          member.removeRole(muterole.id)
          message.channel.send(`<@${member.id}> kamu terbebas dari belenggu mute, jangan sampai diwarn lagi!`);
      }, ms(mutetime))
    }
  });
}