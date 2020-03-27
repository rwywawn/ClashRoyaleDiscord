const Discord = require("discord.js");
const client = new Discord.Client();
const playerInfo = require("./apiHelper.js");
const discordToken = require("./discordToken.js");
const apiToken = require("./apiToken.js");
const prefix = "!";

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  console.log(message.content);

  const args = message.content.slice(prefix.length).split(/ +/);

  const command = args.shift().toLowerCase();
  const param = args.shift(); // once there are multiple commands that may require multiple params, pass "args" to deal with the number of params
  console.log(param);
  const stat = await playerInfo(param, apiToken());
  const responseText = JSON.parse(stat.responseText);
console.log(stat.status);
  let maxed = [];
  let legendary = [];
  let gold = [];
  let silver = [];
  let bronze = [];
  card(responseText.cards, maxed, legendary, gold, silver, bronze);
  console.log(maxed);
  maxed = maxed.reduce(add);
  legendary = legendary.reduce(add);
  gold = gold.reduce(add);
  silver = silver.reduce(add);
  bronze = bronze.reduce(add);
  const emb = new Discord.MessageEmbed()
    .setTitle(`${responseText.clan.name} || ${responseText.clan.tag}`)
    .setURL(`https://royaleapi.com/clan/${responseText.clan.tag.substring(1)}`)
    .setAuthor(
      `${responseText.name} || ${responseText.tag}`,
      "https://vignette.wikia.nocookie.net/clashroyale/images/b/b2/League8.png/revision/latest?cb=20170317224400",
      `https://royaleapi.com/player/${responseText.tag.substring(1)}`
    )
    .setColor(0x000000)
    .addFields(
      {
        name: "Trophies",
        value: `${responseText.leagueStatistics.currentSeason.trophies} / ${responseText.leagueStatistics.bestSeason.trophies} PB`,
        inline: true
      },
      { name: "War Wins", value: responseText.warDayWins, inline: true },
      {
        name: "War Cards",
        value: responseText.clanCardsCollected,
        inline: true
      },
      { name: "Max Wins", value: responseText.challengeMaxWins, inline: true },
      {
        name: "Challange Cards",
        value: responseText.challengeCardsWon,
        inline: true
      },
      { name: "Donations", value: responseText.totalDonations, inline: true },
      {
        name: "Maxed ",
        value: maxed
      },
      { name: "Legendary ", value: legendary },
      { name: "Gold", value: gold },
      { name: "Silver", value: silver },
      { name: "Bronze", value: bronze }
    )
    .setThumbnail(
      "https://royaleapi.com/static/img/badge/legendary/flag_j_02.png?t=688ce30de42a5051c87d9e7e50fbdfd82e65db20"
    )
    .setTimestamp();
  message.channel.send(emb);
});

client.login(discordToken());

function card(cardJson, maxed, legendary, gold, silver, bronze) {
  for (let i = 0; i < cardJson.length; i++) {
    let difference = cardJson[i].maxLevel - cardJson[i].level;
    if (difference == 0) {
      maxed.push(cardJson[i].name);
    } else if (difference === 1) {
      legendary.push(cardJson[i].name);
    } else if (difference === 2) {
      gold.push(cardJson[i].name);
    } else if (difference === 3) {
      silver.push(cardJson[i].name);
    } else if (difference === 4) {
      bronze.push(cardJson[i].name);
    }
  }
}
function add(total, current, index) {
  if (index % 3 != 0) {
    total = total + '\t' + current;
  } else {
    total = total + "\n" + current;
  }
  return total;
}
