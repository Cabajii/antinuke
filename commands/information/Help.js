const { MessageEmbed } = require('discord.js');
module.exports = {
  name: "khelp",
  aliases: ["h"],
  category: "information",
  description: "desc",
  usage: "help",
  run: async (client, message, args) => {
    const help = new MessageEmbed()
      .setDescription(`> **; commands**\n\n**; moderation**\n\`ban, unban, kick\`\n\n** ; antinuke**\n\`trust, untrust\`\n\n**; information**\n\`about, ping\``)
      .setColor("00FFFF")
    message.channel.send(help)
  }
};