const config = require('./conf/bot.json');
const Discord   = require('discord.js');
const bot       = new Discord.Client({disableEveryone : true});
const fs        = require("fs");
bot.commands    = new Discord.Collection();

fs.readdir("./cmds/", (err, file) => {
    if (err) console.log(err);
    
    let jsFile  = file.filter(f => f.split(".").pop() === "js" );
    if (jsFile.length <= 0) {
        console.log("Command not found!");
        return;
    }

    jsFile.forEach((f, i) => {
        let props = require(`./cmds/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });

});

bot.on("ready", async () => {
    console.log(`Bot has started, run on ${bot.guilds.size} guilds.`);

    setInterval(() =>  {
        let status = [`ice?help`, `On ${bot.guilds.size} Server`, `With ${bot.users.size} User`];
        let random = Math.floor(Math.random() * status.length);
        bot.user.setActivity(status[random]);
    }, 20000);
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    
    let prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;
    
    let messageArray    = message.content.split(" ");
    let cmd             = messageArray[0];
    let args            = messageArray.slice(1);

    let commandFile     = bot.commands.get(cmd.slice(prefix.length));
    if(commandFile) commandFile.run(bot, message, args);

});

bot.login(config.t);
