const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");
const ms = require("ms");


module.exports = {
    name: "unmute",
    category: "Staff Commands",
    description: "unmutes user",
    usage: "<id | mention>",
    run: async (client, message, args) => {

        if (message.deletable) message.delete();

    if (!message.member.hasPermissions ('MANAGE_MESSAGES')) return message.channel.send("You need **MANAGE_MESSAGES** permissions for use this command.")
    const modlog = message.guild.channels.find(channel => channel.name === 'logs');
    const mod = message.author;
    if (!args[0] || args[0 == "help"]) return message.channel.send(`Please Usage: !unmute <user> <reason>`);
    let user = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    let nofound = new RichEmbed()
    .setTitle("Couldn't find user!")
    .setColor('#FF4500')
    .setDescription("Tip: Say !unmute to get your ranks, or do !unmute then <@mention> or <Username> with <reason> to unmute user from Server.")
    .setTimestamp();
    if(!user) await message.channel.send(nofound);
    let notmuted = new RichEmbed()
    .setTitle("User isn't Muted!")
    .setColor('#FF4500')
    .setDescription("The user you are trying to unmute isn't muted.")
    .setTimestamp();
    if (!user.roles.find(`name`, "MUTED")) return message.channel.send(notmuted)
    let reason = message.content.split(" ").slice(2).join(" ");
    let reasonneed = new RichEmbed()
    .setTitle("Cound't unmute user")
    .setColor('#FF4500')
    .setDescription("Reason is needed in order to unmute user from server. So Please, lease specify a reason for the Muted!")
    .setTimestamp();
    if (!reason) return message.channel.send(reasonneed)
    let uhoh = new RichEmbed()
    .setTitle(`You can't unmute ${user.user.username}#${user.user.discriminator}!`)
    .setColor('#FF4500')
    .setDescription("**Reason:** you don't have enough permissons or the user you tried to mute has more permissons than you or a role higher than you, **How Sad**.")
    .setTimestamp();
    if(user.hasPermission("MANAGE_MESSAGES")) return message.reply(uhoh);
    let muterole = message.guild.roles.find(`name`, "MUTED");
  let muteChannel = message.guild.channels.find(`name`, "logs");
  if (!muteChannel) return message.channel.send('**Please create a channel with the name `logs`**');

    if (!muterole) {
        try {
            muterole = await message.guild.createRole({
                name: "MUTED",
                color: "#000000",
                permissions: []
            })
            message.guild.channels.forEach(async (channel, id) => {
                await channel.overwritePermissions(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false
                });
            });
        } catch (e) {
            console.log(e.stack);
        }
    }
  

    let mutetime = args[1];

    await (user.removeRole(muterole.id));
    const muteembed = new RichEmbed()
            .setAuthor(' Action | UnMute', `https://images-ext-2.discordapp.net/external/wKCsnOcnlBoNk-__BXsd6BrO6YddfUB-MtmaoaMxeHc/https/lh3.googleusercontent.com/Z5yhBQBJTSJVe5veJgaK-9p29hXm7Kv8LKF2oN0hDnsToj4wTcQbirR94XVpH4Lt5a5d%3Dw300`)
            .addField('User:', `<@${user.id}>`)
            .addField('Reason:', `${reason}`)
            .addField('Moderator:', `${mod}`)
            .setTimestamp()
            .setColor('#00FF80');
        modlog.send(muteembed)
  
  
}};