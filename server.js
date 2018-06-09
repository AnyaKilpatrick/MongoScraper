// requiring npm packages
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
// scraping tool (axios & cheerio)
// axios is a promised-based http library
var axios = require("axios");
var cheerio = require("cheerio");


var PORT = process.env.PORT||3000;

var app = express();
// requiring models
var db = require("./models");

// serve static content from the "public" directory
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// Use morgan logger for logging requests
app.use(logger("dev"));


// setting handlebars
var exhbs = require("express-handlebars");

// setting up handlebars as an app engine
app.engine("handlebars", exhbs({defaultLayout:"main"}));
app.set("view engine", "handlebars");

// importing routes
require("./routes/routes.js")(app);

// connecting to the MongoDB
// mongoose.connect("mongodb://localhost/travelNewsScraper");
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/travelNewsScraper";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);



// srating the server
app.listen(PORT, function(){
    console.log("App listening on PORT "+ PORT);
})