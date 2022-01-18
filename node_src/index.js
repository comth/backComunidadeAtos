
const express = require('express');
const json2xls = require('json2xls');
const bodyParser = require('body-parser');
const cors = require('cors');
const gmail = require('./functionalities/sendEmail');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(json2xls.middleware);

require('./controllers/confirmationController')(app);
require('./controllers/registerController')(app);
require('./controllers/authController')(app);
gmail.sendEmail();


var porta = process.env.PORT || 8080;
app.listen(porta);
console.log('ouvindo porta: ', porta);