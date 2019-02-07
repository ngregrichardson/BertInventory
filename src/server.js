const express = require('express');
const bodyParser = require('body-parser');
const _ = require('underscore');
const fs = require('fs');
const app = express();
const port = 4750;
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.get('/styles', (req, res) => res.sendFile(__dirname + '/styles.css'));
app.get('/add', (req, res) => res.sendFile(__dirname + '/images/add.svg'));
app.get('/delete', (req, res) => res.sendFile(__dirname + '/images/delete.svg'));
app.get('/form', (req, res) => res.sendFile(__dirname + '/images/form.svg'));
app.get('/search', (req, res) => res.sendFile(__dirname + '/images/search.svg'));
app.get('/storage', (req, res) => res.sendFile(__dirname + '/images/storage.png'));
app.get('/jquery', (req, res) => res.sendFile(__dirname + '/js/jquery.js'));
app.get('/jszip', (req, res) => res.sendFile(__dirname + '/js/jszip.min.js'));
app.get('/filesaver', (req, res) => res.sendFile(__dirname + '/js/FileSaver.min.js'));
app.get('/excel', (req, res) => res.sendFile(__dirname + '/js/myexcel.js'));
app.get('/index', (req, res) => res.sendFile(__dirname + '/js/index.js'));
app.get('/data', (req, res) => res.sendFile(__dirname + '/data/data.json'));
app.get('/students', (req, res) => res.sendFile(__dirname + '/data/students.json'));
app.get('/locations', (req, res) => res.sendFile(__dirname + '/data/locations.json'));
app.get('/teams', (req, res) => res.sendFile(__dirname + '/data/teams.json'));
app.get('/priorities', (req, res) => res.sendFile(__dirname + '/data/priorities.json'));

app.post('/save', function(req, res) {
  fs.writeFile(__dirname + '/data/data.json', _.keys(req.body)[0], (err) => {
    if (err) {
      console.log(err);
    }else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, () => startup());

function startup() {
  console.error('If you close this window, Bert Inventory will not work until you relaunch.');
}
