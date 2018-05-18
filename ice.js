const config    = require('./conf/bot.json');
const Discord   = require('discord.js');
const bot       = new Discord.Client({disableEveryone : true});
const fs        = require("fs");
bot.commands    = new Discord.Collection();

//============ Music Dependencies =============//
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube(config.y);
const queue = new Map();
//=============================================//

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

//========================== Music Command ==========================//
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    let command = message.content.toLowerCase().split(' ')[0];
    command = command.slice(prefix.length);

    let infoMusic = new Discord.RichEmbed()
        .setTitle("Usage **Music**")
        .setColor("RANDOM")
        .addField("List Commands", `-play | p = play song \n
-skip | sk = skip song. \n
-stop | st = stop music. \n
-volume <value> | vol <value> = change volume music (1 - 5). \n
-np = Now Playing or current song. \n
-queue | q = list of songs. \n
-pause = pause a music. \n
-resume = resume a music. \n
-leave | l = leave a bot from voice. \n
-join | j = join a bot to voice.`)
        .addField("Command", "ice?play song | ice?p song")
        .setTimestamp(new Date());
    if(command === "music") return message.channel.send(infoMusic);

    if (command === 'play' || command === 'p') {
		const voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
			return message.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return message.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return message.channel.send(`✅ Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					message.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return message.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send('🆘 I could not obtain any search results.');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
	} else if (command === 'skip' || command === 'sk') {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return message.channel.send(":track_next: Next track!");
	} else if (command === 'stop' || command === 'st') {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return message.channel.send(":stop_button: Stop track!");
	} else if (command === 'volume' || command === 'vol') {
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		if (!args[1]) return message.channel.send(`The current volume is: **${serverQueue.volume} / 5**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return message.channel.send(`I set the volume to: **${args[1]}**`);
	} else if (command === 'np') {
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);
	} else if (command === 'queue' || command === 'q') {
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		return message.channel.send(`
__**:open_file_folder: Song queue:**__
${serverQueue.songs.map((song, i) => `**${i}** - ${song.title}`).join('\n')}
\n\n**:notes: Now playing:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Paused!');
		}
		return message.channel.send('There is nothing playing.');
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Resumed!');
		}
		return message.channel.send('There is nothing playing.');
	} else if (command === 'leave' || command === 'l') {
        const voiceChannel = message.member.voiceChannel;
        if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		return voiceChannel.leave();
    } else if (command === 'join' || command === 'j') {
        const voiceChannel = message.member.voiceChannel;
        if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		return voiceChannel.join();
    }

return undefined;

});

async function handleVideo(video, message, voiceChannel, playlist = false) {
	const serverQueue = queue.get(message.guild.id);
	// console.log(video);
	const song = {
		id: video.id,
		title: Discord.Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		// console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	// console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}
//========================== Music Command END ==========================//

bot.login(config.t);
