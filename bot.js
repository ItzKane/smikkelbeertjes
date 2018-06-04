const botSettings = require("./botsettings.json");
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();

const prefix = botSettings.prefix;

const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();

fs.readdir("./cmds/", (err, files) => {
    if(err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if(jsfiles.length <= 0) {
        console.log("Oepsie, er zijn nog geen commands!");
        return;
    }

    console.log(`Loading ${jsfiles.length} command(s)!`);

    jsfiles.forEach((f, i) => {    
        let props = require(`./cmds/${f}`);
        console.log(`${i + 1}: ${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});
bot.on(`ready`, () => {
	console.log(`Opgestart, Status staat aan!!`)
	bot.user.setActivity(`SmikkelBeertjes`)
    setInterval(game, 10000);
    function game() {
        var random = Math.floor((Math.random() * 3) + 1);
        if (random === 1) bot.user.setActivity(`${bot.guilds.size} servers`, {type: "WATCHING"});
        if (random === 2) bot.user.setActivity(`${bot.users.size} gebruikers`, {type: "LISTENING"});
    }
  });
  bot.on(`guildMemberAdd`, (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);
  });
  bot.on('guildMemberAdd', async member => {
    let guild = member.guild;
    let userclient = member.user.bot ? 'Bot' : 'Gebruiker'
    let channel = guild.channels.find('name', 'join-log');
    if (!channel) {
        guild.createChannel('join-log', 'text').then(channel => console.log(`Created new channel ${channel}`)).catch(console.error);
    }
	let role = member.guild.roles.find('name', 'Members');
    if (!role) {
        guild.createRole({
            name: 'Members',
            color: 'LIGHT_BLUE'
        }).then(role => console.log(`Created role ${role}`)).catch(console.error);
    }
    const welcomeEmbed = new Discord.RichEmbed()
    .setAuthor(`${member.user.tag} is gejoind!`, member.user.displayAvatarURL)
    .setColor(65280)
    .setTimestamp()
    .setFooter(`Nieuwe ${userclient}`)
    channel.send(welcomeEmbed);
    await member.addRole(role);
});
bot.on('guildMemberRemove', async member => {
    let guild = member.guild;
    let userclient = member.user.bot ? 'Bot' : 'Gebruiker';
    let channel = guild.channels.find('name', 'join-log');
    if (!channel) {
        guild.createChannel('join-log', 'text').then(channel => console.log(`Created new channel ${channel}`)).catch(console.error);
    }
    const byeEmbed = new Discord.RichEmbed()
    .setAuthor(`${member.user.tag} is geleaved!`, member.user.displayAvatarURL)
    .setColor(13632027)
    .setTimestamp()
    .setFooter(`${userclient} is weggegaan`)
    channel.send(byeEmbed);
});
  bot.on('message', message => {
    if (message.author.equals(bot.user)) return; // if the message is sent by a bot, ignore

    if (!message.content.startsWith(prefix)) return; // if the message doesn't contain PREFIX (*), then ignore
    var command = args[0].toLowerCase(); // sets the command to lowercase (making it incase sensitive)
    var mutedrole = message.guild.roles.find("name", "muted");
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if(message.content === `.kick`) {

        let kUser = message.mentions.members.first() || message.guild.members.get(args[0]);
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have enough perms for this command");
        if(!kUser) return message.channel.send("Can't find user!");
        let kReason = args.slice(1).join(" ");
        if (!kReason) return message.channel.send("You need to specify why you want to kick this user");
        if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

        let kickEmbed = new Discord.RichEmbed()
        .setDescription("Kick info:")
        .setColor([255, 0, 0])
        .addField("Target", `**${kUser}**`)
        .addField("Moderator", `**<@${message.author.id}>**`)
        .addField("Where it happend", message.channel)
        .addField("Reason:", kReason);

        let kickChannel = message.guild.channels.find(`name`, "mod-log");
        if(!kickChannel) return message.channel.reply("Can't find mod-log channel.");

        message.guild.member(kUser).kick(kReason);
        kickChannel.send(kickEmbed);

        return;
    }
	
	if(message.content === `.reload`) {
		loadCmds();
	}
	
    if(message.content === `.ban`) {

        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You do not have enough perms for this command");
        if(!bUser) return message.channel.send("Can't find user!");
        let bReason = args.join(" ").slice(22);
        if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

        let banEmbed = new Discord.RichEmbed()
        .setTitle(`${message.author.id} ElectryHost - Ban.`)
        .setDescription("Oef.. Wie is stout geweest met Sinterklaas?")
        .setColor([255, 0, 0])
        .addField("**Uitvoerder**", `**${bUser}**`)
        .addField("**Doelwit**", `**<@${message.author.id}>**`)
        .addField("**Reden**", message.channel)
        .addField("**Actie**:", bReason);

        let banchannel = message.guild.channels.find(`name`, "mod-log");
        if(!banchannel) return message.channel.reply("Can't find mod-log channel.");

        message.guild.member(bUser).ban(bReason);
        banchannel.send(banEmbed);


        return;
    }

    if(message.content === ".purge ") {
        let messagecount = parseInt(args[1]) || 1;

        var deletedMessages = -1;

        message.channel.fetchMessages({limit: Math.min(messagecount + 1, 100)}).then(messages => {
            messages.forEach(m => {
                if (m.author.id == bot.user.id) {
                    m.delete().catch(console.error);
                    deletedMessages++;
                }
            });
        }).then(() => {
                if (deletedMessages === -1) deletedMessages = 1;
                message.channel.send(`:white_check_mark: Purged \`${deletedMessages}\` messages.`)
                    .then(m => m.delete(2000));
        }).catch(console.error);
    }

    if(message.content === `.help`) { // creates a command *help
        var embedhelpmember = new Discord.RichEmbed() // sets a embed box to the variable embedhelpmember
            .setTitle("**List of Commands**\n") // sets the title to List of Commands
            .addField(" - help", "Displays this message (Correct usage: *help)") // sets the first field to explain the command *help
            .addField(" - info", "Tells info about myself :grin:") // sets the field information about the command *info
            .addField(" - ping", "Tests your ping (Correct usage: *ping)") // sets the second field to explain the command *ping
            .addField(" - cookie", "Sends a cookie to the desired player! :cookie: (Correct usage: *cookie @username)") // sets the third field to explain the command *cookie
            .addField(" - 8ball", "Answers to all of your questions! (Correct usage: *8ball [question])") // sets the field to the 8ball command
            .setColor(0xFFA500) // sets the color of the embed box to orange
            .setFooter("You need help, do you?") // sets the footer to "You need help, do you?"
        var embedhelpadmin = new Discord.RichEmbed() // sets a embed box to the var embedhelpadmin
            .setTitle("**List of Admin Commands**\n") // sets the title
            .addField(" - say", "Makes the bot say whatever you want (Correct usage: *say [message])")
            .addField(" - mute", "Mutes a desired member with a reason (Coorect usage: *mute @username [reason])") // sets a field
            .addField(" - unmute", "Unmutes a muted player (Correct usage: *unmute @username)")
            .addField(" - kick", "Kicks a desired member with a reason (Correct usage: *kick @username [reason])") //sets a field
            .setColor(0xFF0000) // sets a color
            .setFooter("Ooo, an admin!") // sets the footer
        message.channel.send(embedhelpmember); // sends the embed box "embedhelpmember" to the chatif
        if(message.member.roles.some(r=>["Admin"].includes(r.name)) ) return message.channel.send(embedhelpadmin); // if member is a botadmin, display this too
    }
	
    if (command == "info") { // creates the command *info
        message.channel.send("Hey! My name is cookie-bot and I'm here to assist you! You can do *help to see all of my commands! If you have any problems with the Minecraft/Discord server, you can contact an administrator! :smile:") // gives u info
    }

    if (command == "ping") { // creates a command *ping
        message.channel.send("Pong!"); // answers with "Pong!"
    }

    if (command == "cookie") { // creates the command cookie
        if (args[1]) message.channel.send(message.author.toString() + " has given " + args[1].toString() + " a cookie! :cookie:") // sends the message saying someone has given someone else a cookie if someone mentions someone else
        else message.channel.send("Who do you want to send a cookie to? :cookie: (Correct usage: *cookie @username)") // sends the error message if no-one is mentioned
    }

    if (command == "8ball") { // creates the command 8ball
        if (args[1] != null) message.reply(eightball[Math.floor(Math.random() * eightball.length).toString(16)]); // if args[1], post random answer
        else message.channel.send("Ummmm, what is your question? :rolling_eyes: (Correct usage: *8ball [question])"); // if not, error
    }

    if (message.content === ".say") { // creates command say
        if (!message.member.roles.some(r=>["Members"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!");
        var sayMessage = message.content.substring(4)
        message.delete().catch(O_o=>{});
        message.channel.send(sayMessage);
    }
	
    if (message.content == ".mute") { // creates the command mute
        if (!message.member.roles.some(r=>["^"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if author has no perms
        var mutedmember = message.mentions.members.first(); // sets the mentioned user to the var kickedmember
        if (!mutedmember) return message.reply("Please mention a valid member of this server!") // if there is no kickedmmeber var
        if (mutedmember.hasPermission("ADMINISTRATOR")) return message.reply("I cannot mute this member!") // if memebr is an admin
        var mutereasondelete = 10 + mutedmember.user.id.length //sets the length of the kickreasondelete
        var mutereason = message.content.substring(mutereasondelete).split(" "); // deletes the first letters until it reaches the reason
        var mutereason = mutereason.join(" "); // joins the list kickreason into one line
        if (!mutereason) return message.reply("Please indicate a reason for the mute!") // if no reason
        mutedmember.addRole(mutedrole) //if reason, kick
            .catch(error => message.reply(`Sorry ${message.author} I couldn't mute because of : ${error}`)); //if error, display error
        message.reply(`${mutedmember.user} has been muted by ${message.author} because: ${mutereason}`); // sends a message saying he was kicked
    }

    if (message.content == ".unmute") { // creates the command unmute
        if (!message.member.roles.some(r=>["^"].includes(r.name)) ) return message.reply("Sorry, you do not have the permission to do this!"); // if author has no perms
        var unmutedmember = message.mentions.members.first(); // sets the mentioned user to the var kickedmember
        if (!unmutedmember) return message.reply("Please mention a valid member of this server!") // if there is no kickedmmeber var
        unmutedmember.removeRole(mutedrole) //if reason, kick
            .catch(error => message.reply(`Sorry ${message.author} I couldn't mute because of : ${error}`)); //if error, display error
        message.reply(`${unmutedmember.user} has been unmuted by ${message.author}!`); // sends a message saying he was kicked
    }
  });
bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let messageArray = message.content.split(" ");
    let command = messageArray[0];
    let args = messageArray.slice(1);

    if(!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));
    if(cmd) cmd.run(bot, message, args);
   
}); 
bot.login(botSettings.token); 