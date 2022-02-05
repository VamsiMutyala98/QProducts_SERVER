require('dotenv').config();
var express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
var app = express();

const corsOptions ={
  origin:`http://${process.env.UI_HOST}:${process.env.UI_PORT}`, 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsOptions));

const autoRoutes = require('express-auto-routes')(app);

autoRoutes(path.join(__dirname, './routes'));

app.listen(8081, function () {
   var host = process.env.SERVER_HOST
   var port = process.env.SERVER_PORT
   
   console.log("Example app listening at http://%s:%s", host, port);
})