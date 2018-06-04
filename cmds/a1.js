 const Discord = module.require("discord.js");
let hinfo = ("Giveaway time!\n\n")
let hcommands = ("**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**\n**We will give away 2 spotify premium accounts**\nto the people who invited above 20 users to the server!\n**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**\n")
module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let embed = new Discord.RichEmbed()
    .setThumbnail(bicon)
        .setColor("#42f450")
        .addField("**Yay!**", hinfo)
        .addField("\n**Spotify Discord**", hcommands)
        .setFooter(`Add your own music now!`);




        message.channel.send({embed: embed});
		
}

module.exports.help = {
    name: "A1"
} 
