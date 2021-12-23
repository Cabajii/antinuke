const { Client, Collection } = require("discord.js");
const Discord = require("discord.js");
const client = new Client()
const db = require('quick.db');

client.commands = new Collection();
client.aliases = new Collection();

["command"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

const JSON5 = require('json5')
require('dotenv').config({ multiline: `line-breaks` });
const settings = JSON5.parse(process.env.settings);
const token = settings.bot.token;
const url = settings.status.url;
const status = settings.status.text;
const prefix = ";"
const chalk = require("chalk");
const { startup, end } = require('./logs/logging.js');

client.on('ready', () => {
  client.user.setActivity({
    name: status,
    type: "STREAMING",
    url: url
  });
  console.log(chalk.cyanBright(startup));
  console.log(chalk.magentaBright(`       [!]: Logged in as ${client.user.tag}!`))
  console.log(chalk.greenBright(`       [!]: Antinuke is ready to go`))
  console.log(chalk.blueBright(`       [!]: Project is ready to host`))
  console.log(chalk.cyanBright(end))
})

client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(prefix)) return;

  if (!message.member)
    message.member = await message.guild.fetchMember(message);

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;
  let command = client.commands.get(cmd);

  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) command.run(client, message, args);
});

// AntiBan
client.on('guildBanAdd', async (guild, user) => {
  const logs = await guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_BAN_ADD",
  })

  if (!logs) return console.log("unable to fetch logs...")
  const banlog = logs.entries.first();
  if (!banlog) {
    return console.log("can't find ban log entries")
  }

  const { executor, target, createdAt, createdTimestamp } = banlog;
  const banned = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Member Ban**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Victim :: **${target.username}**
> [+] Server :: **${guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**
> [+] Unbanned **${target.username}**`)
    .setColor("FFFF00")

  const failed = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Member Ban**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Victim :: **${target.username}**
> [+] Server :: **${guild.name}**

> :dart: **__ACTIONS:__**
> [+] Can't Ban **${executor.username}**
> [+] Unbanned **${target.username}**`)
    .setColor("FFA500")

  if (executor.id === client.user.id) return;
  if (executor.id === guild.owner.id) return;
  let trustedusers = db.get(`trustedusers_${guild.id}`)
  if (trustedusers && trustedusers.find(find => find.user == executor.id)) return;

  const eventsTimestamp = Date.now().toString()
  const lts = createdTimestamp.toString();
  const ets = eventsTimestamp;
  const lt = lts.slice(0, -3)
  const et = ets.slice(0, -3);

  if (lt === et) {
    await guild.members.ban(executor.id, { reason: `Unallowed ban attempt.` })
    await guild.members.unban(target.id, { reason: `Get Unbanned!` })
    await guild.owner.send(banned)
  }
})


client.on("guildMemberRemove", async member => {
  const logs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "MEMBER_KICK_ADD",
  })
  if (!logs) return console.log("unable to fetch logs...")
  const kicklog = logs.entries.first();

  const { executor, target, createdAt, createdTimestamp } = kicklog;
  const banned = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Member Kick**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Victim :: **${target.username}**
> [+] Server :: **${member.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor("00FFFF")

  if (executor.id === member.guild.owner.id) return;
  if (executor.id === client.user.id) return;
  let trustedusers = db.get(`trustedusers_${member.guild.id}`)
  if (trustedusers && trustedusers.find(find => find.user == executor.id)) return;

  const eventsTimestamp = Date.now().toString()
  const lts = createdTimestamp.toString();
  const ets = eventsTimestamp;
  const lt = lts.slice(0, -3)
  const et = ets.slice(0, -3);

  if (lt === et) {
    await member.guild.members.ban(executor.id, {
      reason: `Unallowed Kick!`
    })
    await member.guild.owner.send(banned)
  }
})

