const { get } = require("snekfetch");
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'covid',
    description: 'NULL',
    guildOnly: true,
    args: false,
    usage: false,
    async execute(message, args) {
    const { body } = await get("https://corona.lmao.ninja/v2/all/");
    
    const embed = new MessageEmbed();
      embed.setColor("RANDOM");
      embed.addField("Cases", `${body.cases}`);
      embed.addField("Active", `${body.active}`);
      embed.addField("Recovered", `${body.recovered}`);
      embed.addField("Critical", `${body.critical}`);
      embed.addField("Deaths", `${body.deaths}`);
      embed.addField("Cases Today", `${body.todayCases}`);
      embed.addField("Deaths Today", `${body.todayDeaths}`);
    return message.channel.send({ embed: embed });
    }
};
