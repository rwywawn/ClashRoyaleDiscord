const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const discordToken = require("./discordToken.js");
const prefix = "!";

// Dynamic Command Handler
client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.prefix, command);
}
//On startup
client.once("ready", () => {
  console.log("Ready!");
});
//When listening
client.on("message", async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  console.log(message.content);

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  if (!client.commands.has(command)) return;
  // Command handler
  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.log(error);
    message.reply(error);
  }

  message.channel.send("done");
});

client.login(discordToken());
