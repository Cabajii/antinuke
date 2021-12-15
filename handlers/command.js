//INITIALIZATION
const { readdirSync } = require("fs");
const ascii = require("ascii-table");

//NEW ASCII TABLE
let table = new ascii("Commands");
table.setHeading("Command", "Command Load Status");

//NEW MODULE
module.exports = client => {
  //READS EVERY COMMAND IN COMMANDS FOLDER
  readdirSync("./commands/").forEach(dir => {
    //READS ONLY JS FILES
    const commands = readdirSync(`./commands/${dir}/`).filter(file =>
      file.endsWith(".js")
    );
 
//SHOWS THE LOADED COMMAND DURING THE STARTING OF THE BOT
for (let file of commands) {
      let pull = require(`../commands/${dir}/${file}`);

      if (pull.name) {
        client.commands.set(pull.name, pull);
        table.addRow(file, "✅");
      } else {
        table.addRow(
          file,
          `❌  -> missing a help.name, or help.name is not a string.`
        );
        continue;
      }
  
//PULLS THE ALIASES
if (pull.aliases && Array.isArray(pull.aliases))
        pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
    }
  });
  
//LOG THE TABLE IN THE CONSOLE IN STRING FORM
console.log(table.toString());
};
