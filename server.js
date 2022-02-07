require('dotenv').config();
var express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const autoRoutes = require('express-auto-routes');
var app = express();

const initDBServices = require('./services/db/index');
const sendEmail = require('./utils/email');

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,{ useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection

db.on('error',(err) => {
  console.log(err);
});

db.once('open',() => {
  console.log("DataBase successFully Connected");
});

const corsOptions ={
  origin:`http://${process.env.UI_HOST}:${process.env.UI_PORT}`, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

//Auto Routes
const routes = autoRoutes(app);
routes(path.join(__dirname, './routes'));

global.services = {
  db: initDBServices(),
};

app.listen(8081, function () {
   var host = process.env.SERVER_HOST
   var port = process.env.SERVER_PORT
   console.log("Server http://%s:%s", host, port);
})