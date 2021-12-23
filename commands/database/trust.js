const Discord = require('discord.js');
const db = require('quick.db');
const { MessageEmbed } = require('discord.js');
module.exports = {
  name: "trust",
  aliases: [],
  category: "database",
  description: "desc",
  usage: "yes",
  run: async (client, message, args) => {
    if (message.author.id === message.guild.ownerID) {
      let user = message.mentions.users.first()
      if (!user) {
        message.channel.send("mention someone first.")
      }
      let trustedusers = db.get(`trustedusers_${message.guild.id}`)
      if (trustedusers && trustedusers.find(find => find.user == user.id)) {
        return message.channel.send(`they're already trusted.`)
      }
      let data = { user: user.id };
      db.push(`trustedusers_${message.guild.id}`, data)
      return message.channel.send(`trusted ${user.username} sucessfully.`)
    } message.channel.send("you're not the owner to run this command.")
  }
}