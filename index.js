const { http, https } = require('follow-redirects');
const fs = require('fs');
var cron = require('node-cron');

var fileObjs = fs.readdirSync("repo/items", { withFileTypes: true });
var noWikiLinks = new Array();
var addedWikiLinks = new Array(); 
var failedWikiLinks = new Array();  
var current = 0;
for(var i in fileObjs){
    var rawdata = fs.readFileSync(`repo/items/${fileObjs[i].name}`, function (err){
        if(err){
            return;
        }
    });
    var json = JSON.parse(rawdata);
    if(!json.hasOwnProperty("info") && json.itemid != "minecraft:enchanted_book" && json.displayname != "§fMusic Disc" && json.itemid != "minecraft:potion"){
        noWikiLinks.push(fileObjs[i].name);
    }
}

cron.schedule('*/2 * * * * *', () => {
    var rawdata = fs.readFileSync(`repo/items/${noWikiLinks[current]}`, function (err){
        if(err){
            return;
        }
    });
    var json = JSON.parse(rawdata);
    console.log('making request');
    const request = https.request({
        host: 'hypixel-skyblock.fandom.com',
        path: `/wiki/${getName(json.displayname)}`,
    }, response => {
        console.log(response.responseUrl, json.displayname, response.statusCode);
        if(response.statusCode != 200){
            failedWikiLinks.push(noWikiLinks[current]);
            return current++;
        }else if(response.responseUrl.includes('#') || response.responseUrl.includes('(Disambiguation)')|| response.responseUrl.includes('Bows')|| response.responseUrl.includes('Swords') || json.internalname.includes('BUILDER')){
            failedWikiLinks.push(noWikiLinks[current]);
            return current++;
        }
        json.infoType = "WIKI_URL";
        json.info = [response.responseUrl];

        addedWikiLinks.push(noWikiLinks[current]);

        var writtenData = JSON.stringify(json, null, 2);
        fs.writeFileSync(`modified/${noWikiLinks[current]}`, writtenData, function (err){
            if (err) {
                return console.log(err);
                }
        });
        var writtenData = JSON.stringify(addedWikiLinks, null, 2);
        fs.writeFileSync(`info/added.json`, writtenData, function (err){
            if (err) {
                return console.log(err);
                }
        });
        var writtenData = JSON.stringify(failedWikiLinks, null, 2);
        fs.writeFileSync(`info/failed.json`, writtenData, function (err){
            if (err) {
                return console.log(err);
                }
        });

        current++;
    });
    request.end();
});

function getName(displayName){
    var indices = [];
    for(var i=0; i<displayName.length;i++) {
        if (displayName[i] === "§") indices.push(i);
    }
    for(var i in indices){
        displayName = displayName.slice(0,indices[i]-2*i) + displayName.slice((indices[i]+2)-2*i);
    }
    displayName = displayName.split(' ').join('_');
    return displayName;
}

