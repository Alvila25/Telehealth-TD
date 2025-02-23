console.log('Yo, app.js is alive!');
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Telehealth-TCD is testing, bro!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on ${PORT}, let’s go!`));
