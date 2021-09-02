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
  job.start();
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
  const channel = client.channels.cache.find(channel => channel.name === config.CHANNEL_NAME)
  const now = new Date();
  let dateExport = date.format(now, 'YYYY-MM-DD');  
  let feed = await parser.parseURL(config.RSS_FEED);
  let term = config.SEARCH_TERM;
  var message = new Discord.MessageEmbed({
    title:"Articles related to COVID-19 for "+ dateExport,
  })
  feed.items.forEach(item => {
    if (term.includes(',')) {
      var terms = term.split(',');
      terms.forEach(searchTerm => {
        if(CompareTitleToSearchTerm(searchTerm, item)){
          message.addFields({
            name: item.title,
            value:item.link
          });
        }
      })
    } else {
      if(CompareTitleToSearchTerm(term, item)){
        message.addFields({
          name: item.title,
          value:item.link
        });
      }
    }
  });
  channel.send(message)
}

function CompareTitleToSearchTerm(term, article) {
  if (article.title.includes(term)) {
    if (format(new Date(parseISO(article.isoDate)), 'd') === format(new Date(), 'd')) {
      return true;
    }
  }
}
