let format = require('date-fns').format;
let parseISO = require('date-fns').parseISO;
let Discord = require("discord.js");
let CronJob = require("cron").CronJob;
let config = require("./config.json");
let Parser = require('rss-parser');
let parser = new Parser();

const client = new Discord.Client();

client.login(config.BOT_TOKEN);

var job = new CronJob('0 11 * * *', function () {
  (async () => {
    let feed = await parser.parseURL(config.RSS_FEED);
    const channel = client.channels.cache.find(channel => channel.name === config.CHANNEL_NAME)
    feed.items.forEach(item => {
      if (term.includes(',')) {
        var terms = term.split(',');
        terms.forEach(searchTerm => {
          CompareTitleToSearchTerm(searchTerm, item, channel);
        })
      } else {
        CompareTitleToSearchTerm(term, item, channel);
      }
    });
  })();
}, null, true, config.TIMEZONE);

client.on('ready', () => {
  job.start();
});

function CompareTitleToSearchTerm(term, article, channel) {
  if (article.title.includes(term)) {
    if (format(new Date(parseISO(article.isoDate)), 'd') === format(new Date(), 'd')) {
      channel.send(article.title + "\n" + article.link)
    }
  }
}
