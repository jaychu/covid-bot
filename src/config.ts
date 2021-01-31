import jsonfile from 'jsonfile';

const filepath = "./config.json"
const defaultConfig = {
    BOT_TOKEN : "XXX",
    RSS_FEED:"https://www.cbc.ca/cmlink/rss-canada-toronto",
    SEARCH_TERM:"COVID-19 cases",
    CHANNEL_NAME:"covid-19",
    TIMEZONE:"America/Toronto"
}

export default async function exportConfig(){
    return await jsonfile.readFile(filepath,function (err, obj) {
        console.log("running export config");
        if (err){
            console.error(err);
        } 
        if(obj){
            return obj;
        }else{
            createConfig();
            return defaultConfig;            
        }
      });
}


function createConfig(){
    jsonfile.writeFile(filepath, defaultConfig, function (err) {
        console.log("running create config");
        if (err) console.error(err)
      })
}

