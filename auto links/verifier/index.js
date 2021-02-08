const express = require('express');
const fs = require('fs');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

app.post('/api', (request, response) => {
  const data = request.body;
  console.log(data);
  var fileObjs = fs.readdirSync("to-be-verified", { withFileTypes: true });
  if(data.input == 'yes'){
      console.log('yes');
    fs.renameSync(`to-be-verified/${fileObjs[0].name}`,`verified/${fileObjs[0].name}`, function (err){
        if(err){
            return;
        }
      });
  }else if(data.input == 'no'){
    fs.unlinkSync(`to-be-verified/${fileObjs[0].name}`, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
  }
  if(data.input != 'refresh'){
    var rawdata = fs.readFileSync(`to-be-verified/${fileObjs[1].name}`, function (err){
        if(err){
            return;
        }
    });
    }else{
        var rawdata = fs.readFileSync(`to-be-verified/${fileObjs[0].name}`, function (err){
            if(err){
                return;
            }
        });
    }
  var json = JSON.parse(rawdata);
  const ans = {
      DN : json.displayname, 
      IN : json.internalname, 
      LN : json.info[0]
    };
  response.json(ans);
});