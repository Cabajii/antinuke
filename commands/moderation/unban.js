const { MessageEmbed } = require('discord.js');
module.exports = {
  name: "unban",
  aliases: ["uban"],
  category: "moderation",
  description: "desc",
  usage: "unban",
  run: async (client, message, args) => {
    if (!message.member.hasPermissions("ADMINISTRATOR")) {
      return message.channel.send("you cannot do this.")
    }
    if (!message.guild.me.hasPermissions("BAN_MEMBERS")) {
      return message.channel.send("i do not have permissions to do that")
    }
    let userid = args[0]
    message.guild.fetchBans().then(bans => {
      if (bans.size === 0) return;
      let unbanned = bans.find(b => b.user.id === userID)
      if (!unbanned) return;
      message.guild.members.unban(unbanned.user)
    })
  }
};