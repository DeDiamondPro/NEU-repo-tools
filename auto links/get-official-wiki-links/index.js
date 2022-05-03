const { http, https } = require('follow-redirects');
const fs = require('fs');
var cron = require('node-cron');

var fileObjs = fs.readdirSync("repo/items", { withFileTypes: true });
var noWikiLinks = new Array();
var addedWikiLinks = new Array(); 
var failedWikiLinks = new Array();  
var current = 0;
let busy = false;
for(var i in fileObjs){
    const rawdata = fs.readFileSync(`repo/items/${fileObjs[i].name}`, function (err){
        if(err){
            return;
        }
    });
    const json = JSON.parse(rawdata);
    let foundLink = false;
    for (let link of json.info) {
        if (link.startsWith('wiki.hypixel.net')) {
            foundLink = true;
            break;
        }
    } 
    if (!foundLink && json.itemid != "minecraft:enchanted_book" && json.itemid != "minecraft:potion")
        noWikiLinks.push(fileObjs[i].name);
}

cron.schedule('* * * * * *', () => {
    if(busy) return;
    busy = true;
    var rawdata = fs.readFileSync(`repo/items/${noWikiLinks[current]}`, function (err){
        if(err){
            return;
        }
    });
    var json = JSON.parse(rawdata);
    let name = getName(json.displayname);
    const split = name.split('_');
    if (!/[^XVIxvii]/gm.test(split[split.length - 1])) {
        split.pop();
    }
    name = split.join('_');
    if (name.endsWith('_Minion_Skin')) {
        name = 'Minion_Skins';
    }
    if (json.itemid == "minecraft:enchanted_book") {
        name = 'Enchantments';
    }
    if (json.itemid == "minecraft:potion") {
        name = 'Potions';
    }
    console.log('making request');
    const request = https.request({
        host: 'wiki.hypixel.net',
        path: `/${encodeURIComponent(name)}`,
        headers: {
            'User-Agent': 'Mozilla/5.0'
        }
    }, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            console.log(response.responseUrl, json.displayname, response.statusCode);
            let info = json.info;
            if(typeof info == 'undefined') info = [];
            if (response.statusCode != 200){
                failedWikiLinks.push(noWikiLinks[current]);
                busy = false;
                return current++;
            } else {
                info.push(response.responseUrl.split('#')[0]);
            }
            if (!/<h1 id="section_0">(Vanilla (Food|(Redstone )?Items)|Decorative Block Variations|)<\/h1>/gm.test(data)) {
                json.infoType = "WIKI_URL";
                json.info = info;
                json.modver = "2.1.0-REL";
                addedWikiLinks.push(noWikiLinks[current]);
            } else {
                console.log('filtered');
                busy = false;
                return current++;
            }

            var writtenData = JSON.stringify(json, null, 2);
            fs.writeFileSync(`modified/${json.internalname}.json`, writtenData, function (err){
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
            busy = false;
        })
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
    displayName = displayName.replaceAll(/\(.+\)/gm, '');
    if (displayName.includes('[Lvl {LVL}] ')) {
        displayName = displayName.replace('[Lvl {LVL}] ', '') + ' Pet';
    }
    displayName.trim();
    const split = displayName.split(' ');
    for (let i in split) {
        const s = split[i];
        split[i] = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    }
    return split.join('_');
}

