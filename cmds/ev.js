const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {
    /**
     * command
     * ice?ev code
     * 
     * egin10
     */

    if(message.author.id !== '378940242876432396') return;
    try {
        let codein = args.join(' ');
        if (!codein) return;
        let code = eval(codein);

        if (typeof code !== 'string')
        code = require('util').inspect(code, { depth: 0 });
        let embed = new Discord.RichEmbed()
        .setAuthor('Evaluate')
        .setColor("RANDOM")
        .addField(':inbox_tray: Input', `\`\`\`js\n${codein}\`\`\``)
        .addField(`:outbox_tray: Output`, `\`\`\`js\n${code}\n\`\`\``)
        .setTimestamp(new Date());
        message.channel.send(embed)
    } catch(e) {
        message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
    }
}

module.exports.help = {
    name : "ev"
}