const { MessageEmbed } = require('discord.js');
module.exports = {
  name: "about",
  aliases: ["a"],
  category: "information",
  description: "desc",
  usage: "help",
  run: async (client, message, args) => {
    const about = new MessageEmbed()
      .setDescription(`> **; about**\n*it's an antinuke bot which prevents\nyour server from getting nuked.\nit's still in progress.*\n\n> **; Credits**\nCoded by : **Sxlitude#8885**\nGitHub: [Antinuke SRC](https://github.com/Sxlitude/discord-antinuke)`)
      .setColor("FF00FF")
    message.channel.send(about)
  }}