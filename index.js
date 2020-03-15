const Discord = require("discord.js");
const client = new Discord.Client();
const clanInfo = require("./apiHelper.js");
const discordToken = require("./ignorefiles/discordToken.js");
const apiToken = require("./ignorefiles/apiToken.js");
const prefix = "!";

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  console.log(message.content);

  const args = message.content.slice(prefix.length).split(/ +/);
  
  const command = args.shift().toLowerCase();
  const param= args.shift(); // once there are multiple commands that may require multiple params, pass "args" to deal with the number of params 
  console.log(param);
  const stat = await clanInfo(param, apiToken());
  console.log(stat);
  message.channel.send(JSON.parse(stat.responseText).name);
});

client.login(discordToken());
