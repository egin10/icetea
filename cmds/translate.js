const Discord = require('discord.js');
const translate = require('google-translate-api');

module.exports.run = async (bot, message, args) => {

    /**
     * command
     * ice?translate from to text
     * 
     * egin10
     */
    let _to   = args[0];
    let mes  = args.join(" ").slice(3);

    //help
    let info = new Discord.RichEmbed()
        .setTitle("Usage **Translate**")
        .setColor("RANDOM")
        .addField("Command", "ice?translate <code lang> text")
        .addField("Tempmute", "Translating a text to another language.")
        .addField("Available Languages ", "\`\`ice?translate langs \`\`")
        .setTimestamp(new Date());
    if(args[0] == "help") return message.channel.send(info);

    let langOne = 'af: Afrikaans | sq: Albanian | am: Amharic | ar: Arabic | hy Armenian | az: Azerbaijani | eu: Basque | be: Belarusian | bn: Bengali | bs: Bosnian | bg: Bulgarian | ca: Catalan | ceb: Cebuano | ny: Chichewa | zh-cn: Chinese Simplified | zh-tw: Chinese Traditional | co: Corsican | hr: Croatian | cs: Czech | da: Danish | nl: Dutch | en: English | eo: Esperanto | et: Estonian | tl: Filipino | fi: Finnish | fr: French | fy: Frisian | gl: Galician | ka: Georgian | de: German | el: Greek | ig: Igbo | id: Indonesian | ga: Irish | it: Italian | ja: Japanese | jw: Javanese | kn: Kannada | kk: Kazakh | km: Khmer | ko: Korean | ku: Kurdish (Kurmanji) | ky: Kyrgyz | lo: Lao ';
    let langTwo = 'la: Latin | lv: Latvian | lt: Lithuanian | lb: Luxembourgish | mk: Macedonian | mg: Malagasy | ms: Malay | ml: Malayalam | mt: Maltese | mi: Maori | mr: Marathi | mn: Mongolian | my: Myanmar (Burmese) | ne: Nepali | no: Norwegian | ps: Pashto | fa: Persian | pl: Polish | pt: Portuguese | ma: Punjabi | ro: Romanian | ru: Russian | sm: Samoan | gd: Scots Gaelic | sr: Serbian | st: Sesotho | sn: Shona | sd: Sindhi | si: Sinhala | sk: Slovak | sl: Slovenian | so: Somali | es: Spanish | su: Sundanese | sw: Swahili | sv: Swedish | tg: Tajik | ta: Tamil | te: Telugu | th: Thai | tr: Turkish | uk: Ukrainian | ur: Urdu | uz: Uzbek | vi: Vietnamese | cy: Welsh | xh: Xhosa | yi: Yiddish | yo: Yoruba | zu: Zulu';
    
    let aLangs = new Discord.RichEmbed()
        .setDescription("**List Available Languages**")
        .setColor("RANDOM")
        .addField("code : Language", langOne)
        .addField("code : Language", langTwo)
        .setTimestamp(new Date());
    if(args[0] == "langs") return message.channel.send(aLangs);

    if(!args[0]) {
        return;
    } else {
    let think = await message.channel.send(`Hmm... let me think... :thinking: `);

    //translate process
    translate(mes, {to: _to}).then(res => {
        // console.log(res.text);
        think.delete();
        let embed = new Discord.RichEmbed()
        .setAuthor('Translate')
        .setColor("RANDOM")
        .addField(':incoming_envelope: Text', `\`\`\`${mes}\`\`\``)
        .addField(`:bulb: Translate`, `\`\`\`${res.text}\`\`\``)
        .setTimestamp(new Date());
        message.channel.send(embed);
    }).catch(err => {
        // console.error(err);
        let embed = new Discord.RichEmbed()
        .setAuthor('Translate')
        .setColor("RANDOM")
        .addField(':incoming_envelope: Text', `\`\`\`${mes}\`\`\``)
        .addField(`:bulb: Translate`, `\`\`\`Could not find language.\`\`\``)
        .setTimestamp(new Date());
        message.channel.send(embed);
    });
    }
}

module.exports.help = {
  name: "translate"
}