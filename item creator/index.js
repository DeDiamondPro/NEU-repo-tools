const express = require('express');
const fs = require('fs');

const app = express();
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

let input = "";

app.post('/api', (req, res) => {
    const data = req.body;
    console.log(data)
    //res.send({succes: true});
})