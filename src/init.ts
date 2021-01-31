import jsonfile from 'jsonfile';
import {filename,defaultConfig} from './constants'

console.log("beginning init sequence");
jsonfile.readFile(filename)
.then(value=>{
    console.log("loading the following config values from:" + filename);
    console.log(value);
    })
.catch(err=>{
    console.log(err);
    console.log("File creation needed!");
    jsonfile.writeFile(filename, defaultConfig);
});
