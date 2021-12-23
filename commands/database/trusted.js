const Discord = require("discord.js")
const db = require("quick.db")
const ms = require("pretty-ms")
module.exports = {
  name: "trusted",
  aliases: [],
  category: "information",
  description: "desc",
  usage: "help",
  run: async (client, message, args) => {
    let trustedlist = new Discord.MessageEmbed()
      .setFooter("trusted users' list.")
    let database = db.get(`trustedusers_${message.guild.id}`)
    if (database && database.length) {
      let array = []
      database.forEach(m => {
        array.push(`<@${m.user}>`)
      }); trustedlist.addField('** Trusted Members:\n **', `${array.join("\n")}`)
      message.channel.send(trustedlist);
    } else { message.channel.send("there are no trusted users.") }
  }
}