const { MessageEmbed } = require('discord.js');
module.exports = {
  name: "help",
  aliases: ["h"],
  category: "information",
  description: "desc",
  usage: "help",
  run: async (client, message, args) => {
    const help = new MessageEmbed()
      .setDescription(`> **; commands**\n\n**; moderation**\n\`ban, unban, kick\`\n\n**; antinuke**\n*run the about cmd.*`)
      .setColor("00FFFF")
    message.channel.send(help)
  }
};