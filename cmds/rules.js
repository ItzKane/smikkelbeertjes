 const Discord = module.require("discord.js");
let hinfo = ("The rules:\n\n")
let hcommands = ("**No spamming**\nMute/kick\n**No swearing**\nkick/ban\n**No NSFW**\nBan/Warn\n**No VPN**\nkick\n**No Stupid memes**\nOnly real memes....\n**No links**\nkick/ban\n")
module.exports.run = async (bot, message, args) => {
    let bicon = bot.user.displayAvatarURL;
    let embed = new Discord.RichEmbed()
    .setThumbnail(bicon)
        .setColor("#42f450")
        .addField("**We got some rules**", hinfo)
        .addField("\n**Rules**", hcommands)
        .setFooter(`Rules updates!`);




        message.channel.send({embed: embed});
		
}

module.exports.help = {
    name: "Rules"
} 