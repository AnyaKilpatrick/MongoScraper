var express = require("express");
var app = express();
var db=require("../models");
var axios=require("axios");
var cheerio=require("cheerio");


module.exports = function(app){
    // home page
    app.get("/", function(req, res){
        // grabbing data from Articles collection
        db.Article.find({}).then(function(dbArticle){
            console.log("dbArticle!!!!!!!!" + dbArticle.length);
            if(dbArticle.length>0){
                console.log("found "+dbArticle.length+"results");
                // creating an object to pass it to index handlebar
                var hbsObject = {
                    articles: dbArticle
                };
                res.render("index", hbsObject);
            }else{
                res.render("index");
            }
        })
        .catch(function(err){
            // in case of error
            res.json(err);
        })
        console.log("Home page launched");
    })
    // scrape news
    app.get("/scrape", function(req, res){
        // grabbing body of html request
        axios.get("http://www.bbc.com/travel/").then(function(response){
            // loading it into cheerio
            var $ = cheerio.load(response.data);

            $("div.promo-unit-layout-standard").each(function(i, element){
                // saving empty result object
                var result = {};
                // grabbing img, title, summary and link of each div(article)
                result.title = $(element)
                    .find("h3.promo-unit-title")
                    .text();
                result.articleLink = $(element)
                    .find("h3.promo-unit-title")
                    .parent("a")
                    .attr("href");
                result.summary = $(element)
                    .find("p.promo-unit-summary")
                    .text();
                result.imgLink = $(element)
                    .find("a")
                    .attr("href")
                    .replace("130_73", "976_549"); //replacing it in an img src, so we can load a higher quality picture
                console.log(result);
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
            })
        })
    })
}