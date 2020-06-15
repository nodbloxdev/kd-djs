const { RichEmbed } = require("discord.js");
module.exports = {
    name: "blacklist",
    category: "Info",
    description: "Shows all blacklisted words.",
    run: async (client, message, args) => {

        let embed = new RichEmbed()
        .setTitle("Blacklisted Words")
        .setColor(000000)
        .setDescription("fuck, nigger,nigga, dick, shit, bitch, nigg0, pussy, whore, ass, hoe, faq, cum, sex, pus$y, s3x, ShIt, f*ck, faggot, fag")
        .setFooter('Requested By ' + message.author.tag, message.author.avatarURL)
        .setTimestamp();


        await message.channel.send({embed: embed}).then(msg => {msg.delete(60000)});
    }
}