// Anti Bot
client.on("guildMemberAdd", async (member) => {
  const logs = await member.guild.fetchAuditLogs({
    limit: 1,
    type: "BOT_ADD",
  })

  if (!logs) return console.log("unable to fetch logs...")
  const botlog = logs.entries.first();

  const { executor, target, createdAt, createdTimestamp } = botlog;
  const banned = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Bot Addition**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Bot :: **${target.username}**
> [+] Server :: **${member.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**
> [+] Banned **${target.username}**`)
    .setColor(0x00FFFF)

  if (executor.id === member.guild.owner.id) return;
  if (executor.id === client.user.id) return;
  let trustedusers = db.get(`trustedusers_${member.guild.id}`)
  if (trustedusers && trustedusers.find(find => find.user == executor.id)) return;

  const eventsTimestamp = Date.now().toString()
  const lts = createdTimestamp.toString();
  const ets = eventsTimestamp;
  const lt = lts.slice(0, -3)
  const et = ets.slice(0, -3);
  if (lt === et) {
    await guild.members.ban(executor.id, { reason: `Unallowed Bot Added!` })
    await member.guild.member(target.id).ban({ reason: `illegal bot` })
    await member.guild.owner.send(banned)
  }
})

// Channel Delete
client.on("channelDelete", async (channel) => {
  const logs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: "CHANNEL_DELETE",
  })
  if (!logs) return console.log("can't fetch logs...")
  const cdelete = logs.entries.first();

  const { executor, createdAt, createdTimestamp } = cdelete;
  const banned = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Channel Delete**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Channel :: **${channel.name}**
> [+] Server :: **${channel.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor(0x00FFFF)

  const banned1 = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **VC Channel Delete**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Channel :: **${channel.name}**
> [+] Server :: **${channel.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor(0x00FFFF)

  const banned2 = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Category Delete**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Channel :: **${channel.name}**
> [+] Server :: **${channel.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor(0x00FFFF)

  if (executor.id === channel.guild.owner.id) return;
  if (executor.id === client.user.id) return;
  let trustedusers = db.get(`trustedusers_${channel.guild.id}`)
  if (trustedusers && trustedusers.find(find => find.user == executor.id)) return;

  const eventsTimestamp = Date.now().toString()
  const lts = createdTimestamp.toString();
  const ets = eventsTimestamp;
  const lt = lts.slice(0, -3)
  const et = ets.slice(0, -3);

  if (lt === et) {
    if (channel.type === "text") {
      await channel.guild.member(executor.id).ban({ reason: `Unallowed Channel Deletion!` })
      await channel.guild.owner.send(banned)

    } else if (channel.type === "voice") {
      await channel.guild.member(executor.id).ban({ reason: `Unallowed VC Channel Deletion!` })
      await channel.guild.owner.send(banned1)

    } else if (channel.type === "category") {
      await channel.guild.member(executor.id).ban({ reason: `Unallowed Category Deletion!` })
      await channel.guild.owner.send(banned2)
    }
  }
})

// Channel Create
client.on("channelCreate", async (channel) => {
  const logs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: "CHANNEL_CREATE",
  })
  if (!logs) return console.log("can't fetch logs...")
  const clogs = logs.entries.first();

  const { executor, createdAt, createdTimestamp } = clogs;

  const banned = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Channel Create**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Channel :: **${channel.name}**
> [+] Server :: **${channel.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor(0x00FFFF)

  const banned1 = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **VC Channel Create**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Channel :: **${channel.name}**
> [+] Server :: **${channel.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor(0x00FFFF)

  const banned2 = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Category Create**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Channel :: **${channel.name}**
> [+] Server :: **${channel.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor(0x00FFFF)
  let trustedusers = db.get(`trustedusers_${channel.guild.id}`)
  if (executor.id === channel.guild.owner.id) return;
  if (executor.id === client.user.id) return;
  if (trustedusers && trustedusers.find(find => find.user == executor.id)) return;
  const eventsTimestamp = Date.now().toString()
  const lts = createdTimestamp.toString();
  const ets = eventsTimestamp;
  const lt = lts.slice(0, -3)
  const et = ets.slice(0, -3);

  if (lt === et) {
    if (channel.type === "text") {
      await channel.guild.member(executor.id).ban({ reason: `No channel creation allowed.` })
      await channel.guild.owner.send(banned)

    } else if (channel.type === "voice") {
      await channel.guild.member(executor.id).ban({ reason: `Unallowed VC Create!` })
      await channel.guild.owner.send(banned1)

    } else if (channel.type === "categoy") {
      await channel.guild.member(executor.id).ban({ reason: `Unallowed Category Create!` })
      await channel.guild.owner.send(banned2)
    }
  }
})

// Role Create
client.on("roleCreate", async (role) => {
  const logs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: "ROLE_CREATE",
  })
  if (!logs) return console.log("can't fetch logs...")
  const rlog = logs.entries.first();

  const { executor, createdAt, createdTimestamp } = rlog;
  const banned = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Role Create**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Role :: **${role.name}**
> [+] Server :: **${role.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor(0x00FFFF)

  const eventsTimestamp = Date.now().toString()
  const lts = createdTimestamp.toString();
  const ets = eventsTimestamp;
  const lt = lts.slice(0, -3)
  const et = ets.slice(0, -3);

  if (executor.id === role.guild.owner.id) return;
  if (executor.id === client.user.id) return;
  let trustedusers = db.get(`trustedusers_${role.guild.id}`)
  if (trustedusers && trustedusers.find(find => find.user == executor.id)) return;

  if (lt === et) {
    await role.guild.member(executor.id).ban({ reason: "Unallowed Role Creation" })
    await role.guild.owner.send(banned)
  }
})

// Role Delete
client.on("roleDelete", async (role) => {
  const logs = await role.guild.fetchAuditLogs({
    limit: 1,
    type: "ROLE_DELETE",
  })
  if (!logs) return console.log("can't fetch logs...")
  const rlog = logs.entries.first();

  const { executor, createdAt, createdTimestamp } = rlog;
  const banned = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Role Delete**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Role :: **${role.name}**
> [+] Server :: **${role.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor(0x00FFFF)
  if (executor.id === role.guild.owner.id) return;
  if (executor.id === client.user.id) return;
  let trustedusers = db.get(`trustedusers_${role.guild.id}`)
  if (trustedusers && trustedusers.find(find => find.user == executor.id)) return;

  const eventsTimestamp = Date.now().toString()
  const lts = createdTimestamp.toString();
  const ets = eventsTimestamp;
  const lt = lts.slice(0, -3)
  const et = ets.slice(0, -3);

  if (lt === et) {
    await role.guild.member(executor.id).ban({ reason: "Unallowed Role Creation" })
    await role.guild.owner.send(banned)
  }
})

client.on("webhookUpdate", async channel => {
  const logs = await channel.guild.fetchAuditLogs({
    limit: 1,
    type: "WEBHOOK_CREATE"
  })
  if (!logs) return console.log("unable to fetch logs for webhook creation")
  const wlogs = logs.entries.first();
  if (!wlogs) return console.log("can't fetch executor");

  const { executor, target, createdTimestamp } = wlogs;

  if (executor.id === channel.guild.owner.id) return;
  if (executor.id === client.user.id) return;
  let trustedusers = db.get(`trustedusers_${channel.guild.id}`)
  if (trustedusers && trustedusers.find(find => find.user == executor.id)) return;

  const eventsTimestamp = Date.now().toString()
  const lts = createdTimestamp.toString();
  const ets = eventsTimestamp;
  const lt = lts.slice(0, -3)
  const et = ets.slice(0, -3);

  const banned = new Discord.MessageEmbed()
    .setDescription(`> :warning: **__NOTIFICATION!__**
> [+] Event :: **Webhook Create**
> [+] Executor :: **${executor.tag}**

>  :mega: **__DESCRIPTION:__**
> [+] Webhook :: **${target.name}**
> [+] Server :: **${channel.guild.name}**

> :dart: **__ACTIONS:__**
> [+] Banned **${executor.username}**`)
    .setColor("FF1493")

  if (lt === et) {
    await channel.guild.member(executor.id).ban({ reason: `Unallowed Webhook Create!` })
    await channel.guild.owner.send(banned)
  }
})

client.login(token);

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('ok!')
})

app.listen(port, () => { })

process.on("unhandledRejection", (reason, promise) => {
  // console.log("Unhandled Rejection at: " + promise)
  // console.log("Reason: " + reason)
})
process.on("uncaughtException", (err, origin) => {
  console.log("Caught exception: " + err)
  console.log("Origin: " + origin)
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log(err);
  console.log("Origin: " + origin)
});
process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});
process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});
process.on('multipleResolves', (type, promise, reason) => {
  console.log(type, promise, reason);
});