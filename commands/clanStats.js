const Discord = require("discord.js");
const apiCaller = require("../apiHelper.js");
const apiToken = require("../apiToken.js");

module.exports = {
  name: "Clan Stats",
  prefix: "cstats",
  description: "Obtains stats from any clan",
  async execute(message, args) {
    if (!Array.isArray(args) || !args.length) {
      message.channel.send("Please enter a Clan tag without the #");
      return;
    }
    try {
      let endpoint = "https://api.clashroyale.com/v1/clans/%23" + args[0].toUpperCase();
      const stat = await apiCaller(endpoint, apiToken());

      formatingClan(message, stat);
    } catch (error) {
      console.log(error);
      message.channel.send(`Error ${error}`);
    }
  }
};
function formatingClan(message, stat) {
  const responseText = JSON.parse(stat.responseText);
  console.log(stat.status);
  if (stat.status !== 200) {
    throw `${stat.status} ${responseText.reason}`;
  }
  const emb = new Discord.MessageEmbed()
    .setTitle(`${responseText.name} || ${responseText.tag}`)
    .setURL(`https://royaleapi.com/clan/${responseText.tag.substring(1)}`)
    .setAuthor(
      `${responseText.name} || ${responseText.tag}`,
      "https://vignette.wikia.nocookie.net/clashroyale/images/b/b2/League8.png/revision/latest?cb=20170317224400",
      `https://royaleapi.com/clan/${responseText.tag.substring(1)}`
    )
    .setColor(0x000000)
    .addFields(
      {
        name: "Description",
        value: `${responseText.description} `,
        inline: false
      },
      {
        name: "Clan Score",
        value: `${responseText.clanScore} `,
        inline: true
      },
      {
        name: "War Trophies",
        value: responseText.clanWarTrophies,
        inline: true
      },
      {
        name: "Type",
        value: responseText.type,
        inline: true
      },
      {
        name: "Weekly Donations",
        value: responseText.donationsPerWeek,
        inline: true
      },
      {
        name: "Members",
        value: `${responseText.members} / 50`,
        inline: true
      },
      {
        name: "Required Trophies ",
        value: responseText.requiredTrophies,
        inline: true
      }
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
}
function add(total, current, index) {
  if (index % 3 != 0) {
    total = total + "\t" + current;
  } else {
    total = total + "\n" + current;
  }
  return total;
}
