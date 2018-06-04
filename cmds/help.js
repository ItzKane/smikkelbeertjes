const Discord = module.require("discord.js");
let hinfo = ("You want my commands?\n\n")
let hcommands = ("**Please use s*help**")
module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let embed = new Discord.RichEmbed()
    .setThumbnail(bicon)
        .setColor("#42f450")
        .addField("**Nope almost**", hinfo)
        .addField("\n**You have to use**", hcommands)
        .setFooter(`nice try!`);




        message.channel.send({embed: embed});
		
}

module.exports.help = {
    name: "help"
} 