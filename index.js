const https = require('https');
const fs = require('fs');
var cron = require('node-cron');

var fileObjs = fs.readdirSync("repo/items", { withFileTypes: true });
var noWikiLinks = new Array();
var addedWikiLinks = new Array(); 
var failedWikiLinks = new Array();  
for(var i in fileObjs){
    var rawdata = fs.readFileSync(`repo/items/${fileObjs[i].name}`, function (err){
        if(err){
            return;
        }
    });
    var json = JSON.parse(rawdata);
    if(!json.hasOwnProperty("info") && json.itemid != "minecraft:enchanted_book" && json.displayname != "§fMusic Disc"){
        noWikiLinks.push(fileObjs[i].name);
        console.log(getName(json.displayname));
    }
}

cron.schedule('* * * * *', () => {
    console.log('running a task every minute');
});

function getName(displayName){
    return displayName.slice(2);
}

/*var writtenData = JSON.stringify(noWikiLinks, null, 2);
fs.writeFileSync(`data.json`, writtenData, function (err){
    if (err) {
        return console.log(err);
        }
});*/
