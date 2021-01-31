import {Client} from 'discord.js';
import {filename} from './constants'
import {format, parseISO} from 'date-fns';
import {CronJob} from 'cron';
import Parser from 'rss-parser';

const config = require("../"+filename);
let parser = new Parser();
const client = new Client();

console.log(config.BOT_TOKEN);

