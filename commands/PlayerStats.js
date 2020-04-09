const Discord = require("discord.js");
const apiCaller = require("../apiHelper.js");
const apiToken = require("../apiToken.js");

module.exports = {
  name: "Player Stats",
  prefix: "pstats",
  description: "Obtains stats from any player",
  async execute(message, args) {
    if (!Array.isArray(args) || !args.length) {
      message.channel.send("Please enter a Clan tag without the #");
      return;
    }
    try {
      let endpoint = "https://api.clashroyale.com/v1/players/%23" + args[0].toUpperCase();
      const stat = await apiCaller(endpoint, apiToken());
      formatingPlayer(message, stat);
    } catch (error) {
      console.log(error);
      message.channel.send(`Error ${error}`);
    }
  }
};

function formatingPlayer(message, stat) {
  const responseText = JSON.parse(stat.responseText);
  console.log(stat.status);
  if (stat.status !== 200) {
    throw `${stat.status} ${responseText.reason}`;
  }

  let maxed = [],
    legendary = [],
    gold = [],
    silver = [],
    bronze = [];
  card(responseText.cards, maxed, legendary, gold, silver, bronze);

  maxed = maxed.reduce(add);
  legendary = legendary.reduce(add);
  gold = gold.reduce(add);
  silver = silver.reduce(add);
  bronze = bronze.reduce(add);

  //checking if in clan
  if (!responseText.clan) {
    responseText.clan = {
      name: "",
      tag: ""
    };
  }
  if (!responseText.leagueStatistics) {
    message.channel.send("Player never played a game");
    return;
  }
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
      {
        name: "Max Wins",
        value: responseText.challengeMaxWins,
        inline: true
      },
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
}

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
  if (!Array.isArray(maxed) || !maxed.length) {
    maxed.push("No Cards");
  }
  if (!Array.isArray(legendary) || !legendary.length) {
    legendary.push("No Cards");
  }
  if (!Array.isArray(gold) || !gold.length) {
    gold.push("No Cards");
  }
  if (!Array.isArray(silver) || !silver.length) {
    silver.push("No Cards");
  }
  if (!Array.isArray(bronze) || !bronze.length) {
    bronze.push("No Cards");
  }
}

function add(total, current, index) {
  if (index % 3 != 0) {
    total = total + "\t" + current;
  } else {
    total = total + "\n" + current;
  }
  return total;
}
