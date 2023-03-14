const express = require('express');
const path = require('path');
const fs = require("fs");

const SCHEDULE = require('./schedule.json');

const app = express();

// Makes the /public folder visible
app.use(express.static(path.join(__dirname, 'public')));

// sets an HTML friendly default runtime engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', (_, res) => { res.render('index') });

app.get('/schedule', (_, res) => {
    res.json(SCHEDULE);
});

app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
})