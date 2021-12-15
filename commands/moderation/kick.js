//INITIALIZATION
const discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "kick",
  aliases: [],
  category: "moderation",
  description: "Kicks the mentioned member",
  usage: "kick <@user> <reason>",
  run: async (client, message, args) => {
    
    //CHECK WHETHER PERSON HAS PERMISSION
    if(!message.member.hasPermission("KICK_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, You do not have enough permission to use this command`)
    }
    //CHECK WHETHER BOT HAS PERMISSION
    if(!message.guild.me.hasPermission("KICK_MEMBERS")) {
      return message.channel.send(`**${message.author.username}**, I do not have enough permission to use this command`)
    }
    
    //INITIALIZE THE MEMBER WHOM TO KICK
    let target = message.mentions.members.first();
    
    //IF NO ONE IS MENTIONED RETURN
    if(!target) {
      return message.channel.send(`**${message.author.username}**, Please mention the person who you want to kick`)
    }
    
    //IF THE MESSAGE AUTHOR IS MENTIONED USER
    if(target.id === message.author.id) {
     return message.channel.send(`**${message.author.username}**, You can not kick yourself`)
    }
    
    //IF NOT REASON IS MENTIONED
    if(!args[1]) {
    return message.channel.send(`**${message.author.username}**, Please Give Reason to kick`)
  }
    
    //KICK EMBED
    let embed = new discord.MessageEmbed()
    .setTitle("Action: Kick")
    .setDescription(`Kicked ${target} (${target.id})`)
    .setColor("#ff2050")
    .setFooter(`Kicked by ${message.author.username}`);
    
    message.channel.send(embed)
    
    //KICK THE MEMBER
    target.kick(args[1]);
  }
};
