let format = require('date-fns').format;
let parseISO = require('date-fns').parseISO;
let Discord = require("discord.js");
let CronJob = require("cron").CronJob;
let config = require("./config.json");
let Parser = require('rss-parser');
let axios = require('axios');
let parser = new Parser();
let date = require('date-and-time');

const client = new Discord.Client();

client.login(config.BOT_TOKEN);

var job = new CronJob('0 12 * * *', function () {
  (async () => {
    sendDiscordBotCOVIDStats();    
    sendDiscordBotArticle();
  })();
}, null, true, config.TIMEZONE);

client.on('ready', () => {
  sendDiscordBotCOVIDStats();    
});

async function sendDiscordBotCOVIDStats(){
  const channel = client.channels.cache.find(channel => channel.name === config.CHANNEL_NAME)
  const now = new Date();
  let dateExport = date.format(now, 'YYYY-MM-DD');  
  let feed = await axios.get("https://api.covid19tracker.ca/reports/province/ON?date="+dateExport);
  let payload = feed.data.data[0];
  let casePer = ((payload.change_cases/payload.change_tests)*100).toFixed(2)+"%"
  var message = new Discord.MessageEmbed({
    title:"Daily COVID Number in Ontario for "+ dateExport,
    url:"https://covid19tracker.ca/"
  }).addFields(
		{ name: 'New Cases', value: payload.change_cases , inline:  true },
    { name: 'New Tests', value: payload.change_tests , inline:  true },
    { name: 'Positivety Percentage', value: casePer , inline:  true },
    { name: 'New Recoveries', value: payload.change_recoveries , inline:  true },
    { name: 'New Fatalities', value: payload.change_fatalities , inline:  true },
    { name: '\u200B', value: '\u200B' },
    { name: 'New Hospitalizations', value: payload.change_hospitalizations, inline:  true  },
    { name: 'Total Hospitalizations', value: payload.total_hospitalizations, inline:  true  },
    { name: '\u200B', value: '\u200B' },
    { name: 'New Criticals', value: payload.change_criticals ,inline:  true },
    { name: 'Total Criticals', value: payload.total_criticals ,inline:  true }
	);
  channel.send(message)
}


async function sendDiscordBotArticle(){
  let feed = await parser.parseURL(config.RSS_FEED);
  let term = config.SEARCH_TERM;
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
}

function CompareTitleToSearchTerm(term, article, channel) {
  if (article.title.includes(term)) {
    if (format(new Date(parseISO(article.isoDate)), 'd') === format(new Date(), 'd')) {
      channel.send(article.title + "\n" + article.link)
    }
  }
}
