import {Client} from 'discord.js';
import {format, parseISO} from 'date-fns';
import {CronJob} from 'cron';
import exportConfig from './config';
import Parser from 'rss-parser';

let parser = new Parser();
const client = new Client();

exportConfig().then(value =>{
    console.log(value)
});
