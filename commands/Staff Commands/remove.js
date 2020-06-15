const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "remove",
    category: "Staff Commands",
    description: "removes a Member roles",
    usage: "<id | mention> <role name>",
    run: async (client, message, args) => {

    const cantdothat = new RichEmbed()
    .setColor("#EE1D1D")
    .setDescription(stripIndents`**>** You can't use this command. Reason: You don't have the required permissions to use this command.`);
  if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send(cantdothat).then(m => m.delete(7000));;

  let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

  const notfound = new RichEmbed()
  .setColor("#EE1D1D")
  .setDescription(stripIndents`**>** Couldn't find user ${args[0]}!`);
  if (!rMember) return message.channel.send(notfound).then(m => m.delete(5000));

  const wherestherole = new RichEmbed()
  .setColor("#EE1D1D")
  .setDescription(stripIndents`**>** Please be sure to tell us the role you want to remove from ${rMember}.`);
  if(!args[1]) return message.channel.send(wherestherole).then(m => m.delete(5000));

  
  let gRole = message.guild.roles.find(`name`, args.slice(1).join(" "));

  const rolenotfound = new RichEmbed()
  .setColor("#EE1D1D")
  .setDescription(stripIndents`**>** Couldn't find role, ${args.slice(1).join(" ")}!`);
  if(!gRole) return message.channel.send(rolenotfound).then(m => m.delete(5000));

  const userHasrole = new RichEmbed()
  .setColor("#EE1D1D")
  .setDescription(stripIndents`**>** User ${rMember}, doesn't have the role "${args.slice(1).join(" ")}"!`);

  if(rMember.roles.has(gRole.id)) return message.channel.send(userHasrole).then(m => m.delete(5000));
  await(rMember.addRole(gRole.id));

  message.channel.send("User was Successfully demoted.")

  try{
    const yaydm = new RichEmbed()
    .setColor("#3AE825")
    .setDescription(stripIndents`**>** Uh oh, you're role was remove called, ${gRole.name}
    **>** Demoted by: ${message.author.tag}`);
    await rMember.send(yaydm)
  }catch(e){
    console.log(e.stack);
    const yaybutnodm = new RichEmbed()
    .setColor("#3AE825")
    .setDescription(stripIndents`**>** Oh nos! <@${rMember.id}>, you're role was remove called, ${gRole.name}. We tried to DM you, but it seems your DMs are locked.
    **>** Demoted by: ${message.author.tag}`);
    message.channel.send(yaybutnodm)
    }
}
};