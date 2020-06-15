const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");
const ms = require("ms");


module.exports = {
    name: "spam",
    category: "Staff Commands",
    description: "sends a dm to a user for spamming.",
    usage: "<id | mention>",
    run: async (client, message, args) => {

        if (message.deletable) message.delete();

        let tomute = message.mentions.members.first() || message.guild.members.get(args[0]);

        const notfound = new RichEmbed()
        .setColor("#EE1D1D")
        .setDescription(stripIndents`**>** Couldn't find user ${args[0]}!`);
        if (!tomute) return message.channel.send(notfound).then(m => m.delete(5000));

        const cantdothat = new RichEmbed()
        .setColor("#EE1D1D")
        .setDescription(stripIndents`**>** Couldn't send the dm to user ${args[0]}!`);
        if (tomute.hasPermission("MANAGE_MESSAGES") || tomute.user.bot) return message.channel.send(cantdothat).then(m => m.delete(5000));


        const reasonpls = new RichEmbed()
        .setColor("#EE1D1D")
        .setDescription(stripIndents`**>** Please provide a reason for the dm`);
        if (!args[1]) return message.channel.send(reasonpls).then(m => m.delete(5000));

        
        const channel = message.guild.channels.find(c => c.name === "logs")

        const servermissing = new RichEmbed()
        .setColor("#EE1D1D")
        .setDescription(stripIndents`**>** Couldn't find a **#logs** channel`); 
        if (!channel) return message.channel.send(servermissing).then(m => m.delete(5000));


        if(tomute.id){
            let muterole = message.guild.roles.find(`name`, "MUTED");
            if(!muterole) return message.reply("You should create that role dude.");
        
            let mutetime = "2h";
            await(tomute.addRole(muterole.id));
            message.channel.send(`<@${tomute.id}> has been temporarily muted for spamming`);
        
            setTimeout(function(){
                tomute.removeRole(muterole.id)
              message.reply(`<@${tomute.id}> has been unmuted.`)
            }, ms(mutetime))
          }

            const uhoh = new RichEmbed()
            .setColor("#EE1D1D")
            .setDescription(stripIndents`**>** The user **${args[0]}** already is muted.`);
            if(tomute.roles.has(muterole.id)) return message.channel.send(uhoh);

            await(tomute.addRole(muterole.id));
            const forwhatagain = new RichEmbed()
            .setColor("#ffffff")
            .setDescription(stripIndents`**>**\nUser **<@${tomute.id}>** has been muted.\nStaff User: **${message.author}**`)
            .setTimestamp();
            message.channel.send(forwhatagain);

              const muteduser = new RichEmbed()
              .setColor("#25C2E8")
              .setAuthor(message.guild.me.displayName, client.user.displayAvatarURL)
              .setDescription(stripIndents`**>** Muted: <@${tomute.id}>
              **>** Staff: ${message.author}
            **>** Reason: ${args[1]}`)
            .setTimestamp();
        channel.send(muteduser)
    }
}