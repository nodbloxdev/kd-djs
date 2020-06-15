const { Client, Collection } = require("discord.js");
const { config } = require("dotenv");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();
const AntiSpam = require('discord-anti-spam');


const client = new Client({
    disableEveryone: true
});

client.commands = new Collection();
client.aliases = new Collection();

client.categories = fs.readdirSync("./commands/");

config({
    path: __dirname + "/.env"
})

client.on("ready", () => {
  console.log("Connected!");
});

app.get("/", (request, response) => {
  console.log("Ping received!");
  response.sendStatus(200);
});

app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me`);
}, 280000);

["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
});

client.on("ready", () => {
    console.log(`Hi, ${client.user.username} is now online!`);

    client.user.setPresence({
        status: "online",
        game: {
            name: "!help",
            type: "LISTENING"
        }
    }); 
})

const antiSpam = new AntiSpam({
  warnThreshold: 3,
  kickThreshold: 15,
  banThreshold: 25,
  maxInterval: 2000,
  warnMessage: '{@user}, Please stop spamming.',
  kickMessage: '**{user_tag}** has been kicked for spamming.', 
  banMessage: '**{user_tag}** has been banned for spamming.',
  maxDuplicatesWarning: 3,
  maxDuplicatesKick: 15,
  maxDuplicatesBan: 25, 
  exemptPermissions: [], 
  ignoreBots: true, // Ignore bot messages.
  verbose: true, // Extended Logs from module.
  ignoredUsers: [], // Array of User IDs that get ignored.
});

client.on('message', (message) => antiSpam.message(message)); 


client.on("message", async message => {
    const prefix = "!";


    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);
});

client.on("guildMemberAdd", function(member) {
  let role = member.guild.roles.find("name", "Subcriber");
  member.addRole(role).catch(console.error);

  let joinserver = member.guild.channels.find(`name`, 'community');
  if(!joinserver) return message.channel.send("Can't find community channel.");
    
  joinserver.send(`Welcome **${member.user.username}#${member.user.discriminator}**, to KJ's Server. We now have **${member.guild.memberCount}** members!`);
});

client.on('message', message => {
	if (message.channel.type == "dm") return;
	if (message.member.roles.find('name', 'Bypass')) return;
    const swearWords = ["fuck","nigger","nigga","dick", "shit", "bitch", "nigg0", "pussy", "whore", "ass", "hoe", "faq", "cum", "sex", "fag", "faggot", "s*x", "s3x", "pus$y", "ShIt", "f*ck"];
    if (swearWords.some(word => message.content.toLowerCase().includes(word))) {
        message.delete();
        message.channel.send(`Hey, ${message.author}! That word is blacklisted, please don't use it! Say: !blacklist to view blacklisted words.`);
        embed = new RichEmbed()
        embed.setAuthor(name=`${message.author.tag}`, icon=message.author.avatarURL)
        embed.setDescription('Offensive or curse word found in message, in '+ message.channel)
        embed.setColor(0xff0000)
        embed.addField(name="Message:", value=message.content)
        embed.setFooter(name=`ID: ${message.author.id}`) 
        embed.setTimestamp() 

        guild = client.guilds.get("695916962286534700")
        channel = guild.channels.find("id", "696851250884378658") // This will find the channel which it will send the log embed into.
        channel.send(embed)
      }
});

function getTime() {

  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;

  var min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;

  var sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;

  return hour + ":" + min + ":" + sec;
}
var time = getTime();

function getDateNow() {

  var date = new Date();

  var year = date.getFullYear();

  var month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;

  var day = date.getDate();
  day = (day < 10 ? "0" : "") + day;


  return month + "." + day + "." + year;
}
var date = getDateNow();

client.on('debug', (debug) => { 
  let debugged = debug.replace(process.env.TOKEN, '[RETACTED: Hidden To Prevent Leaking]')
  console.log(`[Time: ${time}]\r\n[Date: ${date}]\r\n${debugged}\r\n`)
  fs.appendFile("./logs/debug.txt", (`[Time: ${time}]\r\n[Date: ${date}]\r\n${debugged}\r\n`), (err) => {

  })
});


client.login(process.env.TOKEN);