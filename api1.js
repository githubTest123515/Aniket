const https = require('https');
const apiFn = require('./apiFile');
let url = "https://poetrydb.org/title/Ozymandias/lines.json";

try{
    apiFn.printData(url);
}
catch(err){
    console.log(err);
}

