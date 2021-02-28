const fs = require('fs');
var cron = require('node-cron');

var fileObjs = fs.readdirSync("repo/items", { withFileTypes: true });
for(var i in fileObjs){
    var changed = false;
    var rawdata = fs.readFileSync(`repo/items/${fileObjs[i].name}`, function (err){
        if(err){
            return;
        }
    });
    var json = JSON.parse(rawdata);
    if(json.nbttag.includes("uuid")){
        json.nbttag = json.nbttag.substr(0,json.nbttag.indexOf("uuid")-1)+json.nbttag.substr(json.nbttag.indexOf("uuid")+43);
        changed = true;
    }
    if(json.nbttag.includes("timestamp")){
        console.log(fileObjs[i].name);
        changed = true;
    }

    if(changed){
        var writtenData = JSON.stringify(json, null, 2);
        fs.writeFileSync(`modified/${fileObjs[i].name}`, writtenData, function (err){
            if (err) {
                return console.log(err);
                }
        });
    }
}



