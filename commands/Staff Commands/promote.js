const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "promote",
    category: "Staff Commands",
    description: "Promotes Member",
    usage: "<id | mention> <role name>",
    run: async (client, message, args) => {

      if (message.deletable) message.delete();

        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
          return message.reply("You can't promote people....").then(m => m.delete(5000));
      }

  let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

  const notfound = new RichEmbed()
  .setColor("#EE1D1D")
  .setDescription(stripIndents`**>** Couldn't find user ${args[0]}!`);
  if (!rMember) return message.channel.send(notfound).then(m => m.delete(5000));

  const wherestherole = new RichEmbed()
  .setColor("#EE1D1D")
  .setDescription(stripIndents`**>** Please be sure to tell us the role you want to give.`);
  if(!args[1]) return message.channel.send(wherestherole).then(m => m.delete(5000));

  
  let gRole = message.guild.roles.find(`name`, args.slice(1).join(" "));

  const rolenotfound = new RichEmbed()
  .setColor("#EE1D1D")
  .setDescription(stripIndents`**>** Couldn't find role, "${args.slice(1).join(" ")}"!`);
  if(!gRole) return message.channel.send(rolenotfound).then(m => m.delete(5000));

  const userHasrole = new RichEmbed()
  .setColor("#EE1D1D")
  .setDescription(stripIndents`**>** User ${rMember}, already has the role "${args.slice(1).join(" ")}"!`);

  if(rMember.roles.has(gRole.id)) return message.channel.send(userHasrole).then(m => m.delete(5000));
  await(rMember.addRole(gRole.id));

  message.channel.send("User was Successfully promoted.")

  try{
    const yaydm = new RichEmbed()
    .setColor("#3AE825")
    .setDescription(stripIndents`**>** Congrats, you have been given the role ${gRole.name}
    **>** Promoted by: ${message.author.tag}`);
    await rMember.send(yaydm)
  }catch(e){
    console.log(e.stack);
    const yaybutnodm = new RichEmbed()
    .setColor("#3AE825")
    .setDescription(stripIndents`**>** Congrats to <@${rMember.id}>, they have been given the role ${gRole.name}. We tried to DM you, but it seems your DMs are locked.
    **>** Promoted by: ${message.author.tag}`);
    message.channel.send(yaybutnodm)
    }
}
};